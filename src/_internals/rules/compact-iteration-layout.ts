import type { Rule } from 'eslint';

type IterationNode = Extract<Rule.Node, { type: 'ForInStatement' | 'ForOfStatement' }>;

export const compactIterationLayout: Rule.RuleModule = {
    create(context) {
        const { sourceCode } = context;

        function checkParentheses(node: IterationNode): void {
            const openingParen = sourceCode.getFirstToken(node, (token) => token.value === '(')!;
            const closingParen = sourceCode.getTokenBefore(node.body)!;
            const next = sourceCode.getTokenAfter(openingParen)!;
            const previous = sourceCode.getTokenBefore(closingParen)!;
            const ranges: Array<[number, number]> = [];

            if (
                openingParen.loc.end.line !== next.loc.start.line
                && !sourceCode.commentsExistBetween(openingParen, next)
            ) {
                ranges.push([
                    openingParen.range[1],
                    next.range[0],
                ]);
            }

            if (
                previous.loc.end.line !== closingParen.loc.start.line
                && !sourceCode.commentsExistBetween(previous, closingParen)
            ) {
                ranges.push([
                    previous.range[1],
                    closingParen.range[0],
                ]);
            }

            if (ranges.length) {
                context.report({
                    fix: (fixer) => ranges.map((range) => fixer.replaceTextRange(range, '')),
                    messageId: 'compact',
                    node,
                });
            }
        }

        return {
            ForInStatement: checkParentheses,
            ForOfStatement: checkParentheses,
        };
    },
    meta: {
        docs: { description: 'Keep for-in and for-of parentheses beside their header contents.' },
        fixable: 'whitespace',
        messages: { compact: 'Keep iteration parentheses on the same lines as their adjacent header contents.' },
        schema: [],
        type: 'layout',
    },
};
