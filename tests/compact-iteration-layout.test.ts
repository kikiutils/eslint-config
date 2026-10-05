import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';
import { compactIterationLayout } from '../src/internals/rules/compact-iteration-layout';
import { createVueConfig } from '../src/vue';

const ruleName = 'kikiutils/compact-iteration-layout';
const ruleConfig = {
    plugins: { kikiutils: { rules: { 'compact-iteration-layout': compactIterationLayout } } },
    rules: { [ruleName]: 'error' as const },
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
    ])(
        'should remove only boundary whitespace: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            const result = linter.verifyAndFix(input!, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, ruleConfig).fixed).toBe(false);
        },
    );

    it('should converge with existing formatters in JS, TS, and Vue scripts', async ({ expect }) => {
        const configs = (await antfu(
            {
                typescript: true,
                vue: true,
            },
            createBaseConfigs(),
            createVueConfig(),
        ))
            .map((config) => ({
                ...config,
                rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([name]) =>
                    name.startsWith('style/')
                    || name.startsWith('kikiutils/')
                    || name === 'antfu/consistent-list-newline')),
            }));

        const input = 'for (\n    const v of [\n        1,\n        2,\n        3,\n        4,\n    ]\n) {}';
        const output = 'for (const v of [\n    1,\n    2,\n    3,\n    4,\n]) {}\n';
        const fixtures = [
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
        ];

        const linter = new Linter();
        for (const {
            filename,
            input,
            output,
        } of fixtures) {
            const result = linter.verifyAndFix(input, configs, { filename });
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, configs, { filename }).fixed).toBe(false);
        }
    });
});
