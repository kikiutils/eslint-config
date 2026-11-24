import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { commentIndent } from '../src/_internals/rules/comment-indent';
import { createBaseConfigs } from '../src/base';
import { createVueConfig } from '../src/vue';

import { createSyntaxConfigs } from './utils';

const ruleId = 'kikiutils/comment-indent';
const ruleConfig = {
    plugins: { kikiutils: { rules: { 'comment-indent': commentIndent } } },
    rules: { [ruleId]: 'error' as const },
};

describe('comment-indent', () => {
    it.for([
        'const a = {\n    // note\n    b: 1,\n};',
        'const a = {\n    b: 1,\n    // trailing note\n};',
        'switch (a) {\n    case 1:\n        run();\n        // falls through\n    case 2:\n        break;\n}',
        'const a = { // inline note\n    b: 1,\n};',
        'fn(\n    /* note */ value,\n);',
    ])(
        'should preserve aligned and unrelated comments: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.fixed).toBe(false);
        },
    );

    it.for([
        [
            'const a = {\n// note\n    b: 1,\n};',
            'const a = {\n    // note\n    b: 1,\n};',
        ],
        [
            'fn([\n    // first\n    // second\n        value,\n]);',
            'fn([\n        // first\n        // second\n        value,\n]);',
        ],
    ] as const)(
        'should align comments after an opening bracket with the next code: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            const result = linter.verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
        },
    );

    describe('formatter integration', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
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

        const props = 'withDefaults(defineProps<{\n    // first\n    size?: string;\n}>(), { size: \'1rem\' });';
        const propsOutput = 'withDefaults(\n    defineProps<{\n        // first\n        size?: string;\n    }>(),\n    { size: \'1rem\' },\n);\n';

        it.for([
            {
                filename: 'fixture.ts',
                input: props,
                output: propsOutput,
            },
            {
                filename: 'fixture.vue',
                input: `<script setup lang="ts">\n${props}\n</script>\n`,
                output: `<script setup lang="ts">\n${propsOutput}</script>\n`,
            },
            {
                filename: 'fixture.ts',
                input: 'withDefaults(defineProps<{\n    /**\n     * CSS size.\n     */\n    size?: string;\n}>(), { size: \'1rem\' });',
                output: 'withDefaults(\n    defineProps<{\n        /**\n         * CSS size.\n         */\n        size?: string;\n    }>(),\n    { size: \'1rem\' },\n);\n',
            },
            {
                filename: 'fixture.ts',
                input: 'const label = labels[\n// Use the active locale.\n\n    locale\n];',
                output: 'const label = labels[\n// Use the active locale.\n\n    locale\n];\n',
            },
            {
                filename: 'fixture.ts',
                input: 'fn(a, {\n  // two-space\n  b: 1,\n});',
                output: 'fn(\n    a,\n    {\n        // two-space\n        b: 1,\n    },\n);\n',
            },
            {
                filename: 'fixture.ts',
                input: 'if (check({\n    // note\n    a: 1,\n}) && b) {}',
                output: 'if (\n    check({\n        // note\n        a: 1,\n    })\n    && b\n) {}\n',
            },
        ])(
            'should keep comments with their nested code in $filename: $input',
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
