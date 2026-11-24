import type { Rule } from 'eslint';

type CallArgument = Extract<Rule.Node, { type: 'CallExpression' }>['arguments'][number];
type Expression = Exclude<CallArgument, { type: 'SpreadElement' }>;

function isNothing(node: Expression | null | undefined): boolean {
    if (!node) return true;
    if (node.type === 'Identifier') return node.name === 'undefined';
    if (node.type === 'Literal') return node.raw === 'null';
    return node.type === 'UnaryExpression' && node.operator === 'void' && node.argument.type === 'Literal';
}

function isSilent(callback: CallArgument): boolean {
    if (callback.type !== 'ArrowFunctionExpression' && callback.type !== 'FunctionExpression') return false;
    const { body } = callback;
    if (body.type !== 'BlockStatement') return isNothing(body);
    const [statement, ...rest] = body.body;
    return !statement || (!rest.length && statement.type === 'ReturnStatement' && isNothing(statement.argument));
}

export const noSilentCatch: Rule.RuleModule = {
    create(context) {
        return {
            CallExpression(node) {
                const { callee } = node;
                const callback = node.arguments[0];
                if (
                    callee.type !== 'MemberExpression'
                    || callee.computed
                    || callee.property.type !== 'Identifier'
                    || callee.property.name !== 'catch'
                    || !callback
                    || !isSilent(callback)
                ) return;

                // A comment inside the callback is the reason the rejection can be ignored.
                if (context.sourceCode.getCommentsInside(callback).length) return;
                context.report({
                    messageId: 'silent',
                    node: callback,
                });
            },
        };
    },
    meta: {
        docs: { description: 'Disallow `.catch()` callbacks that silently swallow the rejection.' },
        messages: { silent: 'Do not swallow the rejection silently: log it, or add a comment in the callback explaining why it can be ignored.' },
        schema: [],
        type: 'problem',
    },
};
