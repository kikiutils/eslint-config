import { fileURLToPath } from 'node:url';

import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';
import { createVueConfig } from '../src/vue';

import { filterRules } from './utils';

describe('typefest configs', () => {
    let configs: TypedFlatConfigItem[];

    beforeAll(async () => {
        configs = filterRules(
            await antfu(
                {
                    typescript: true,
                    vue: true,
                },
                createBaseConfigs(),
                createVueConfig(),
            ),
            (id) => id.startsWith('typefest/'),
        );
    });

    it.for([
        'ts',
        'vue',
    ])(
        'should share typed parser services with typefest in %s',
        { timeout: 30_000 },
        (extension, { expect }) => {
            const code = [
                'const values = [\'idle\', \'ready\'] as const;',
                'type State = (typeof values)[number];',
            ].join('\n');

            const input = extension === 'vue' ? `<script lang="ts">\n${code}\n</script>\n` : code;
            const filename = fileURLToPath(new URL(`./fixtures/type-aware/fixture.${extension}`, import.meta.url));
            const messages = new Linter().verify(input, configs, { filename });

            expect(messages.map((message) => message.ruleId)).toEqual(['typefest/prefer-type-fest-array-values']);
        },
    );

    it.for([
        'fixture.js',
        'tsdown.config.ts',
    ])(
        'should leave syntax-only files unchanged: %s',
        (filename, { expect }) => {
            expect(new Linter().verify('Object.keys({ id: 1 });', configs, { filename })).toEqual([]);
        },
    );
});
