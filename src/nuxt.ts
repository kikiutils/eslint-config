import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import {
    GLOB_SRC,
    GLOB_VUE,
} from '@antfu/eslint-config';

import { customPlugins } from './_internals/plugins';
import { restrictedSyntax } from './_internals/restricted-syntax';

export function createNuxtConfig(): TypedFlatConfigItem {
    return {
        files: [
            GLOB_SRC,
            GLOB_VUE,
        ],
        plugins: { kikiutils: customPlugins },
        rules: {
            'kikiutils/no-composable-in-head-getter': 'error',
            'no-restricted-syntax': [
                'error',
                ...restrictedSyntax,
                {
                    message: 'Do not redirect with a top-level `await navigateTo()` in setup: under KeepAlive it interrupts a pending Suspense and leaves the page stuck. Use `definePageMeta({ redirect })` or a route middleware.',
                    selector: 'Program > ExpressionStatement > AwaitExpression > CallExpression[callee.name="navigateTo"]',
                },
            ],
        },
    };
}
