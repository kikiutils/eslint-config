import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import {
    antfu,
    GLOB_JS,
    GLOB_JSX,
    GLOB_TESTS,
    GLOB_TS,
    GLOB_TSX,
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
    it('should create separate shared, source, typed, test, and JSONC layers', ({ expect }) => {
        const configs = createBaseConfigs();
        const [
            shared,
            source,
            typescript,
            typeAware,
            testFiles,
            vscode,
            ignores,
        ] = configs;

        expect(configs).toHaveLength(7);
        expect(shared?.rules).toEqual({
            'e18e/ban-dependencies': [
                'error',
                { allowed: ['axios'] },
            ],
            'e18e/prefer-static-regex': 'off',
        });

        expect(source?.files).toEqual([
            GLOB_JS,
            GLOB_JSX,
            GLOB_TS,
            GLOB_TSX,
        ]);

        expect(source?.plugins).toHaveProperty('promise');
        expect(Object.keys(source?.plugins?.kikiutils.rules ?? {})).toEqual([
            'compact-iteration-layout',
            'consistent-condition-layout',
            'consistent-parameter-layout',
            'statement-padding',
        ]);

        expect(source?.rules?.['node/prefer-global/process']).toEqual([
            'error',
            'always',
        ]);

        expect(typescript?.files).toEqual([
            GLOB_TS,
            GLOB_TSX,
        ]);

        expect(typescript?.rules?.['ts/array-type']).toEqual([
            'error',
            { default: 'array-simple' },
        ]);

        expect(typeAware?.files).toEqual([
            GLOB_TS,
            GLOB_TSX,
        ]);

        expect(typeAware?.ignores).toEqual(['**/*.config.?([cm])ts']);
        expect(typeAware?.languageOptions?.parserOptions).toMatchObject({
            projectService: true,
            tsconfigRootDir: process.cwd(),
        });

        expect(typeAware?.rules).toMatchObject({
            'require-await': 'off',
            'ts/require-await': 'error',
            'ts/switch-exhaustiveness-check': [
                'error',
                { considerDefaultExhaustiveForUnions: true },
            ],
        });

        expect(testFiles?.files).toEqual(GLOB_TESTS);
        expect(testFiles?.rules).toEqual({
            'kikiutils/consistent-parameter-layout': [
                'error',
                { compactTestCalls: true },
            ],
            'test/valid-expect': 'error',
            'test/valid-expect-in-promise': 'error',
        });

        expect(vscode?.files).toEqual(['**/.vscode/*.json']);
        expect(ignores).toEqual({ ignores: ['**/*.md/**'] });
    });

    it('should use node import sorting by default and forward explicit bun environment', ({ expect }) => {
        const nodeRules = createBaseRules();
        const bunRules = createBaseRules('bun');

        expect(nodeRules['perfectionist/sort-imports']).toMatchObject([
            'error',
            {
                environment: 'node',
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

    it('should enable the opinionated rules that consumers rely on', ({ expect }) => {
        const rules = createBaseRules();

        expect(rules).toMatchObject({
            'kikiutils/compact-iteration-layout': 'error',
            'kikiutils/consistent-condition-layout': 'error',
            'kikiutils/consistent-parameter-layout': 'error',
            'kikiutils/statement-padding': 'error',
            'no-constant-binary-expression': 'error',
            'no-useless-assignment': 'error',
            'preserve-caught-error': 'error',
            'require-await': 'error',
        });
    });

    describe('test file scope', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
                await antfu({ typescript: true }, createBaseConfigs()),
                (id) => id === 'test/valid-expect',
            );
        });

        it.for([
            'fixture.test.ts',
            'fixture.spec.ts',
            'fixture.test.mts',
            '__tests__/fixture.cts',
        ])(
            'should check assertions in %s',
            (filename, { expect }) => {
                const input = 'import { it, expect } from \'vitest\'; it(\'case\', () => { expect(); });';
                const messages = new Linter().verify(input, configs, { filename });
                expect(messages.map((message) => message.ruleId)).toEqual(['test/valid-expect']);
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
    });
});
