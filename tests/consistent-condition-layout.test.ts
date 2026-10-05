import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';
import { consistentConditionLayout } from '../src/internals/rules/consistent-condition-layout';
import { createVueConfig } from '../src/vue';

const ruleName = 'kikiutils/consistent-condition-layout';
const ruleConfig = {
    plugins: { kikiutils: { rules: { 'consistent-condition-layout': consistentConditionLayout } } },
    rules: { [ruleName]: 'error' as const },
};

describe('consistent-condition-layout', () => {
    it('should complete deeply nested parentheses without conflicting fixes', ({ expect }) => {
        const input = `if (${'('.repeat(12)}a && b\n|| c${')'.repeat(12)}) {}`;
        const output = `if (\n${'(\n'.repeat(12)}a \n&& b\n|| c\n${')\n'.repeat(12)}) {}`;
        const linter = new Linter();
        expect(linter.verify(input, ruleConfig)).toHaveLength(1);
        const result = linter.verifyAndFix(input, ruleConfig);
        expect(result.messages).toEqual([]);
        expect(result.output).toBe(output);
        expect(linter.verifyAndFix(result.output, ruleConfig).fixed).toBe(false);
    });

    it.for([
        'if (a === 1 || b === 2 || z === 3) {}',
        'if (\n    a === 1\n    || b === 2\n    || z === 3\n) {}',
        'if (\n    a\n    && b\n    || (c && d)\n) {}',
        'if (\n    a\n    && (b === 2)\n) {}',
        'if (\n    a\n    && (\n        b === 2\n    )\n) {}',
        'const value = (a +\n    b);',
        'const value = a && b\n    || c;',
        'const value = (a ?? b\n    ?? c);',
        'fn({\n    key: 2,\n});',
        'function fn(\n    value,\n) {}',
    ])(
        'should preserve an already valid or unrelated expression: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it.for([
        [
            'if (a && (\n    b === 2)) {}',
            'if (\na \n&& (\n    b === 2\n)\n) {}',
        ],
        [
            'if (a && (b === 2\n)) {}',
            'if (\na \n&& (\nb === 2\n)\n) {}',
        ],
        [
            'if (a && (b ===\n    2)) {}',
            'if (\na \n&& (\nb ===\n    2\n)\n) {}',
        ],
        [
            'if (a && ((\n    b === 2 /* reason */))) {}',
            'if (\na \n&& (\n(\n    b === 2 /* reason */\n)\n)\n) {}',
        ],
        [
            'if (a === 1 || b === 2\n  || z === 3) {}',
            'if (\na === 1 \n|| b === 2\n  || z === 3\n) {}',
        ],
        [
            'if (\n    a && b && c || (d && e)\n) {}',
            'if (\n    a \n&& b \n&& c \n|| (d && e)\n) {}',
        ],
        [
            'if (a && (b || c\n    || d)) {}',
            'if (\na \n&& (\nb \n|| c\n    || d\n)\n) {}',
        ],
        [
            'if (((a && b\n    || c))) {}',
            'if (\n(\n(\na \n&& b\n    || c\n)\n)\n) {}',
        ],
        [
            'while (a && b\n    && c) {}',
            'while (\na \n&& b\n    && c\n) {}',
        ],
        [
            'do {} while (a || b\n    || c);',
            'do {} while (\na \n|| b\n    || c\n);',
        ],
        [
            'const value = (a && b\n    || c);',
            'const value = (\na \n&& b\n    || c\n);',
        ],
        [
            'if (check({\n    key: 2\n})) {}',
            'if (\ncheck({\n    key: 2\n})\n) {}',
        ],
        [
            'if (!(a && b\n    || c)) {}',
            'if (\n!(\na \n&& b\n    || c\n)\n) {}',
        ],
        [
            'const value = (!(a && b\n    || c));',
            'const value = (\n!(\na \n&& b\n    || c\n)\n);',
        ],
        [
            'if (a /* reason */ && b\n    || c) {}',
            'if (\na /* reason */ \n&& b\n    || c\n) {}',
        ],
        [
            'if (a // reason\n    && b || c) {}',
            'if (\na // reason\n    && b \n|| c\n) {}',
        ],
    ])(
        'should insert only the missing newlines: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            const result = linter.verifyAndFix(input!, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, ruleConfig).fixed).toBe(false);
        },
    );

    it('should converge with existing formatters in JS, TS, JSX, and Vue', async ({ expect }) => {
        const configs = (await antfu(
            {
                typescript: true,
                vue: true,
            },
            createBaseConfigs(),
            createVueConfig(),
        )).map((config) => ({
            ...config,
            rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([name]) =>
                name.startsWith('style/')
                || name.startsWith('kikiutils/')
                || name === 'vue/html-indent'
                || name === 'antfu/consistent-list-newline')),
        }));

        const inputs = [
            {
                filename: 'fixture.js',
                input: 'if (a && (\n    b === 2)) {}',
                output: 'if (\n    a\n    && (\n        b === 2\n    )\n) {}\n',
            },
            {
                filename: 'fixture.js',
                input: 'if (a === 1 || b === 2\n  || z === 3) {}',
                output: 'if (\n    a === 1\n    || b === 2\n    || z === 3\n) {}\n',
            },
            {
                filename: 'fixture.ts',
                input: 'if ((a === 1 && b === 2\n    && z === 3) || (a === 1 && b === 2)) {}',
                // eslint-disable-next-line style/max-len
                output: 'if (\n    (\n        a === 1\n        && b === 2\n        && z === 3\n    )\n    || (a === 1 && b === 2)\n) {}\n',
            },
            {
                filename: 'fixture.js',
                input: 'if ((a === 1 && b === 2\n    && z === 3) || (a === 1\n        && b === 2)) {}',
                // eslint-disable-next-line style/max-len
                output: 'if (\n    (\n        a === 1\n        && b === 2\n        && z === 3\n    )\n    || (\n        a === 1\n        && b === 2\n    )\n) {}\n',
            },
            {
                filename: 'fixture.js',
                input: 'if (a ||\n    b || c) {}',
                output: 'if (\n    a\n    || b\n    || c\n) {}\n',
            },
            {
                filename: 'fixture.js',
                input: 'if (a // reason\n    || b || c) {}',
                output: 'if (\n    a // reason\n    || b\n    || c\n) {}\n',
            },
            {
                filename: 'fixture.js',
                input: 'if (check({\n    key: 2\n})) {}',
                output: 'if (\n    check({ key: 2 })\n) {}\n',
            },
            {
                filename: 'fixture.tsx',
                input: 'function Component() { if (a && b\n    && c) return <div />; }',
            },
            {
                filename: 'fixture.vue',
                input: '<script setup lang="ts">\nif (a && b\n    && c) {}\n</script>\n',
            },
            {
                filename: 'fixture.vue',
                input: '<template>\n    <div v-if="(a && b\n    && c)" />\n</template>\n',
            },
        ];

        const linter = new Linter();
        const ungrouped = linter.verifyAndFix('if (a && b\n    || c) {}', configs, { filename: 'fixture.js' });
        expect(ungrouped.messages.map((message) => message.ruleId)).toEqual([
            'style/no-mixed-operators',
            'style/no-mixed-operators',
        ]);

        for (const {
            filename,
            input,
            output,
        } of inputs) {
            const options = { filename };
            const result = linter.verifyAndFix(input, configs, options);
            expect(result.messages).toEqual([]);
            if (output !== undefined) expect(result.output).toBe(output);
            expect(result.output).toMatch(/\(\n/);
            expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
        }
    });
});
