import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { compactIterationLayout } from '../src/_internals/rules/compact-iteration-layout';
import { createBaseConfigs } from '../src/base';
import { createVueConfig } from '../src/vue';

import { filterRules } from './utils';

const ruleId = 'kikiutils/compact-iteration-layout';
const ruleConfig = {
    plugins: { kikiutils: { rules: { 'compact-iteration-layout': compactIterationLayout } } },
    rules: { [ruleId]: 'error' as const },
};

describe('compact-iteration-layout', () => {
    it.for([
        'for (const v of []) {}',
        'for (const v of [\n    1,\n    2,\n]) {}',
        'for (const key in {\n    a: 1,\n}) {}',
        'for (\n    let i = 0;\n    i < 2;\n    i++\n) {}',
        'for (\n    // keep reason\n    const v of [] // keep ending\n) {}',
    ])(
        'should preserve valid layouts and boundary comments: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it.for([
        [
            'for (\n    (v) of values\n) {}',
            'for ((v) of values) {}',
        ],
        [
            'for (\n    const v of [\n        1,\n        2,\n    ]\n) {}',
            'for (const v of [\n        1,\n        2,\n    ]) {}',
        ],
        [
            'for (\n    const v of []) {}',
            'for (const v of []) {}',
        ],
        [
            'for (const v of []\n) {}',
            'for (const v of []) {}',
        ],
        [
            'for (\n    const key in {\n        a: 1,\n    }\n) {}',
            'for (const key in {\n        a: 1,\n    }) {}',
        ],
        [
            'for (\n    const [a, b] of values\n) ;',
            'for (const [a, b] of values) ;',
        ],
        [
            'async function fn() { for await (\n    const v of values\n) {} }',
            'async function fn() { for await (const v of values) {} }',
        ],
        [
            'for (\n    /* keep reason */ const v of []\n) {}',
            'for (\n    /* keep reason */ const v of []) {}',
        ],
        [
            'for (\n    const v of [] // keep ending\n) {}',
            'for (const v of [] // keep ending\n) {}',
        ],
    ] as const)(
        'should remove only boundary whitespace: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            const result = linter.verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, ruleConfig).fixed).toBe(false);
        },
    );

    describe('formatter integration', () => {
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
                (id) => id.startsWith('style/')
                  || id.startsWith('kikiutils/')
                  || id === 'antfu/consistent-list-newline',
            );
        });

        const input = 'for (\n    const v of [\n        1,\n        2,\n        3,\n        4,\n    ]\n) {}';
        const output = 'for (const v of [\n    1,\n    2,\n    3,\n    4,\n]) {}\n';

        it.for([
            {
                filename: 'fixture.js',
                input,
                output,
            },
            {
                filename: 'fixture.ts',
                input: input.replace(']\n)', '] as const\n)'),
                output: output.replace('])', '] as const)'),
            },
            {
                filename: 'fixture.vue',
                input: `<script setup lang="ts">\n${input}\n</script>\n`,
                output: `<script setup lang="ts">\n${output}</script>\n`,
            },
        ])(
            'should converge with existing formatters in $filename: $input',
            (
                {
                    filename,
                    input,
                    output,
                },
                { expect },
            ) => {
                const linter = new Linter();
                const options = { filename };
                const result = linter.verifyAndFix(input, configs, options);
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(output);
                expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
            },
        );
    });
});
