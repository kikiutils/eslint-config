import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import {
    GLOB_JS,
    GLOB_JSX,
    GLOB_TESTS,
    GLOB_TS,
    GLOB_TSX,
} from '@antfu/eslint-config';
// @ts-expect-error No declare file.
import promise from 'eslint-plugin-promise';

import { createBaseRules } from './_internals/configs/base-rules';
import {
    jsdocSettings,
    typescriptJsdocConfig,
} from './_internals/configs/jsdoc';
import { createTypeAwareConfig } from './_internals/configs/type-aware';
import { createTypefestConfig } from './_internals/configs/typefest';
import { customPlugins } from './_internals/rules';

export { createBaseRules };

// Constants/Variables
const vscodeOrderSensitiveArrayProperties = [
    'args',
    'autoAttachSmartPattern',
    'dependsOn',
    'options',
    'outFiles',
    'problemMatcher',
    'resolveSourceMapLocations',
    'runtimeArgs',
    'skipFiles',
].join('|');

// Functions
export function createBaseConfigs(environment: 'bun' | 'node' = 'node'): TypedFlatConfigItem[] {
    return [
        // All files
        {
            rules: {
                'e18e/ban-dependencies': [
                    'error',
                    { allowed: ['axios'] },
                ],
                'e18e/prefer-static-regex': 'off',
                'style/linebreak-style': [
                    'error',
                    'unix',
                ],
            },
        },
        // JavaScript and TypeScript
        {
            files: [
                GLOB_JS,
                GLOB_JSX,
                GLOB_TS,
                GLOB_TSX,
            ],
            plugins: {
                kikiutils: customPlugins,
                promise,
            },
            rules: {
                ...createBaseRules(environment),
                'node/prefer-global/process': [
                    'error',
                    'always',
                ],
            },
            settings: jsdocSettings,
        },
        // TypeScript
        {
            files: [
                GLOB_TS,
                GLOB_TSX,
            ],
            rules: {
                ...typescriptJsdocConfig.rules,
                'ts/array-type': [
                    'error',
                    { default: 'array-simple' },
                ],
                'ts/consistent-generic-constructors': [
                    'error',
                    'constructor',
                ],
                'ts/no-redeclare': 'off',
            },
            settings: typescriptJsdocConfig.settings,
        },
        // Type-aware TypeScript
        {
            ...createTypeAwareConfig(),
            files: [
                GLOB_TS,
                GLOB_TSX,
            ],
            ignores: ['**/*.config.?([cm])ts'],
        },
        // Type-fest and ts-extras
        {
            ...createTypefestConfig(),
            files: [
                GLOB_TS,
                GLOB_TSX,
            ],
            ignores: ['**/*.config.?([cm])ts'],
        },
        // Tests
        {
            files: GLOB_TESTS,
            rules: {
                'kikiutils/consistent-parameter-layout': [
                    'error',
                    { compactTestCalls: true },
                ],
                'kikiutils/no-restricted-test-imports': [
                    'error',
                    {
                        paths: [
                            {
                                importNames: ['expect'],
                                message: 'Use `expect` from the test context.',
                                name: 'vitest',
                            },
                        ],
                    },
                ],
                'test/consistent-each-for': [
                    'error',
                    {
                        it: 'for',
                        test: 'for',
                    },
                ],
                'test/prefer-each': 'error',
                'test/prefer-hooks-on-top': 'error',
                'test/prefer-lowercase-title': [
                    'error',
                    {
                        ignoreTopLevelDescribe: true,
                        lowercaseFirstCharacterOnly: true,
                    },
                ],
                'test/prefer-to-be': 'error',
                'test/valid-describe-callback': 'error',
                'test/valid-expect': 'error',
                'test/valid-expect-in-promise': 'error',
                'test/valid-title': [
                    'error',
                    {
                        mustMatch: { it: '^should ' },
                        mustNotMatch: { it: String.raw`\.$` },
                    },
                ],
            },
        },
        // VS Code JSONC
        {
            files: ['**/.vscode/*.json'],
            rules: {
                'jsonc/sort-array-values': [
                    'error',
                    {
                        order: {
                            natural: true,
                            type: 'asc',
                        },
                        // Preserve ordered fields and any argument or option arrays nested inside them.
                        pathPattern: String.raw`^(?!.*(?:^|\.|\[")(?:${vscodeOrderSensitiveArrayProperties})(?:$|\.|\[|"\])).*`,
                    },
                ],
                'jsonc/sort-keys': [
                    'error',
                    'asc',
                    {
                        caseSensitive: true,
                        natural: true,
                    },
                ],
            },
        },
        // Ignore all extracted Markdown code blocks, but keep linting Markdown itself.
        { ignores: ['**/*.md/**'] },
        // Serena's project files (`project.yml`, memories) are tool-generated and may be tracked.
        { ignores: ['**/.serena/**'] },
    ];
}
