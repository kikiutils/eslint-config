import type { Rules } from '@antfu/eslint-config';

import { restrictedSyntax } from './restricted-syntax';

const basePerfectionistSortOptions = {
    ignoreCase: false,
    type: 'natural',
} as const;

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
        'jsdoc/check-param-names': [
            'warn',
            { disableMissingParamChecks: true },
        ],
        'jsdoc/check-tag-names': 'error',
        'jsdoc/multiline-blocks': 'error',
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
        'kikiutils/comment-indent': 'error',
        'kikiutils/compact-iteration-layout': 'error',
        'kikiutils/consistent-condition-layout': 'error',
        'kikiutils/consistent-parameter-layout': 'error',
        'kikiutils/no-silent-catch': 'error',
        'kikiutils/statement-padding': 'error',
        'max-classes-per-file': [
            'error',
            1,
        ],
        'no-constant-binary-expression': 'error',
        // An ignored error needs at least a comment in the block saying why.
        'no-empty': [
            'error',
            { allowEmptyCatch: false },
        ],
        'no-promise-executor-return': [
            'error',
            { allowVoid: true },
        ],
        'no-restricted-imports': [
            'error',
            {
                patterns: [
                    {
                        message: '`_internals` modules are private to their own directory; import the public module instead.',
                        regex: String.raw`^[^.].*/_internals(/|$)`,
                    },
                ],
            },
        ],
        'no-restricted-syntax': [
            'error',
            ...restrictedSyntax,
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
        'unicorn/no-useless-promise-resolve-reject': 'error',
        'unicorn/no-useless-spread': 'error',
        'unicorn/prefer-array-find': 'error',
        'unicorn/prefer-array-some': 'error',
        'unicorn/prefer-at': 'error',
        'unicorn/prefer-string-replace-all': 'error',
    };
}
