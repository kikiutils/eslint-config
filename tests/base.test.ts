import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import {
    antfu,
    GLOB_TESTS,
} from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import {
    createBaseConfigs,
    createBaseRules,
} from '../src/base';

import { createSyntaxConfigs } from './utils';

describe.concurrent('base eslint config factory', () => {
    it('creates layered configs for shared, js, ts, vscode json, and test files', ({ expect }) => {
        const configs = createBaseConfigs();
        const [
            shared,
            javascript,
            typescript,
            typeAware,
            testFiles,
            vscode,
            ignores,
        ] = configs;

        expect(configs).toHaveLength(7);
        expect(shared).toMatchObject({
            rules: {
                'e18e/ban-dependencies': [
                    'error',
                    { allowed: ['axios'] },
                ],
                'e18e/prefer-static-regex': 'off',
            },
        });

        expect(javascript).toMatchObject({
            files: ['**/*.{cjs,js,mjs}'],
            rules: {
                'node/prefer-global/process': [
                    'error',
                    'always',
                ],
            },
        });

        expect(javascript?.plugins).toHaveProperty('promise');
        expect(javascript?.plugins).toHaveProperty('kikiutils.rules.statement-padding');
        expect(javascript?.plugins).toHaveProperty('kikiutils.rules.compact-iteration-layout');
        expect(javascript?.plugins).toHaveProperty('kikiutils.rules.consistent-parameter-layout');
        expect(javascript?.plugins).toHaveProperty('kikiutils.rules.consistent-condition-layout');
        expect(typescript).toMatchObject({
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

        expect(typescript?.plugins).toHaveProperty('promise');
        expect(typescript?.plugins).toHaveProperty('kikiutils.rules.statement-padding');
        expect(typescript?.plugins).toHaveProperty('kikiutils.rules.compact-iteration-layout');
        expect(typescript?.plugins).toHaveProperty('kikiutils.rules.consistent-parameter-layout');
        expect(typescript?.plugins).toHaveProperty('kikiutils.rules.consistent-condition-layout');
        expect(vscode).toMatchObject({
            files: ['**/.vscode/*.json'],
            rules: {
                'jsonc/sort-array-values': [
                    'error',
                    {
                        order: {
                            natural: true,
                            type: 'asc',
                        },
                        pathPattern: expect.any(String),
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

        expect(testFiles).toMatchObject({
            files: GLOB_TESTS,
            rules: {
                'test/valid-expect': 'error',
                'test/valid-expect-in-promise': 'error',
            },
        });

        expect(typeAware).toMatchObject({
            files: ['**/*.{ts,tsx}'],
            ignores: ['**/*.config.ts'],
            languageOptions: {
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: process.cwd(),
                },
            },
            rules: {
                'require-await': 'off',
                'ts/await-thenable': 'error',
                'ts/no-base-to-string': 'error',
                'ts/no-floating-promises': 'error',
                'ts/no-for-in-array': 'error',
                'ts/no-misused-promises': 'error',
                'ts/no-misused-spread': 'error',
                'ts/no-unnecessary-type-assertion': 'error',
                'ts/require-await': 'error',
                'ts/return-await': 'error',
                'ts/switch-exhaustiveness-check': [
                    'error',
                    { considerDefaultExhaustiveForUnions: true },
                ],
            },
        });

        expect(ignores).toEqual({ ignores: ['**/*.md/**'] });
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
            'antfu/reasonable-newline': 'off',
            'arrow-body-style': [
                'error',
                'as-needed',
            ],
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
            'no-constant-binary-expression': 'error',
            'no-promise-executor-return': [
                'error',
                { allowVoid: true },
            ],
            'no-useless-assignment': 'error',
            'preserve-caught-error': 'error',
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

    describe('additional correctness rules', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
                await antfu({ typescript: true }, createBaseConfigs()),
                (id) => id === 'e18e/ban-dependencies'
                  || id === 'no-constant-binary-expression'
                  || id === 'no-useless-assignment'
                  || id === 'preserve-caught-error'
                  || id === 'test/valid-expect'
                  || id === 'test/valid-expect-in-promise',
            );
        });

        it('should flag rimraf while retaining the axios exception', ({ expect }) => {
            const input = 'import axios from "axios"; import { rimraf } from "rimraf";';
            const messages = new Linter().verify(input, configs, { filename: 'fixture.ts' });

            expect(messages.map((message) => message.ruleId)).toEqual(['e18e/ban-dependencies']);
            expect(messages[0]?.message).toContain('rimraf');
        });

        it.for([
            {
                filename: 'fixture.js',
                input: 'const value = a + b ?? fallback;',
                ruleId: 'no-constant-binary-expression',
            },
            {
                filename: 'fixture.ts',
                input: 'const value = a + b ?? fallback;',
                ruleId: 'no-constant-binary-expression',
            },
            {
                filename: 'fixture.test.ts',
                input: 'import { it, expect } from \'vitest\'; it(\'case\', () => { expect(); });',
                ruleId: 'test/valid-expect',
            },
            {
                filename: 'fixture.spec.ts',
                input: 'import { it, expect } from \'vitest\'; it(\'case\', () => { '
                  + 'Promise.resolve(1).then(value => { expect(value).toBe(1); }); });',
                ruleId: 'test/valid-expect-in-promise',
            },
        ])(
            'should report $ruleId in $filename',
            (
                {
                    filename,
                    input,
                    ruleId,
                },
                { expect },
            ) => {
                const messages = new Linter().verify(input, configs, { filename });
                expect(messages.map((message) => message.ruleId)).toContain(ruleId);
            },
        );

        it.for([
            'fixture.js',
            'fixture.ts',
        ])(
            'should detect unused assignments and discarded error causes in %s',
            (filename, { expect }) => {
                const input = 'let value = 1; value = 2; console.log(value); '
                  + 'try { task(); } catch (error) { throw new Error("Failed"); }';

                const messages = new Linter().verify(input, configs, { filename });

                expect(messages.map((message) => message.ruleId).sort()).toEqual([
                    'no-useless-assignment',
                    'preserve-caught-error',
                ]);
            },
        );

        it.for([
            'fixture.js',
            'fixture.ts',
        ])(
            'should not apply assertion rules outside test files: %s',
            (filename, { expect }) => {
                const input = 'import { expect } from \'vitest\'; expect();';
                expect(new Linter().verify(input, configs, { filename })).toEqual([]);
            },
        );

        it('should accept consumed assignments, preserved errors, and awaited assertions', ({ expect }) => {
            const input = 'let value = 1; console.log(value); value = 2; console.log(value); '
              + 'try { task(); } catch (error) { throw new Error("Failed", { cause: error }); } '
              + 'import { it, expect } from \'vitest\'; it(\'case\', async () => { '
              + 'await Promise.resolve(1).then(value => { expect(value).toBe(1); }); });';

            expect(new Linter().verify(input, configs, { filename: 'fixture.test.ts' })).toEqual([]);
        });
    });
});
