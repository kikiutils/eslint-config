import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import {
    GLOB_SRC,
    GLOB_TESTS,
    GLOB_VUE,
} from '@antfu/eslint-config';

import { customPlugins } from './_internals/plugins';
import { internalsImportPattern } from './_internals/restricted-imports';
import { restrictedSyntax } from './_internals/restricted-syntax';

// Server helpers that `nuxt/server` provides since Nuxt 4.6.
const nuxtServerHelpers = [
    'clearSession',
    'createError',
    'defineEventHandler',
    'defineHandler',
    'deleteCookie',
    'eventHandler',
    'getCookie',
    'getQuery',
    'getRequestHeader',
    'getRequestHeaders',
    'getRequestHost',
    'getRequestIP',
    'getRequestProtocol',
    'getRequestURL',
    'getRouteRules',
    'getRouterParam',
    'getRouterParams',
    'getSession',
    'getValidatedQuery',
    'handleCors',
    'parseCookies',
    'readBody',
    'readValidatedBody',
    'sendRedirect',
    'setCookie',
    'setResponseStatus',
    'updateSession',
    'useAppConfig',
    'useRuntimeConfig',
    'useSession',
];

export function createNuxtConfigs(): TypedFlatConfigItem[] {
    const nuxtRestrictedSyntax = [
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
    ];

    return [
        {
            files: [
                GLOB_SRC,
                GLOB_VUE,
            ],
            plugins: { kikiutils: customPlugins },
            rules: {
                'kikiutils/no-composable-in-head-getter': 'error',
                'no-restricted-syntax': [
                    'error',
                    ...nuxtRestrictedSyntax,
                ],
            },
        },
        {
            files: ['**/pages/**/*.{ts,vue}'],
            rules: {
                'no-restricted-syntax': [
                    'error',
                    ...nuxtRestrictedSyntax,
                    {
                        message: '`<html lang>` follows the current locale through the i18n layer, or `app.head` in `nuxt.config.ts` without i18n; setting it in a page overrides it.',
                        selector: 'CallExpression[callee.name=/^use(Server)?Head(Safe)?$/] Property[key.name="htmlAttrs"] > ObjectExpression > Property[key.name="lang"]',
                    },
                ],
            },
        },
        {
            files: ['**/server/**/*.?([cm])[jt]s'],
            // Test files keep the test-scope import restrictions from the base config.
            ignores: GLOB_TESTS,
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            '#imports',
                            'h3',
                            'nitropack/runtime',
                        ].map((name) => ({
                            importNames: nuxtServerHelpers,
                            message: 'Import this helper from `nuxt/server`, which runs on Nuxt 4.6 and Nuxt 5; the h3 and Nitro versions expect a different event. Keep h3 or `nitropack/runtime` only for helpers `nuxt/server` does not provide.',
                            name,
                        })),
                        patterns: [internalsImportPattern],
                    },
                ],
            },
        },
    ];
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
