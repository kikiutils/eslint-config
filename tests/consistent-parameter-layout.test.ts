import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { consistentParameterLayout } from '../src/_internals/rules/consistent-parameter-layout';
import { createBaseConfigs } from '../src/base';
import { createVueConfig } from '../src/vue';

import { createSyntaxConfigs } from './utils';

const ruleId = 'kikiutils/consistent-parameter-layout';
const ruleConfig = {
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { kikiutils: { rules: { 'consistent-parameter-layout': consistentParameterLayout } } },
    rules: { [ruleId]: 'error' as const },
};

describe('consistent-parameter-layout', () => {
    it.for([
        '({ a, b }) => {};',
        '({\n    a, b, c\n}) => {};',
        'a({\n    a: 1,\n    b: 2\n});',
        'new A({\n    a: 1,\n    b: 2\n});',
        '(\n    { a, b },\n) => {};',
        'a(\n    {\n        a: 1\n    },\n);',
        'new A(\n    {\n        a: 1\n    },\n);',
        'a(\n    ({\n        a: 1\n    }),\n);',
        'function fn(\n    a,\n) {}',
        'a(\n    // keep this reason\n    value,\n);',
        'a(\n    value, // keep this reason\n);',
        'a(/* keep this reason */ value\n);',
        'function fn(\n    // keep this reason\n    value\n) {}',
        'foo(x => bar(\n    a,\n    b,\n));',
        'foo((x => bar(\n    a,\n    b,\n)));',
        'foo(async x => bar(\n    a,\n    b,\n));',
        'a(1, 2, 3);',
        'new ClassA(1, 2, 3);',
        '(a, b, c) => {};',
        'function fn(a, b) {\n    return a;\n}',
        'a(() => { work(); });',
        'a(\n    1, {\n        key: 2\n    }\n);',
        '() => {\n    work();\n};',
        'render(<div>\n    text\n</div>);',
        'render(\n    <div>\n        text\n    </div>,\n);',
        'render(\n    <>\n        text\n    </>,\n);',
        'new A(\n    <div>\n        text\n    </div>,\n);',
    ])(
        'should preserve valid layouts, comments, and JSX: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it.for([
        [
            'fn(a,\n    b, c);',
            'fn(\na,\n    b, c);',
        ],
        [
            'new A(a,\n    b, c);',
            'new A(\na,\n    b, c);',
        ],
        [
            '(a,\n    b, c) => {};',
            '(\na,\n    b, c) => {};',
        ],
        [
            '(\n    { a, b }) => {};',
            '(\n    { a, b }\n) => {};',
        ],
        [
            '({ a, b },\n) => {};',
            '(\n{ a, b },\n) => {};',
        ],
        [
            'a(\n    {\n        a: 1\n    });',
            'a(\n    {\n        a: 1\n    }\n);',
        ],
        [
            'new A(value,\n);',
            'new A(\nvalue,\n);',
        ],
        [
            'a(\n    ({\n        a: 1\n    }));',
            'a(\n    ({\n        a: 1\n    })\n);',
        ],
        [
            'function fn(\n    a) {}',
            'function fn(\n    a\n) {}',
        ],
        [
            'const fn = function (value\n) {};',
            'const fn = function (\nvalue\n) {};',
        ],
        [
            'a(1, 2, () => {\n    work();\n});',
            'a(\n1, 2, () => {\n    work();\n});',
        ],
        [
            'new ClassA(\'value\', {\n    cause: \'\'\n});',
            'new ClassA(\n\'value\', {\n    cause: \'\'\n});',
        ],
        [
            'obj.method(1, {\n    key: 2\n}, 3);',
            'obj.method(\n1, {\n    key: 2\n}, 3);',
        ],
        [
            'obj.method?.(1, {\n    key: 2\n});',
            'obj.method?.(\n1, {\n    key: 2\n});',
        ],
        [
            'a(({\n    key: 2\n}), 3);',
            'a(\n({\n    key: 2\n}), 3);',
        ],
        [
            'a(/* note */ 1, {\n    key: 2\n});',
            'a(\n/* note */ 1, {\n    key: 2\n});',
        ],
        [
            '({\n    a, b\n}, { c }) => {};',
            '(\n{\n    a, b\n}, { c }) => {};',
        ],
        [
            '({ a }, {\n    b, c\n}) => {};',
            '(\n{ a }, {\n    b, c\n}) => {};',
        ],
        [
            'function fn({\n    a, b\n}, c) {}',
            'function fn(\n{\n    a, b\n}, c) {}',
        ],
        [
            'const fn = function ({ a }, {\n    b, c\n}) {};',
            'const fn = function (\n{ a }, {\n    b, c\n}) {};',
        ],
        [
            'a(1, `first\nsecond`);',
            'a(\n1, `first\nsecond`);',
        ],
        [
            'it(\'case\', () => {\n    work();\n});',
            'it(\n\'case\', () => {\n    work();\n});',
        ],
        [
            'describe.concurrent(\'suite\', () => {\n    work();\n});',
            'describe.concurrent(\n\'suite\', () => {\n    work();\n});',
        ],
    ] as const)(
        'should fix only the inconsistent parameter boundaries: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            expect(linter.verify(input, ruleConfig).map((message) => message.ruleId)).toEqual([ruleId]);
            const result = linter.verifyAndFix(input, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, ruleConfig).fixed).toBe(false);
        },
    );

    it('should check nested calls and parameters independently', ({ expect }) => {
        const input = 'import { it } from \'vitest\'; it(\'case\', ({\n    expect\n}) => { a(1, {\n    key: 2\n}); });';

        expect(new Linter().verify(input, ruleConfig).map((message) => message.ruleId)).toEqual([
            ruleId,
            ruleId,
        ]);
    });

    describe('multiline single-parameter types', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
                await antfu({ typescript: true }, createBaseConfigs()),
                (id) => id === ruleId,
            );
        });

        const expanded = '(\n    value: Readonlyable<Array<bigint | null>>\n'
          + '      | { [path: string]: bigint | null }\n'
          + '      | { message?: string; values: Readonlyable<Array<bigint | null>> },\n) => {};';

        const compact = expanded.replace('(\n    value', '(value').replace(',\n)', ')');

        it.for([
            {
                input: expanded,
                output: expanded,
            },
            {
                input: compact,
                output: compact,
            },
            {
                input: expanded.replace('(\n', '('),
                output: expanded,
            },
            {
                input: expanded.replace(',\n)', ',)'),
                output: expanded,
            },
        ])(
            'should preserve types and complete boundaries: $input',
            ({ input, output }, { expect }) => {
                const linter = new Linter();
                const options = { filename: 'fixture.ts' };
                const result = linter.verifyAndFix(input, configs, options);
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(output);
                expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
            },
        );
    });

    describe('formatter integration', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
                await antfu({ typescript: true }, createBaseConfigs()),
                (id) => id.startsWith('style/')
                  || id === 'antfu/consistent-list-newline'
                  || id === ruleId,
            );
        });

        it.for([
            {
                filename: 'fixture.js',
                input: 'fn(a,\n    b, c);',
                output: 'fn(\n    a,\n    b,\n    c,\n);\n',
            },
            {
                filename: 'fixture.js',
                input: 'function fn() { return defineScriptAndTemplateVisitors(context.sourceCode, createVisitor, 1, 2, 3, 4, 5, 5, 5,\n    5, 5\n    , 5, 5); }',
                output: 'function fn() {\n    return defineScriptAndTemplateVisitors(\n        context.sourceCode,\n        createVisitor,\n        1,\n        2,\n        3,\n        4,\n        5,\n        5,\n        5,\n        5,\n        5,\n        5,\n        5,\n    );\n}\n',
            },
            {
                filename: 'fixture.js',
                input: 'a(1, 2, () => {\n    work();\n});',
                output: 'a(\n    1,\n    2,\n    () => {\n        work();\n    },\n);\n',
            },
            {
                filename: 'fixture.js',
                input: 'new ClassA(\'value\', {\n    cause: \'\'\n});',
                output: 'new ClassA(\n    \'value\',\n    { cause: \'\' },\n);\n',
            },
            {
                filename: 'fixture.js',
                input: '({ a }, {\n    b, c\n}) => {};',
                output: '(\n    { a },\n    { b, c },\n) => {};\n',
            },
            {
                filename: 'fixture.ts',
                input: 'a<{ fn: () => void }>(1, {\n    key: 2\n});',
                output: 'a<{ fn: () => void }>(\n    1,\n    { key: 2 },\n);\n',
            },
            {
                filename: 'fixture.ts',
                input: 'new ClassA<{ fn: () => void }>(1, {\n    key: 2\n});',
                output: 'new ClassA<{ fn: () => void }>(\n    1,\n    { key: 2 },\n);\n',
            },
            {
                filename: 'fixture.ts',
                input: '(a: {\n    key: number\n}, b: number) => {};',
                output: '(\n    a: {\n        key: number;\n    },\n    b: number,\n) => {};\n',
            },
            {
                filename: 'fixture.js',
                input: 'a(({\n    key: 2\n}), 3);',
                output: 'a(\n    { key: 2 },\n    3,\n);\n',
            },
            {
                filename: 'fixture.js',
                input: 'function fn({\n    a, b, c\n}, d) {}',
                output: 'function fn(\n    {\n        a,\n        b,\n        c,\n    },\n    d,\n) {}\n',
            },
            {
                filename: 'fixture.tsx',
                input: 'render(<div>\n    text\n</div>);',
                output: 'render(\n    <div>\n        text\n    </div>,\n);\n',
            },
            {
                filename: 'fixture.tsx',
                input: 'render(<div>{fn(1, {\n    key: 2\n})}</div>);',
                output: 'render(\n    <div>\n        {fn(\n            1,\n            { key: 2 },\n        )}\n    </div>,\n);\n',
            },
            {
                filename: 'fixture.js',
                input: 'function fn(\n    // rationale\n    value\n) {}',
                output: 'function fn(\n    // rationale\n    value,\n) {}\n',
            },
            {
                filename: 'fixture.js',
                input: 'fn(\n    // rationale\n    value,\n    1,2,3,4\n);',
                output: 'fn(\n    // rationale\n    value,\n    1,\n    2,\n    3,\n    4,\n);\n',
            },
            {
                filename: 'fixture.js',
                input: 'foo(x => bar(\n    a,\n    b,\n));',
                output: 'foo((x) => bar(\n    a,\n    b,\n));\n',
            },
            {
                filename: 'fixture.ts',
                input: '(a)<{ fn: () => void }>({\n    key: 2\n});',
                output: 'a<{ fn: () => void }>({ key: 2 });\n',
            },
            {
                filename: 'fixture.ts',
                input: 'new (A)<{ fn: () => void }>({\n    key: 2\n});',
                output: 'new A<{ fn: () => void }>({ key: 2 });\n',
            },
            {
                filename: 'fixture.tsx',
                input: 'render(<>\n    text\n</>);',
                output: 'render(\n    <>\n        text\n    </>,\n);\n',
            },
            {
                filename: 'fixture.tsx',
                input: 'render(<Component />);',
                output: 'render(<Component />);\n',
            },
            ...[
                'fixture.js',
                'fixture.tsx',
            ].map((filename) => ({
                filename,
                input: 'a(\n    {\n        a: 1,\n        b: 2\n    },\n);',
                output: 'a(\n    {\n        a: 1,\n        b: 2,\n    },\n);\n',
            })),
            {
                filename: 'fixture.js',
                input: 'a({\n    a: 1,\n    b: 2\n});',
                output: 'a({\n    a: 1,\n    b: 2,\n});\n',
            },
            {
                filename: 'fixture.js',
                input: '({\n    a, b, c\n}) => {};',
                output: '({\n    a,\n    b,\n    c,\n}) => {};\n',
            },
            {
                filename: 'fixture.js',
                input: '(\n    { a, b },\n) => {};',
                output: '(\n    { a, b },\n) => {};\n',
            },
            {
                filename: 'fixture.js',
                input: '(\n    {\n        a, b, c\n    },\n) => {};',
                output: '(\n    {\n        a,\n        b,\n        c,\n    },\n) => {};\n',
            },
            {
                filename: 'fixture.js',
                input: 'new A(\n    {\n        a: 1,\n        b: 2\n    },\n);',
                output: 'new A(\n    {\n        a: 1,\n        b: 2,\n    },\n);\n',
            },
            {
                filename: 'fixture.js',
                input: 'function fn(\n    value,\n) {}',
                output: 'function fn(\n    value,\n) {}\n',
            },
        ])(
            'should converge to the expected layout in $filename: $input',
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

describe('test-call layout', () => {
    const config: Linter.Config = {
        ...ruleConfig,
        rules: {
            [ruleId]: [
                'error',
                { compactTestCalls: true },
            ],
        },
    };

    const testCalls = [
        'describe',
        'describe.concurrent',
        'it',
        'it.concurrent',
    ];

    it('should use the option rather than the filename to select test-call layout', ({ expect }) => {
        const input = 'it(\'case\', () => {\n    work();\n});';
        const disabledConfig: Linter.Config = {
            ...ruleConfig,
            rules: {
                [ruleId]: [
                    'error',
                    { compactTestCalls: false },
                ],
            },
        };

        const messages = new Linter().verify(input, disabledConfig, { filename: 'fixture.test.js' });
        expect(messages.map((message) => message.messageId)).toEqual(['newline']);
    });

    it.for(testCalls)(
        'should preserve compact %s calls with compaction enabled',
        (callee, { expect }) => {
            const input = `${callee}('case', () => {\n    work();\n});`;
            const result = new Linter().verifyAndFix(input, config);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it.for(testCalls)(
        'should compact %s calls with compaction enabled',
        (callee, { expect }) => {
            const input = `${callee}(\n    'case',\n    () => {\n        work();\n    }\n);`;
            const output = `${callee}('case', () => {\n        work();\n    });`;
            const linter = new Linter();
            const messages = linter.verify(input, config);
            expect(messages.map((message) => message.messageId)).toEqual(['compactTestCall']);
            const result = linter.verifyAndFix(input, config);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, config).fixed).toBe(false);
        },
    );

    it.for([
        [
            'it(\n    \'case\', () => {\n    work();\n});',
            'it(\'case\', () => {\n    work();\n});',
        ],
        [
            'it(\'case\',\n    () => {\n    work();\n});',
            'it(\'case\', () => {\n    work();\n});',
        ],
        [
            'it(\'case\', () => {\n    work();\n}\n);',
            'it(\'case\', () => {\n    work();\n});',
        ],
        [
            'it(\n    \'case\',\n    () => {\n    work();\n    },\n    1000\n);',
            'it(\'case\', () => {\n    work();\n    }, 1000);',
        ],
        [
            'it(\n    `first\nsecond`,\n    () => {\n    // keep body comment\n    work();\n    }\n);',
            'it(`first\nsecond`, () => {\n    // keep body comment\n    work();\n    });',
        ],
    ] as const)(
        'should compact only outer argument gaps: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            const result = linter.verifyAndFix(input, config);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, config).fixed).toBe(false);
        },
    );

    it.for([
        'it(\n    // keep name comment\n    \'case\',\n    () => { work(); }\n);',
        'it(\n    \'case\',\n    // keep callback comment\n    () => { work(); }\n);',
        'it(\n    \'case\',\n    () => { work(); } // keep closing comment\n);',
    ])(
        'should preserve argument boundary comments: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, config);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it.for([
        'it.only',
        'describe.skip',
        'suite.it',
        'it.concurrent.each',
        'it[\'concurrent\']',
    ])(
        'should retain ordinary layout checks for other callees: %s',
        (callee, { expect }) => {
            const input = `${callee}('case', () => {\n    work();\n});`;
            const messages = new Linter().verify(input, config);
            expect(messages.map((message) => message.ruleId)).toEqual([ruleId]);
        },
    );

    it('should still check callbacks and calls inside a compact test call', ({ expect }) => {
        const input = 'it.concurrent(\'case\', (a, {\n    b\n}) => { fn(1,\n    2); });';
        const output = 'it.concurrent(\'case\', (\na, {\n    b\n}) => { fn(\n1,\n    2); });';
        const linter = new Linter();
        expect(linter.verify(input, config).map((message) => message.ruleId)).toEqual([
            ruleId,
            ruleId,
        ]);

        const result = linter.verifyAndFix(input, config);
        expect(result.messages).toEqual([]);
        expect(result.output).toBe(output);
        expect(linter.verifyAndFix(result.output, config).fixed).toBe(false);
    });

    describe('formatter integration', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
                await antfu({ typescript: true }, createBaseConfigs()),
                (id) => id.startsWith('style/')
                  || id === 'antfu/consistent-list-newline'
                  || id === ruleId,
            );
        });

        it.for([
            {
                callee: 'it',
                filename: 'fixture.test.js',
            },
            {
                callee: 'describe',
                filename: 'fixture.spec.jsx',
            },
            {
                callee: 'it.concurrent',
                filename: 'fixture.test.mts',
            },
            {
                callee: 'describe.concurrent',
                filename: '__tests__/fixture.cts',
            },
            {
                callee: 'it',
                filename: 'fixture.bench.tsx',
            },
        ])(
            'should converge for $callee in $filename',
            ({ callee, filename }, { expect }) => {
                const input = `${callee}(\n    'case',\n    () => {\n        work();\n    },\n);\n`;
                const output = `${callee}('case', () => {\n    work();\n});\n`;
                const linter = new Linter();
                const options = { filename };
                const result = linter.verifyAndFix(input, configs, options);
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(output);
                expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
            },
        );

        it('should compact nested suites and tests while formatting their bodies', ({ expect }) => {
            const input = 'describe(\n    \'suite\',\n    () => {\n'
              + '        it(\n            \'case\',\n            () => {\n'
              + '                work();\n            },\n        );\n    },\n);\n';

            const output = 'describe(\'suite\', () => {\n    it(\'case\', () => {\n        work();\n    });\n});\n';
            const linter = new Linter();
            const options = { filename: 'fixture.test.ts' };
            const result = linter.verifyAndFix(input, configs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
        });

        it('should preserve a commented multiline call without circular fixes', ({ expect }) => {
            const input = 'it(\n    // keep name comment\n    \'case\',\n    () => {\n        work();\n    },\n);\n';
            const linter = new Linter();
            const options = { filename: 'fixture.test.js' };
            const result = linter.verifyAndFix(input, configs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
        });
    });
});

