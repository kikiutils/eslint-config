import type { TypedFlatConfigItem } from '@antfu/eslint-config';
// @ts-expect-error No declare file.
import promise from 'eslint-plugin-promise';

const basePerfectionistSortOptions = {
    ignoreCase: false,
    type: 'natural',
} as const;

export function createBaseConfigs(environment: 'bun' | 'node' = 'node'): TypedFlatConfigItem[] {
    return [
        {
            files: ['**/*.{cjs,js,mjs,ts,tsx}'],
            rules: {
                'node/prefer-global/process': [
                    'error',
                    'always',
                ],
            },
        },
        {
            files: ['**/*.{cjs,js,mjs,ts,tsx,vue}'],
            plugins: { promise },
            rules: {
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
                'curly': [
                    'error',
                    'multi-line',
                ],
                'max-classes-per-file': [
                    'error',
                    1,
                ],
                'no-promise-executor-return': [
                    'error',
                    { allowVoid: true },
                ],
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
                    {
                        ignoreCase: false,
                        type: 'natural',
                    },
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
                'promise/no-multiple-resolved': 'error',
                'promise/no-return-in-finally': 'error',
                'promise/no-return-wrap': 'error',
                'require-await': 'error',
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
                'ts/consistent-generic-constructors': [
                    'error',
                    'constructor',
                ],
                'ts/no-redeclare': 'off',
            },
        },
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
                        pathPattern: '^.*$',
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
    ];
}
