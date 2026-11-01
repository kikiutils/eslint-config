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