describe('consistent-parameter-layout in Vue', () => {
    let formatConfigs: TypedFlatConfigItem[];
    let ruleConfigs: TypedFlatConfigItem[];

    beforeAll(async () => {
        const configs = await antfu(
            {
                typescript: true,
                vue: true,
            },
            createVueConfig(),
        );

        formatConfigs = createSyntaxConfigs(
            configs,
            (id) => id.startsWith('style/')
              || id === 'vue/html-indent'
              || id === 'antfu/consistent-list-newline'
              || id === ruleId,
        );

        ruleConfigs = createSyntaxConfigs(configs, (id) => id === ruleId);
    });

    const expressions = [
        'fn(1, {\n    key: 2\n}, 3, 4)',
        'new A(1, {\n    key: 2\n})',
        '({\n    a, b\n}, c) => fn(a, c)',
        'fn(\n    1, {\n        key: 2\n}, 3, 4)',
        'fn(1, /* reason */ {\n    key: 2\n}, 3)',
        'fn(1, {\n    key: 2\n}, // reason\n3)',
        'fn((1), ({\n    key: 2\n}), 3)',
    ];

    it.for([
        ...expressions.map((expression) => `<template>\n    <div :value="${expression}" />\n</template>\n`),
        '<template>\n    <button @click="fn(1, {\n    key: 2\n})" />\n</template>\n',
        '<template>\n    {{ fn(1, {\n    key: 2\n}) }}\n</template>\n',
    ])(
        'should format template expressions without circular fixes: %s',
        (input, { expect }) => {
            const linter = new Linter();
            const options = { filename: 'fixture.vue' };
            expect(linter.verify(input, ruleConfigs, options)).toContainEqual(expect.objectContaining({ ruleId }));
            const result = linter.verifyAndFix(input, formatConfigs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toMatch(/\(\n/);
            expect(result.output).toMatch(/\n\s*\)/);
            expect(result.output).not.toContain(', 3');
            expect(result.output).not.toContain(', 4');
            if (input.includes('reason')) expect(result.output).toContain('reason');
            expect(linter.verifyAndFix(result.output, formatConfigs, options).fixed).toBe(false);
        },
    );

    it.for([
        '<template>\n    <div :value="fn(\n    { key: 2 },\n)" />\n</template>\n',
        '<template>\n    <div :value="fn(\n    // reason\n    value,\n)" />\n</template>\n',
    ])(
        'should preserve valid single-parameter boundaries and comments: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfigs, { filename: 'fixture.vue' });
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it.for([
        'script',
        'script setup',
        'script lang="ts"',
        'script setup lang="ts"',
    ])(
        'should format parameters in <%s>',
        (tag, { expect }) => {
            const input = `<${tag}>\nfn(1, {\n    key: 2\n});\n</script>\n`;
            const linter = new Linter();
            const options = { filename: 'fixture.vue' };
            const result = linter.verifyAndFix(input, formatConfigs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toContain('fn(\n');
            expect(linter.verifyAndFix(result.output, formatConfigs, options).fixed).toBe(false);
        },
    );
});
