import type {
    AST,
    Rule,
} from 'eslint';

import type { TokenStore } from '../utils';
import { defineScriptAndTemplateVisitors } from '../utils';

type LogicalNode = Extract<Rule.Node, { type: 'LogicalExpression' }>;

export const consistentConditionLayout: Rule.RuleModule = {
    create(context) {
        function createVisitor(tokenStore: TokenStore): Rule.RuleListener {
            const checkedOpeningOffsets = new Set<number>();

            function collectOperators(node: LogicalNode['left'], operators: AST.Token[]): void {
                if (node.type !== 'LogicalExpression' || (node.operator !== '&&' && node.operator !== '||')) return;
                const operator = tokenStore.getTokensBetween(node.left, node.right)
                    .find((token) => token.type === 'Punctuator' && token.value === node.operator)!;

                function collectChild(child: LogicalNode['left']): void {
                    const before = tokenStore.getTokenBefore(child);
                    const after = tokenStore.getTokenAfter(child);
                    if (
                        before?.value === '('
                        && after?.value === ')'
                        && before.range[0] >= node.range![0]
                        && after.range[1] <= node.range![1]
                    ) return;

                    collectOperators(child, operators);
                }

                collectChild(node.left);
                operators.push(operator);
                collectChild(node.right);
            }

            function checkParentheses(node: LogicalNode['left']): void {
                let openingParen = tokenStore.getTokenBefore(node);
                let closingParen = tokenStore.getTokenAfter(node);
                let operators: AST.Token[] | undefined;
                const newlineOffsets: number[] = [];
                while (openingParen?.value === '(' && closingParen?.value === ')') {
                    if (
                        !checkedOpeningOffsets.has(openingParen.range[0])
                        && openingParen.loc.start.line !== closingParen.loc.end.line
                    ) {
                        checkedOpeningOffsets.add(openingParen.range[0]);
                        if (!operators) {
                            operators = [];
                            collectOperators(node, operators);
                        }

                        const next = tokenStore.getTokenAfter(openingParen)!;
                        if (openingParen.loc.end.line === next.loc.start.line) {
                            newlineOffsets.push(openingParen.range[1]);
                        }

                        for (const operator of operators) {
                            if (tokenStore.getTokenBefore(operator)!.loc.end.line === operator.loc.start.line) {
                                newlineOffsets.push(operator.range[0]);
                            }
                        }

                        if (tokenStore.getTokenBefore(closingParen)!.loc.end.line === closingParen.loc.start.line) {
                            newlineOffsets.push(closingParen.range[0]);
                        }
                    }

                    openingParen = tokenStore.getTokenBefore(openingParen);
                    closingParen = tokenStore.getTokenAfter(closingParen);
                    // An outer pair contains one grouped item, not the inner logical chain.
                    operators = [];
                }

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
                        node,
                    });
                }
            }

            return {
                BinaryExpression: (node) => {
                    if (
                        [
                            '!=',
                            '!==',
                            '<',
                            '<=',
                            '==',
                            '===',
                            '>',
                            '>=',
                            'in',
                            'instanceof',
                        ].includes(node.operator)
                    ) checkParentheses(node);
                },
                DoWhileStatement: (node) => checkParentheses(node.test),
                IfStatement: (node) => checkParentheses(node.test),
                LogicalExpression: (node) => {
                    if (node.operator === '&&' || node.operator === '||') checkParentheses(node);
                },
                UnaryExpression: (node) => {
                    if (node.operator === '!') checkParentheses(node);
                },
                WhileStatement: (node) => checkParentheses(node.test),
            };
        }

        return defineScriptAndTemplateVisitors(context.sourceCode, createVisitor);
    },
    meta: {
        docs: { description: 'Expand multiline parenthesized conditions one logical item per line.' },
        fixable: 'whitespace',
        messages: { newline: 'Put each logical item and both parentheses on separate lines in a multiline condition.' },
        schema: [],
        type: 'layout',
    },
};
