import { antfu } from '@antfu/eslint-config';
import type {
    ConfigNames,
    TypedFlatConfigItem,
} from '@antfu/eslint-config';
// @ts-expect-error No declare file.
import kikiutilsTailwindcss from '@kikiutils/eslint-plugin-tailwindcss';
// @ts-expect-error Ignore this error.
import kikiutilsEslintPluginVue from '@kikiutils/eslint-plugin-vue';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';
import format from 'eslint-plugin-format';
// @ts-expect-error No declare file.
import promise from 'eslint-plugin-promise';
// @ts-expect-error No declare file.
import tailwindcss from 'eslint-plugin-tailwindcss';

const basePerfectionistSortOptions = {
    ignoreCase: false,
    type: 'natural',
} as const;

export function createConfig(
    environment: 'bun' | 'node' = 'node',
    options?: Parameters<typeof antfu>[0],
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
    const userConfigs: Parameters<typeof antfu>[1] = [
        {
            files: ['**/*.{cjs,js,mjs,ts,vue}'],
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
                'node/prefer-global/process': [
                    'error',
                    'always',
                ],
                'perfectionist/sort-array-includes': [
                    'error',
                    basePerfectionistSortOptions,
                ],
                'perfectionist/sort-enums': [
                    'error',
                    basePerfectionistSortOptions,
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
                                'builtin',
                                'builtin-type',
                            ],
                            [
                                'external',
                                'external-type',
                            ],
                            [
                                'internal',
                                'internal-type',
                            ],
                            [
                                'parent',
                                'parent-type',
                            ],
                            [
                                'sibling',
                                'sibling-type',
                            ],
                            [
                                'index',
                                'index-type',
                            ],
                            'object',
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
            files: ['**/*.vue'],
            plugins: {
                '@kikiutils/tailwindcss': kikiutilsTailwindcss,
                '@kikiutils/vue': kikiutilsEslintPluginVue,
                tailwindcss,
            },
            rules: {
                '@kikiutils/tailwindcss/classnames-order': 'error',
                '@kikiutils/vue/attributes-order': [
                    'error',
                    { alphabetical: true },
                ],
                '@kikiutils/vue/no-extra-space-in-class': 'error',
                'style/max-len': 'off',
                'tailwindcss/classnames-order': 'off',
                'tailwindcss/enforces-negative-arbitrary-values': 'error',
                'tailwindcss/enforces-shorthand': 'error',
                'tailwindcss/no-unnecessary-arbitrary-value': 'error',
                'vue/attribute-hyphenation': 'error',
                'vue/attributes-order': 'off',
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
                'vue/component-api-style': 'error',
                'vue/define-emits-declaration': 'error',
                'vue/define-props-declaration': 'error',
                'vue/enforce-style-attribute': 'error',
                'vue/html-closing-bracket-newline': 'error',
                'vue/html-closing-bracket-spacing': 'error',
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
                    'warn',
                    {
                        code: 120,
                        comments: 120,
                        template: 120,
                    },
                ],
                'vue/no-dupe-keys': 'error',
                'vue/no-lone-template': 'error',
                'vue/no-multi-spaces': 'error',
                'vue/no-multiple-objects-in-class': 'error',
                'vue/no-root-v-if': 'error',
                'vue/no-template-target-blank': 'error',
                'vue/no-v-html': 'error',
                'vue/prefer-define-options': 'error',
                'vue/prefer-separate-static-class': 'error',
                'vue/require-explicit-emits': 'error',
                'vue/require-typed-ref': 'error',
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

    if (options?.formatters && (typeof options.formatters === 'boolean' || options.formatters.css)) {
        userConfigs.splice(
            1,
            0,
            createPrettierCssConfig('css'),
            createPrettierCssConfig('sass'),
            createPrettierCssConfig('scss'),
        );
    }

    return antfu(
        {
            typescript: true,
            ...options,
        },
        ...userConfigs,
    );
}

function createPrettierCssConfig(parser: 'css' | 'sass' | 'scss'): TypedFlatConfigItem {
    return {
        files: [`**/*.${parser}`],
        languageOptions: { parser: format.parserPlain },
        plugins: { format },
        rules: {
            'format/prettier': [
                'error',
                {
                    parser,
                    printWidth: 120,
                    singleQuote: true,
                    tabWidth: 4,
                },
            ],
        },
    };
}

export const bun = createConfig('bun');
export const node = createConfig('node');
export const vue = createConfig(
    'node',
    {
        formatters: { css: true },
        vue: true,
    },
);
