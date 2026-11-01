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

const ruleIds = [
    'ts/await-thenable',
    'ts/no-base-to-string',
    'ts/no-floating-promises',
    'ts/no-for-in-array',
    'ts/no-misused-promises',
    'ts/no-misused-spread',
    'ts/no-unnecessary-type-assertion',
    'ts/require-await',
    'ts/return-await',
    'ts/switch-exhaustiveness-check',
];

describe('type-aware configs', () => {
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
            (id) => id === 'require-await' || ruleIds.includes(id),
        );
    });

    it.for([
        'ts',
        'vue',
    ])(
        'should enable all ten typed checks in %s without consumer parser overrides',
        (extension, { expect }) => {
            const code = [
                'async function run(): Promise<void> {',
                '    const pending = Promise.resolve();',
                '    pending;',
                '    [1].forEach(async () => { await pending; });',
                '    await 42;',
                '    for (const key in [1, 2]) { console.log(key); }',
                '    const message = String({ value: 1 });',
                '    const copy = { ...new Map([[\'key\', 1]]) };',
                '}',
                'async function load() { try { return Promise.resolve(1); } catch { return 0; } }',
                'async function immediate() { return 1; }',
                'function identity(value: number): number { return value as number; }',
                'type State = \'idle\' | \'ready\' | null | undefined;',
                'function handle(state: State): void {',
                '    switch (state) { case \'idle\': return; }',
                '}',
                'export { run, load, immediate, identity, handle };',
            ].join('\n');

            const input = extension === 'vue' ? `<script lang="ts">\n${code}\n</script>\n` : code;
            const filename = fileURLToPath(new URL(`./fixtures/type-aware/fixture.${extension}`, import.meta.url));
            const messages = new Linter().verify(input, configs, { filename });
            expect(messages.map((message) => message.ruleId).sort()).toEqual([...ruleIds].sort());
        },
    );

    it.for([
        'fixture.js',
        'tsdown.config.ts',
        'tool.config.mts',
        'tool.config.cts',
    ])(
        'should retain core rules without typed parsing or checks in syntax-only files: %s',
        (filename, { expect }) => {
            const code = 'Promise.resolve(); async function run() { return 1; }';
            const messages = new Linter().verify(code, configs, { filename });

            expect(messages.map((message) => message.ruleId)).toEqual(['require-await']);
        },
    );
});
