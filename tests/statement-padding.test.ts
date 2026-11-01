import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { statementPadding } from '../src/_internals/rules/statement-padding';
import { createBaseConfigs } from '../src/base';
import { createVueConfig } from '../src/vue';

import { filterRules } from './utils';

const ruleId = 'kikiutils/statement-padding';
const ruleConfig = {
    plugins: { kikiutils: { rules: { 'statement-padding': statementPadding } } },
    rules: { [ruleId]: 'error' as const },
};

describe('statement-padding', () => {
    it.for([
        'const a = 1;\nconst b = 2;\nfn(a, b);',
        'let x = a;\n    let xx = b;\nlet d = 444;',
        '// leading\n// comment\nconst a = 1;\nnext();',
        'const a = 1;\nconst b = {\n    value: 2,\n};',
        'import {\n    a,\n} from \'one\';\nimport { b } from \'two\';\nfn(a, b);',
        'fn(\n    a,\n);\nimport { b } from \'two\';',
        'export {\n    a,\n} from \'one\';\nnext();',
        'fn(\n    a,\n);\nexport { b } from \'two\';',
        'fn(\n    a,\n);\nexport * from \'two\';',
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
            'do {\n    work();\n} while (pending);\nnext();',
            'do {\n    work();\n} while (pending);\n\nnext();',
        ],
        [
            'const result = items.map(\n    transform,\n).filter(Boolean);\nuse(result);',
            'const result = items.map(\n    transform,\n).filter(Boolean);\n\nuse(result);',
        ],
        [
            'const text = `first\nsecond`;\nnext();',
            'const text = `first\nsecond`;\n\nnext();',
        ],
        [
            'fn(\n    a,\n); /* trailing\nreason */ next();',
            'fn(\n    a,\n); /* trailing\nreason */ \n\nnext();',
        ],
        [
            'fn(\n    a,\n); /* trailing\n\nreason */ next();',
            'fn(\n    a,\n); /* trailing\n\nreason */ \n\nnext();',
        ],
        [
            'fn(\n    a,\n); /* trailing\nreason */ // still trailing\n// next reason\nnext();',
            'fn(\n    a,\n); /* trailing\nreason */ // still trailing\n\n// next reason\nnext();',
        ],
        [
            'fn(\n    a,\n);\n// next reason\n\nnext();',
            'fn(\n    a,\n);\n\n// next reason\n\nnext();',
        ],
        [
            'fn(\r\n    a,\r\n);\r\nnext();',
            'fn(\r\n    a,\r\n);\r\n\r\nnext();',
        ],
        [
            'export function fn() {}\nnext();',
            'export function fn() {}\n\nnext();',
        ],
        [
            'function fn() {\n    work();\n}\nexport { fn };',
            'function fn() {\n    work();\n}\n\nexport { fn };',
        ],
        [
            'function fn() {}\n\nexport {\n    fn,\n};\nnext();',
            'function fn() {}\n\nexport {\n    fn,\n};\n\nnext();',
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
    ] as const)(
        'should insert a blank line only between sibling statements: %s',
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

        it('should pad before a local type export without relying on other rules', ({ expect }) => {
            const input = 'type A = number;\nfunction fn() {\n    work();\n}\nexport type { A };';
            const output = 'type A = number;\nfunction fn() {\n    work();\n}\n\nexport type { A };';
            const ruleConfigs = filterRules(configs, (id) => id === ruleId);
            const options = { filename: 'fixture.ts' };
            const linter = new Linter();
            const result = linter.verifyAndFix(input, ruleConfigs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, ruleConfigs, options).fixed).toBe(false);
        });

        // eslint-disable-next-line style/max-len
        const input = 'function fn() {\n    if (enabled) {\n        if (ready) {\n            start();\n        }\n    }\n    const result = call(\n        first,\n        second,\n    );\n    check(result);\n}\n';
        const output = input
            .replace('    }\n    const', '    }\n\n    const')
            .replace('    );\n    check', '    );\n\n    check');

        it.for([
            'fixture.js',
            'fixture.ts',
            'fixture.vue',
        ])(
            'should converge with existing formatters in %s',
            (filename, { expect }) => {
                const linter = new Linter();
                const isVue = filename.endsWith('.vue');
                const wrap = (code: string): string => isVue ? `<script setup lang="ts">\n${code}</script>\n` : code;
                const result = linter.verifyAndFix(wrap(input), configs, { filename });
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(wrap(output));
                expect(linter.verifyAndFix(result.output, configs, { filename }).fixed).toBe(false);
            },
        );

        it.for([
            'fixture.js',
            'fixture.ts',
            'fixture.vue',
        ])(
            'should fix indentation without adding blank lines in %s',
            (filename, { expect }) => {
                const input = 'let x = a;\n    let xx = b;\nlet d = 444;\n';
                const output = 'let x = a;\nlet xx = b;\nlet d = 444;\n';
                const isVue = filename.endsWith('.vue');
                const wrap = (code: string): string => isVue ? `<script setup lang="ts">\n${code}</script>\n` : code;
                const linter = new Linter();
                const options = { filename };
                const result = linter.verifyAndFix(wrap(input), configs, options);
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(wrap(output));
                expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
            },
        );
    });
});
