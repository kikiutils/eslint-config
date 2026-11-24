import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
                ...hasSeoUtils()
                    ? [
                        {
                            message: 'nuxt-seo-utils infers og:title and og:description from `title` and `description`, X falls back to them for its title and description, and the seo layer sets `twitter:card`. Setting these keys stops the inference; set `title` and `description` instead.',
                            selector: 'CallExpression[callee.name=/^use(Server)?SeoMeta$/] > ObjectExpression > Property[key.name=/^(ogDescription|ogTitle|twitterCard|twitterDescription|twitterTitle)$/]',
                        },
                    ]
                    : [],
            ],
        },
    };
}

function hasSeoUtils(): boolean {
    try {
        const { dependencies, devDependencies } = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
        return [
            '@nuxtjs/seo',
            'nuxt-seo-utils',
        ].some((name) => name in {
            ...dependencies,
            ...devDependencies,
        });
    } catch {
        // Without a readable package.json, skip the rules that depend on the SEO modules.
        return false;
    }
}
