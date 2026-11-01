import type {
    AST,
    Rule,
} from 'eslint';

import type { TokenStore } from '../utils';
import { defineScriptAndTemplateVisitors } from '../utils';

type CallNode = Extract<Rule.Node, { type: 'CallExpression' | 'NewExpression' }> & { typeArguments?: Rule.Node };
type FunctionNode = Extract<
    Rule.Node,
    { type: 'ArrowFunctionExpression' | 'FunctionDeclaration' | 'FunctionExpression' }
>;

type ListItem = CallNode['arguments'][number] | FunctionNode['params'][number];

export const consistentParameterLayout: Rule.RuleModule = {
    create(context) {
        const isTestFile = /\.test\.[jt]sx?$/.test(context.filename);

        function createVisitor(tokenStore: TokenStore, isTemplate: boolean): Rule.RuleListener {
            function checkTestCallLayout(node: CallNode): void {
                const items = node.arguments;
                if (!items.length) return;
                const openingParen = tokenStore.getTokenAfter(
                    node.typeArguments ?? node.callee,
                    (token) => token.type === 'Punctuator' && token.value === '(',
                )!;

                const closingParen = tokenStore.getLastToken(node)!;
                const previous = tokenStore.getTokenBefore(closingParen)!;
                const gaps: Array<[AST.Token, AST.Token, string]> = [
                    [
                        openingParen,
                        tokenStore.getTokenAfter(openingParen)!,
                        '',
                    ],
                    [
                        previous,
                        closingParen,
                        '',
                    ],
                ];

                for (let index = 1; index < items.length; index++) {
                    const comma = tokenStore.getTokensBetween(items[index - 1]!, items[index]!)
                        .find((token) => token.type === 'Punctuator' && token.value === ',')!;

                    gaps.push(
                        [
                            tokenStore.getTokenBefore(comma)!,
                            comma,
                            '',
                        ],
                        [
                            comma,
                            tokenStore.getTokenAfter(comma)!,
                            ' ',
                        ],
                    );
                }

                if (previous.value === ',') {
                    gaps.push([
                        tokenStore.getTokenBefore(previous)!,
                        previous,
                        '',
                    ]);
                }

                // Keep the whole list's layout when a boundary comment prevents safe compaction.
                if (gaps.some(([left, right]) => tokenStore.commentsExistBetween(left, right))) return;
                const multilineGaps = gaps.filter(([left, right]) => left.loc.end.line !== right.loc.start.line);
                if (!multilineGaps.length) return;

                context.report({
                    fix: (fixer) => multilineGaps.map(([
                        left,
                        right,
                        text,
                    ]) => fixer.replaceTextRange(
                        [
                            left.range[1],
                            right.range[0],
                        ],
                        text,
                    )),
                    messageId: 'compactTestCall',
                    node,
                });
            }

            function checkParameterLayout(
                node: CallNode | FunctionNode,
                items: readonly ListItem[],
            ): void {
                const first = items[0];
                if (!first) return;
                const isSingleParameter = items.length === 1;

                // JSX argument layout belongs to the JSX formatting rules.
                const firstType: string = first.type;
                if (isSingleParameter && (firstType === 'JSXElement' || firstType === 'JSXFragment')) return;
                let openingParen;
                if (node.type === 'CallExpression' || node.type === 'NewExpression') {
                    openingParen = tokenStore.getTokenAfter(
                        node.typeArguments ?? node.callee,
                        (token) => token.type === 'Punctuator' && token.value === '(',
                    );
                } else {
                    openingParen = tokenStore.getTokenBefore(first);
                }

                if (!openingParen || openingParen.value !== '(') return;
                // An unparenthesized arrow must not borrow its parent's delimiters.
                if (openingParen.range[0] < node.range![0]) return;
                const closingParen = node.type === 'CallExpression' || node.type === 'NewExpression'
                    ? tokenStore.getLastToken(node)
                    : tokenStore.getTokenAfter(items.at(-1)!, (token) => token.value === ')');

                const next = tokenStore.getTokenAfter(openingParen)!;

                if (isSingleParameter) {
                    if (!closingParen || closingParen.value !== ')') return;
                    let previous = tokenStore.getTokenBefore(closingParen)!;
                    if (previous.value === ',') previous = tokenStore.getTokenBefore(previous)!;
                    if (
                        tokenStore.commentsExistBetween(openingParen, next)
                        || tokenStore.commentsExistBetween(previous, closingParen)
                    ) return;

                    const hasOpeningNewline = openingParen.loc.end.line !== next.loc.start.line;
                    const hasClosingNewline = tokenStore.getTokenBefore(closingParen)!.loc.end.line
                      !== closingParen.loc.start.line;

                    if (hasOpeningNewline === hasClosingNewline) return;

                    context.report({
                        fix: (fixer) => hasOpeningNewline
                            ? fixer.insertTextBefore(closingParen, '\n')
                            : fixer.insertTextAfter(openingParen, '\n'),
                        messageId: 'singleBoundary',
                        node,
                    });

                    return;
                }

                if (!closingParen || openingParen.loc.start.line === closingParen.loc.end.line) return;

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
                        closingParen.value === ')'
                        && tokenStore.getTokenBefore(closingParen)!.loc.end.line === closingParen.loc.start.line
                    ) newlineOffsets.push(closingParen.range[0]);

                    if (newlineOffsets.length) {
                        context.report({
                            fix: (fixer) => newlineOffsets.map((offset) => fixer.insertTextBeforeRange(
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

                if (openingParen.loc.end.line !== next.loc.start.line) return;

                context.report({
                    fix: (fixer) => fixer.insertTextAfter(openingParen, '\n'),
                    messageId: 'newline',
                    node: first,
                });
            }

            return {
                ArrowFunctionExpression: (node) => checkParameterLayout(node, node.params),
                CallExpression: (node) => {
                    const { callee } = node;
                    if (isTestFile) {
                        const target = callee.type === 'MemberExpression'
                          && !callee.computed
                          && callee.property.type === 'Identifier'
                          && callee.property.name === 'concurrent'
                            ? callee.object
                            : callee;

                        if (
                            target.type === 'Identifier'
                            && (target.name === 'describe' || target.name === 'it')
                        ) {
                            checkTestCallLayout(node);
                            return;
                        }
                    }

                    checkParameterLayout(node, node.arguments);
                },
                FunctionDeclaration: (node) => checkParameterLayout(node, node.params),
                FunctionExpression: (node) => checkParameterLayout(node, node.params),
                NewExpression: (node) => checkParameterLayout(node, node.arguments),
            };
        }

        return defineScriptAndTemplateVisitors(context.sourceCode, createVisitor);
    },
    meta: {
        docs: { description: 'Keep parameter boundaries consistent, expand multiline lists, and compact test calls.' },
        fixable: 'whitespace',
        messages: {
            compactTestCall: 'Keep test-call arguments beside their parentheses and each other.',
            newline: 'Start a multiline parameter list on a new line.',
            singleBoundary: 'Use matching newline boundaries around a single parameter.',
        },
        schema: [],
        type: 'layout',
    },
};
