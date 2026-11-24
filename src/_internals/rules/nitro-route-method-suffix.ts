import { basename } from 'node:path';

import type { Rule } from 'eslint';

const methodSuffixPattern = /\.(?:delete|get|head|options|patch|post|put)$/;

export const nitroRouteMethodSuffix: Rule.RuleModule = {
    create(context) {
        return {
            Program(node) {
                const name = basename(context.filename).replace(/\.[cm]?[jt]s$/, '');
                if (methodSuffixPattern.test(name)) return;
                context.report({
                    data: { name },
                    loc: node.loc.start,
                    messageId: 'missing',
                });
            },
        };
    },
    meta: {
        docs: { description: 'Require an HTTP method suffix on Nitro route file names.' },
        messages: { missing: 'Name this route `{{ name }}.get.ts`, `{{ name }}.post.ts`, or another method suffix; without one, the route accepts every HTTP method.' },
        schema: [],
        type: 'problem',
    },
};
