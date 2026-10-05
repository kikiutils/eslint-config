import {
    describe,
    it,
} from 'vitest';

import {
    createBaseConfigs,
    createBaseRules,
} from '../src/base';

describe.concurrent('base eslint config factory', () => {
    it('creates layered configs for shared, js, ts, and vscode json files', ({ expect }) => {
        const configs = createBaseConfigs();

        expect(configs).toHaveLength(4);
        expect(configs[0]).toMatchObject({
            rules: {
                'e18e/ban-dependencies': [
                    'error',
                    {
                        allowed: [
                            'axios',
                            'rimraf',
                        ],
                    },
                ],
                'e18e/prefer-static-regex': ['off'],
            },
        });

        expect(configs[1]).toMatchObject({
            files: ['**/*.{cjs,js,mjs}'],
            rules: {
                'node/prefer-global/process': [
                    'error',
                    'always',
                ],
            },
        });

        expect(configs[1]?.plugins).toHaveProperty('promise');
        expect(configs[1]?.plugins).toHaveProperty('kikiutils.rules.statement-padding');
        expect(configs[1]?.plugins).toHaveProperty('kikiutils.rules.compact-iteration-layout');
        expect(configs[1]?.plugins).toHaveProperty('kikiutils.rules.consistent-parameter-layout');
        expect(configs[1]?.plugins).toHaveProperty('kikiutils.rules.consistent-condition-layout');
        expect(configs[2]).toMatchObject({
            files: ['**/*.{ts,tsx}'],
            rules: {
                'node/prefer-global/process': [
                    'error',
                    'always',
                ],
                'ts/consistent-generic-constructors': [
                    'error',
                    'constructor',
                ],
                'ts/no-redeclare': 'off',
            },
        });

        expect(configs[2]?.plugins).toHaveProperty('promise');
        expect(configs[2]?.plugins).toHaveProperty('kikiutils.rules.statement-padding');
        expect(configs[2]?.plugins).toHaveProperty('kikiutils.rules.compact-iteration-layout');
        expect(configs[2]?.plugins).toHaveProperty('kikiutils.rules.consistent-parameter-layout');
        expect(configs[2]?.plugins).toHaveProperty('kikiutils.rules.consistent-condition-layout');
        expect(configs[3]).toMatchObject({
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
        });
    });

    it('uses node import sorting by default and forwards explicit bun environment', ({ expect }) => {
        const nodeRules = createBaseRules();
        const bunRules = createBaseRules('bun');

        expect(nodeRules['perfectionist/sort-imports']).toMatchObject([
            'error',
            {
                environment: 'node',
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
                internalPattern: [
                    '^#.*',
                    '^@/.*',
                    '^~/.*',
                ],
            },
        ]);

        expect(bunRules['perfectionist/sort-imports']).toMatchObject([
            'error',
            { environment: 'bun' },
        ]);
    });

    it('enables the opinionated rules that consumers rely on', ({ expect }) => {
        const rules = createBaseRules();

        expect(rules).toMatchObject({
            'antfu/no-top-level-await': 'off',
            'curly': [
                'error',
                'multi-line',
            ],
            'kikiutils/compact-iteration-layout': 'error',
            'kikiutils/consistent-condition-layout': 'error',
            'kikiutils/consistent-parameter-layout': 'error',
            'kikiutils/statement-padding': 'error',
            'max-classes-per-file': [
                'error',
                1,
            ],
            'no-promise-executor-return': [
                'error',
                { allowVoid: true },
            ],
            'promise/no-multiple-resolved': 'error',
            'promise/no-return-in-finally': 'error',
            'promise/no-return-wrap': 'error',
            'require-await': 'error',
            'style/arrow-parens': [
                'error',
                'always',
            ],
            'style/indent': [
                'error',
                4,
            ],
            'style/semi': [
                'error',
                'always',
            ],
        });
    });
});
