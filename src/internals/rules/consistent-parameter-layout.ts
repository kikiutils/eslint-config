import type { Rule } from 'eslint';

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

            if (openingParen.loc.end.line !== next.loc.start.line) return;

            context.report({
                fix: (fixer) => fixer.insertTextAfter(openingParen, '\n'),
                messageId: 'newline',
                node: first,
            });
        }

        function createVisitor(tokenStore: TokenStore, isTemplate: boolean): Rule.RuleListener {
            return {
                ArrowFunctionExpression: (node) => checkParameterLayout(node, node.params, tokenStore, isTemplate),
                CallExpression: (node) => checkParameterLayout(node, node.arguments, tokenStore, isTemplate),
                FunctionDeclaration: (node) => checkParameterLayout(node, node.params, tokenStore, isTemplate),
                FunctionExpression: (node) => checkParameterLayout(node, node.params, tokenStore, isTemplate),
                NewExpression: (node) => checkParameterLayout(node, node.arguments, tokenStore, isTemplate),
            };
        }

        return defineScriptAndTemplateVisitors(context.sourceCode, createVisitor);
    },
    meta: {
        docs: { description: 'Preserve consistent single-parameter boundaries and expand multiline parameter lists.' },
        fixable: 'whitespace',
        messages: {
            newline: 'Start the parameter list on a new line when a parameter is multiline.',
            singleBoundary: 'Use matching newline boundaries around a single parameter.',
        },
        schema: [],
        type: 'layout',
    },
};
