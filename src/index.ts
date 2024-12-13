import antfu from '@antfu/eslint-config';
import type {
    ConfigNames,
    TypedFlatConfigItem,
} from '@antfu/eslint-config';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';
// @ts-expect-error No declare file.
import tailwindcss from 'eslint-plugin-tailwindcss';

const commonPerfectionistSortOptions = Object.freeze({
    ignoreCase: false,
    partitionByNewLine: true,
    type: 'natural',
});

export function createConfig(environment: 'bun' | 'node' = 'node', options?: Parameters<typeof antfu>[0]): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
    return antfu(
        {
            typescript: true,
            ...options,
        },
        {
            files: ['**/*.{cjs,js,mjs,ts,vue}'],
            rules: {
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
                'perfectionist/sort-array-includes': [
                    'error',
                    commonPerfectionistSortOptions,
                ],
                'perfectionist/sort-enums': [
                    'error',
                    commonPerfectionistSortOptions,
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
                            [
                                'builtin',
                                'external',
                            ],
                            'internal',
                            'parent',
                            'sibling',
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
                    commonPerfectionistSortOptions,
                ],
                'perfectionist/sort-intersection-types': [
                    'error',
                    commonPerfectionistSortOptions,
                ],
                'perfectionist/sort-maps': [
                    'error',
                    commonPerfectionistSortOptions,
                ],
                'perfectionist/sort-object-types': [
                    'error',
                    commonPerfectionistSortOptions,
                ],
                'perfectionist/sort-objects': [
                    'error',
                    commonPerfectionistSortOptions,
                ],
                'perfectionist/sort-sets': [
                    'error',
                    commonPerfectionistSortOptions,
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
                    commonPerfectionistSortOptions,
                ],
                'perfectionist/sort-variable-declarations': [
                    'error',
                    commonPerfectionistSortOptions,
                ],
                'style/array-bracket-newline': [
                    'error',
                    {
                        minItems: 2,
                        multiline: true,
                    },
                ],
                'style/array-element-newline': [
                    'error',
                    {
                        minItems: 2,
                        multiline: true,
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
                            minProperties: 2,
                            multiline: true,
                        },
                    },
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
            files: ['**/*.vue'],
            plugins: { tailwindcss },
            rules: {
                'tailwindcss/classnames-order': 'error',
                'tailwindcss/enforces-negative-arbitrary-values': 'error',
                'tailwindcss/enforces-shorthand': 'error',
                'tailwindcss/no-unnecessary-arbitrary-value': 'error',
                'vue/block-order': [
                    'error',
                    {
                        order: [
                            'template',
                            'script',
                            'style',
                        ],
                    },
                ],
                'vue/html-indent': [
                    'error',
                    4,
                ],
                'vue/max-attributes-per-line': [
                    'error',
                    {
                        multiline: 1,
                        singleline: 1,
                    },
                ],
                'vue/max-len': [
                    'error',
                    {
                        code: 256,
                        template: 192,
                    },
                ],
                'vue/no-multi-spaces': 'error',
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
    );
}

export const bun = createConfig('bun');
export const node = createConfig('node');
