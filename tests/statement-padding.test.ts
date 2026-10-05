import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';
import { statementPadding } from '../src/internals/rules/statement-padding';
import { createVueConfig } from '../src/vue';

const ruleName = 'kikiutils/statement-padding';
const ruleConfig = {
    plugins: { kikiutils: { rules: { 'statement-padding': statementPadding } } },
    rules: { [ruleName]: 'error' as const },
};

describe('statement-padding', () => {
    it.for([
        'const a = 1;\nconst b = 2;\nfn(a, b);',
        'fn(\n    a,\n    b,\n);',
        'if (a) {\n    if (b) {\n        fn();\n    }\n}',
        'if (a) {\n    fn();\n} else {\n    other();\n}',
        'try {\n    fn();\n} catch (error) {\n    other();\n} finally {\n    end();\n}',
        'fn(\n    a,\n    b,\n);\n\nnext();',
        'fn(\n    a,\n    b,\n);\n\n// next reason\nnext();',
        'const a = { x: 1 };\nconst b = [1, 2];\nfn(a, b);',
        'const a = {\n    x: 1,\n    y: 2,\n};',
        'const a = [\n    1,\n    2,\n];',
        'fn()\n    .first()\n    .second();',
        'switch (a) {\n    case 1:\n        fn();\n        break;\n    case 2:\n        other();\n        break;\n}',
    ])(
        'should preserve valid spacing and continuous structures: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it.for([
        [
            'fn(\n    a,\n);\n/* reason\n\ncontinued */\nnext();',
            'fn(\n    a,\n);\n\n/* reason\n\ncontinued */\nnext();',
        ],
        [
            'const result = fn(\n    a,\n    b,\n);\ncheck(result);',
            'const result = fn(\n    a,\n    b,\n);\n\ncheck(result);',
        ],
        [
            'const a = {\n    x: 1,\n};\nfn(a);',
            'const a = {\n    x: 1,\n};\n\nfn(a);',
        ],
        [
            'const a = [\n    1,\n];\nfn(a);',
            'const a = [\n    1,\n];\n\nfn(a);',
        ],
        [
            'if (a) {\n    fn();\n}\nend();',
            'if (a) {\n    fn();\n}\n\nend();',
        ],
        [
            'if (a) { fn(); }\nend();',
            'if (a) { fn(); }\n\nend();',
        ],
        [
            'fn()\n    .first();\nnext();',
            'fn()\n    .first();\n\nnext();',
        ],
        [
            'fn(\n    a,\n); next();',
            'fn(\n    a,\n); \n\nnext();',
        ],
        [
            'fn(\n    a,\n); // trailing reason\n// next reason\nnext();',
            'fn(\n    a,\n); // trailing reason\n\n// next reason\nnext();',
        ],
        [
            'fn(\n    a,\n); /* trailing\nreason */\nnext();',
            'fn(\n    a,\n); /* trailing\nreason */\n\nnext();',
        ],
        [
            'function fn() {\n    if (a) { work(); }\n    next();\n}',
            'function fn() {\n    if (a) { work(); }\n\n    next();\n}',
        ],
        [
            'switch (a) { case 1: if (b) { fn(); }\n    next(); }',
            'switch (a) { case 1: if (b) { fn(); }\n\n    next(); }',
        ],
        [
            'class A { static { if (a) { fn(); }\n    next(); } }',
            'class A { static { if (a) { fn(); }\n\n    next(); } }',
        ],
    ])(
        'should insert a blank line only between sibling statements: %s',
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

        // eslint-disable-next-line style/max-len
        const input = 'function fn() {\n    if (enabled) {\n        if (ready) {\n            start();\n        }\n    }\n    const result = call(\n        first,\n        second,\n    );\n    check(result);\n}\n';
        const output = input
            .replace('    }\n    const', '    }\n\n    const')
            .replace('    );\n    check', '    );\n\n    check');

        const linter = new Linter();
        for (const filename of [
            'fixture.js',
            'fixture.ts',
            'fixture.vue',
        ]) {
            const isVue = filename.endsWith('.vue');
            const wrap = (code: string): string => isVue ? `<script setup lang="ts">\n${code}</script>\n` : code;
            const result = linter.verifyAndFix(wrap(input), configs, { filename });
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(wrap(output));
            expect(linter.verifyAndFix(result.output, configs, { filename }).fixed).toBe(false);
        }
    });
});
