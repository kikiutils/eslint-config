import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
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
import { createVueConfig } from '../src/vue';

import { createSyntaxConfigs } from './utils';

describe.concurrent('base eslint config factory', () => {
    it('should use node import sorting by default and forward explicit bun environment', ({ expect }) => {
        expect(createBaseRules()['perfectionist/sort-imports']).toMatchObject([
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

        expect(createBaseRules('bun')['perfectionist/sort-imports']).toMatchObject([
            'error',
            { environment: 'bun' },
        ]);

        expect(createVueConfig('bun').rules?.['perfectionist/sort-imports']).toMatchObject([
            'error',
            { environment: 'bun' },
        ]);
    });

    describe('restricted patterns', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
                await antfu({ typescript: true }, createBaseConfigs()),
                (id) => [
                    'kikiutils/no-restricted-test-imports',
                    'kikiutils/no-silent-catch',
                    'no-empty',
                    'no-restricted-imports',
                    'no-restricted-syntax',
                ].includes(id),
            );
        });

        it.for([
            [
                'if (error instanceof AxiosError) handle();',
                'no-restricted-syntax',
            ],
            ...[
                'promise.catch(() => {});',
                'promise.catch(() => undefined);',
                'promise.catch(() => null);',
                'promise?.catch(() => void 0);',
                'promise.catch(function () { return; });',
            ].map((input) => [
                input,
                'kikiutils/no-silent-catch',
            ] as const),
            [
                'try { run(); } catch {}',
                'no-empty',
            ],
            [
                'import { x } from \'pkg/libs/_internals/x\'; x();',
                'no-restricted-imports',
            ],
        ] as const)(
            'should report %s',
            ([input, ruleId], { expect }) => {
                const messages = new Linter().verify(input, configs, { filename: 'fixture.ts' });
                expect(messages.map((message) => message.ruleId)).toEqual([ruleId]);
            },
        );

        it('should keep the private import restriction in test files', ({ expect }) => {
            const input = 'import { expect } from \'vitest\';\nimport { x } from \'pkg/_internals/x\';\nexpect(x);';
            const messages = new Linter().verify(input, configs, { filename: 'fixture.test.ts' });
            expect(messages.map((message) => message.ruleId).sort()).toEqual([
                'kikiutils/no-restricted-test-imports',
                'no-restricted-imports',
            ]);
        });

        it.for([
            'try { run(); } catch { /* The fallback below covers it. */ }',
            'promise.catch(() => { /* A failed prefetch only skips the cache. */ });',
            'promise.catch(() => false);',
            'promise.catch((error) => { report(error); });',
            'import { x } from \'./_internals/x\'; x();',
        ])(
            'should allow %s',
            (input, { expect }) => {
                expect(new Linter().verify(input, configs, { filename: 'fixture.ts' })).toEqual([]);
            },
        );
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
