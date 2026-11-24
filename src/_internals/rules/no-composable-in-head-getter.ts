import type { Rule } from 'eslint';

const headComposables = new Set([
    'useHead',
    'useHeadSafe',
    'useSeoMeta',
    'useServerHead',
    'useServerHeadSafe',
    'useServerSeoMeta',
]);

const composablePattern = /^use[A-Z]/;

export const noComposableInHeadGetter: Rule.RuleModule = {
    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type !== 'Identifier' || !composablePattern.test(node.callee.name)) return;
                let insideFunction = false;
                for (const parent of context.sourceCode.getAncestors(node).reverse()) {
                    if (parent.type === 'ArrowFunctionExpression' || parent.type === 'FunctionExpression') {
                        insideFunction = true;
                    }

                    if (
                        insideFunction
                        && parent.type === 'CallExpression'
                        && parent.callee.type === 'Identifier'
                        && headComposables.has(parent.callee.name)
                    ) {
                        context.report({
                            data: {
                                composable: node.callee.name,
                                head: parent.callee.name,
                            },
                            messageId: 'getter',
                            node,
                        });

                        return;
                    }
                }
            },
        };
    },
    meta: {
        docs: { description: 'Disallow calling composables inside `useHead`/`useSeoMeta` getters.' },
        messages: { getter: '`{{ composable }}()` runs when the `{{ head }}` getter is evaluated after setup, outside the component context. Call it in setup and use its result in the getter.' },
        schema: [],
        type: 'problem',
    },
};
