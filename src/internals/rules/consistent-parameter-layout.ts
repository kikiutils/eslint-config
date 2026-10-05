import type {
    Rule,
    SourceCode,
} from 'eslint';

type CallNode = Extract<Rule.Node, { type: 'CallExpression' | 'NewExpression' }> & { typeArguments?: Rule.Node };
type FunctionNode = Extract<
    Rule.Node,
    { type: 'ArrowFunctionExpression' | 'FunctionDeclaration' | 'FunctionExpression' }
>;

type ListItem = CallNode['arguments'][number] | FunctionNode['params'][number];
type TokenStore = Pick<
    SourceCode,
    'commentsExistBetween' | 'getFirstToken' | 'getLastToken' | 'getTokenAfter' | 'getTokenBefore' | 'getTokensBetween'
>;

interface TemplateParserServices {
    defineTemplateBodyVisitor?: (
        templateVisitor: Rule.RuleListener,
        scriptVisitor: Rule.RuleListener,
    ) => Rule.RuleListener;

    getTemplateBodyTokenStore?: () => TokenStore;
}

export const consistentParameterLayout: Rule.RuleModule = {
    create(context) {
        const { sourceCode } = context;

        function checkParameterLayout(
            node: Rule.Node,
            items: readonly ListItem[],
            tokenStore: TokenStore,
            isTemplate: boolean,
        ): void {
            const first = items[0];
            if (!first) return;
            const isSingleParameter = items.length === 1;

            // JSX argument layout belongs to the JSX formatting rules.
            const firstType: string = first.type;
            if (isSingleParameter && (firstType === 'JSXElement' || firstType === 'JSXFragment')) return;
            if (
                !isSingleParameter
                && !items.some((item) => item.loc && item.loc.start.line !== item.loc.end.line)
            ) return;

            let openingParen;
            if (node.type === 'CallExpression' || node.type === 'NewExpression') {
                const call = node as CallNode;
                openingParen = tokenStore.getTokenAfter(
                    call.typeArguments ?? call.callee,
                    (token) => token.type === 'Punctuator' && token.value === '(',
                );
            } else {
                openingParen = tokenStore.getTokenBefore(first);
            }

            const firstToken = tokenStore.getFirstToken(first);
            if (!openingParen || openingParen.value !== '(' || !firstToken) return;
            // An unparenthesized arrow must not borrow its parent's delimiters.
            if (openingParen.range[0] < node.range![0]) return;
            const closingParen = node.type === 'CallExpression' || node.type === 'NewExpression'
                ? tokenStore.getLastToken(node)
                : tokenStore.getTokenAfter(items.at(-1)!, (token) => token.value === ')');

            const next = tokenStore.getTokenAfter(openingParen)!;

            if (isSingleParameter) {
                if (!closingParen || closingParen.value !== ')') return;
                let previous = tokenStore.getTokenBefore(closingParen)!;
                const hasTrailingComma = previous.value === ',';
                if (hasTrailingComma) previous = tokenStore.getTokenBefore(previous)!;
                if (
                    tokenStore.commentsExistBetween(openingParen, next)
                    || tokenStore.commentsExistBetween(previous, closingParen)
                ) return;

                const removalRanges: [number, number][] = [];
                if (openingParen.loc.end.line !== next.loc.start.line) {
                    removalRanges.push([
                        openingParen.range[1],
                        next.range[0],
                    ]);
                }

                if (hasTrailingComma || previous.loc.end.line !== closingParen.loc.start.line) {
                    removalRanges.push([
                        previous.range[1],
                        closingParen.range[0],
                    ]);
                }

                if (!removalRanges.length) return;
                if (removalRanges.some(([start, end]) => !/^[\s,]*$/.test(sourceCode.text.slice(start, end)))) return;

                context.report({
                    fix: (fixer) => removalRanges.map((range) => fixer.removeRange(range)),
                    messageId: 'inlineSingle',
                    node,
                });

                return;
            }

            if (isTemplate) {
                // Script list formatters do not traverse Vue template expressions.
                const newlineOffsets: number[] = [];
                if (openingParen.loc.end.line === next.loc.start.line) newlineOffsets.push(openingParen.range[1]);
                for (let index = 1; index < items.length; index++) {
                    const item = items[index]!;
                    const comma = tokenStore.getTokensBetween(items[index - 1]!, item)
                        .find((token) => token.value === ',');

                    if (comma && comma.loc.end.line === tokenStore.getTokenAfter(comma)!.loc.start.line) {
                        newlineOffsets.push(comma.range[1]);
                    }
                }

                if (
                    closingParen?.value === ')'
                    && tokenStore.getTokenBefore(closingParen)!.loc.end.line === closingParen.loc.start.line
                ) newlineOffsets.push(closingParen.range[0]);

                if (newlineOffsets.length) {
                    context.report({
                        fix: (fixer) => newlineOffsets.map((offset) => fixer.insertTextAfterRange(
                            [
                                offset,
                                offset,
                            ],
                            '\n',
                        )),
                        messageId: 'newline',
                        node: first,
                    });
                }

                return;
            }

            if (openingParen.loc.end.line !== firstToken.loc.start.line) return;

            context.report({
                fix: (fixer) => fixer.insertTextAfter(openingParen, '\n'),
                messageId: 'newline',
                node: first,
            });
        }

        function createVisitor(tokenStore: TokenStore, isTemplate = false): Rule.RuleListener {
            return {
                ArrowFunctionExpression: (node) => checkParameterLayout(node, node.params, tokenStore, isTemplate),
                CallExpression: (node) => checkParameterLayout(node, node.arguments, tokenStore, isTemplate),
                FunctionDeclaration: (node) => checkParameterLayout(node, node.params, tokenStore, isTemplate),
                FunctionExpression: (node) => checkParameterLayout(node, node.params, tokenStore, isTemplate),
                NewExpression: (node) => checkParameterLayout(node, node.arguments, tokenStore, isTemplate),
            };
        }

        const scriptVisitor = createVisitor(sourceCode);
        const parserServices = sourceCode.parserServices as TemplateParserServices;
        if (
            !parserServices.defineTemplateBodyVisitor
            || !parserServices.getTemplateBodyTokenStore
        ) return scriptVisitor;

        return parserServices.defineTemplateBodyVisitor(
            createVisitor(parserServices.getTemplateBodyTokenStore(), true),
            scriptVisitor,
        );
    },
    meta: {
        docs: { description: 'Inline single non-JSX parameters and expand lists with multiline parameters.' },
        fixable: 'code',
        messages: {
            inlineSingle: 'Keep the parentheses beside a single parameter.',
            newline: 'Start the parameter list on a new line when a parameter is multiline.',
        },
        schema: [],
        type: 'layout',
    },
};
