import type {
    Rules,
    TypedFlatConfigItem,
} from '@antfu/eslint-config';
import {
    GLOB_JS,
    GLOB_JSX,
    GLOB_TESTS,
    GLOB_TS,
    GLOB_TSX,
} from '@antfu/eslint-config';
// @ts-expect-error No declare file.
import promise from 'eslint-plugin-promise';

import {
    jsdocSettings,
    typescriptJsdocConfig,
} from './_internals/jsdoc';
import { customPlugins } from './_internals/plugins';
import { createTypeAwareConfig } from './_internals/type-aware';

// Constants/Variables
const basePerfectionistSortOptions = {
    ignoreCase: false,
    type: 'natural',
} as const;

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
        // Tests
        {
            files: GLOB_TESTS,
            rules: {
                'kikiutils/consistent-parameter-layout': [
                    'error',
                    { compactTestCalls: true },
                ],
                'no-restricted-imports': [
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
    ];
}

export function createBaseRules(environment: 'bun' | 'node' = 'node'): Rules {
    return {
        'antfu/consistent-list-newline': [
            'error',
            {
                ArrayExpression: false,
                ArrayPattern: false,
            },
        ],
        'antfu/curly': 'off',
        'antfu/if-newline': 'off',
        'antfu/no-top-level-await': 'off',
        'antfu/reasonable-newline': 'off',
        'arrow-body-style': [
            'error',
            'as-needed',
        ],
        'curly': [
            'error',
            'multi-line',
        ],
        'jsdoc/check-tag-names': 'error',
        'jsdoc/multiline-blocks': [
            'error',
            {
                noSingleLineBlocks: true,
                singleLineTags: [
                    'type',
                    'import',
                ],
            },
        ],
        'jsdoc/no-blank-blocks': [
            'error',
            { enableFixer: true },
        ],
        'jsdoc/require-asterisk-prefix': 'error',
        'jsdoc/require-hyphen-before-param-description': [
            'error',
            'always',
            { tags: { typeParam: 'always' } },
        ],
        'kikiutils/compact-iteration-layout': 'error',
        'kikiutils/consistent-condition-layout': 'error',
        'kikiutils/consistent-parameter-layout': 'error',
        'kikiutils/statement-padding': 'error',
        'max-classes-per-file': [
            'error',
            1,
        ],
        'no-constant-binary-expression': 'error',
        'no-promise-executor-return': [
            'error',
            { allowVoid: true },
        ],
        'no-useless-assignment': 'error',
        'perfectionist/sort-array-includes': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-enums': [
            'error',
            {
                ...basePerfectionistSortOptions,
                sortByValue: 'never',
            },
        ],
        'perfectionist/sort-heritage-clauses': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-imports': [
            'error',
            {
                environment,
                groups: [
                    'side-effect',
                    'side-effect-style',
                    'style',
                    [
                        'value-builtin',
                        'type-builtin',
                    ],
                    [
                        'value-external',
                        'type-external',
                    ],
                    [
                        'value-internal',
                        'type-internal',
                    ],
                    [
                        'value-parent',
                        'type-parent',
                    ],
                    [
                        'value-sibling',
                        'type-sibling',
                    ],
                    [
                        'value-index',
                        'type-index',
                    ],
                    'unknown',
                ],
                ignoreCase: false,
                internalPattern: [
                    '^#.*',
                    '^@/.*',
                    '^~/.*',
                ],
                type: 'natural',
            },
        ],
        'perfectionist/sort-interfaces': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-intersection-types': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-maps': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-modules': [
            'error',
            {
                ...basePerfectionistSortOptions,
                groups: [
                    'declare-type',
                    [
                        'export-type',
                        'type',
                    ],
                    'declare-interface',
                    [
                        'export-interface',
                        'interface',
                    ],
                    'declare-enum',
                    [
                        'enum',
                        'export-enum',
                    ],
                    'declare-class',
                    [
                        'class',
                        'export-class',
                    ],
                    'declare-function',
                    [
                        'export-function',
                        'function',
                    ],
                ],
            },
        ],
        'perfectionist/sort-object-types': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-objects': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-sets': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-switch-case': [
            'error',
            {
                ignoreCase: false,
                type: 'natural',
            },
        ],
        'perfectionist/sort-union-types': [
            'error',
            basePerfectionistSortOptions,
        ],
        'perfectionist/sort-variable-declarations': [
            'error',
            basePerfectionistSortOptions,
        ],
        'preserve-caught-error': 'error',
        'promise/no-multiple-resolved': 'error',
        'promise/no-return-in-finally': 'error',
        'promise/no-return-wrap': 'error',
        'require-await': 'off',
        'style/array-bracket-newline': [
            'error',
            { multiline: true },
        ],
        'style/array-element-newline': [
            'error',
            {
                ArrayExpression: {
                    consistent: true,
                    minItems: 2,
                },
                ArrayPattern: { minItems: 3 },
            },
        ],
        'style/arrow-parens': [
            'error',
            'always',
        ],
        'style/brace-style': [
            'error',
            '1tbs',
            { allowSingleLine: false },
        ],
        'style/function-call-spacing': [
            'error',
            'never',
        ],
        'style/indent': [
            'error',
            4,
        ],
        'style/max-len': [
            'warn',
            {
                code: 120,
                comments: 120,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'style/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
            },
        ],
        'style/no-extra-parens': [
            'error',
            'all',
            { nestedBinaryExpressions: false },
        ],
        'style/no-extra-semi': 'error',
        'style/object-curly-newline': [
            'error',
            {
                ExportDeclaration: {
                    minProperties: 2,
                    multiline: true,
                },
                ImportDeclaration: {
                    minProperties: 2,
                    multiline: true,
                },
                ObjectExpression: {
                    minProperties: 2,
                    multiline: true,
                },
                ObjectPattern: {
                    minProperties: 3,
                    multiline: true,
                },
            },
        ],
        'style/operator-linebreak': [
            'error',
            'before',
            { overrides: { '=': 'after' } },
        ],
        'style/padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                next: [
                    'class',
                    'enum',
                    'function',
                ],
                prev: '*',
            },
            {
                blankLine: 'always',
                next: '*',
                prev: [
                    'class',
                    'function',
                ],
            },
        ],
        'style/semi': [
            'error',
            'always',
        ],
    };
}
