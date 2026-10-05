import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';
import { consistentParameterLayout } from '../src/internals/rules/consistent-parameter-layout';

// Constants/Variables
const ruleName = 'kikiutils/consistent-parameter-layout';
const ruleConfig = {
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { kikiutils: { rules: { 'consistent-parameter-layout': consistentParameterLayout } } },
    rules: { [ruleName]: 'error' as const },
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
    ])(
        'should fix only the inconsistent parameter boundaries: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            expect(linter.verify(input!, ruleConfig).map((message) => message.ruleId)).toEqual([ruleName]);
            const result = linter.verifyAndFix(input!, ruleConfig);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, ruleConfig).fixed).toBe(false);
        },
    );

    it(
        'should check nested calls and parameters independently',
        ({ expect }) => {
            // eslint-disable-next-line style/max-len
            const input = 'import { it } from \'vitest\'; it(\'case\', ({\n    expect\n}) => { a(1, {\n    key: 2\n}); });';

            expect(new Linter().verify(input, ruleConfig).map((message) => message.ruleId)).toEqual([
                ruleName,
                ruleName,
            ]);
        },
    );

    it('should preserve multiline single-parameter types and complete their boundaries', async ({ expect }) => {
        const configs = (await antfu({ typescript: true }, createBaseConfigs())).map((config) => ({
            ...config,
            rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([name]) => name === ruleName)),
        }));

        const expanded = '(\n    value: Readonlyable<Array<bigint | null>>\n'
          + '      | { [path: string]: bigint | null }\n'
          + '      | { message?: string; values: Readonlyable<Array<bigint | null>> },\n) => {};';

        const compact = expanded.replace('(\n    value', '(value').replace(',\n)', ')');
        const inputs = [
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
        ];

        const linter = new Linter();
        const options = { filename: 'fixture.ts' };
        for (const { input, output } of inputs) {
            const result = linter.verifyAndFix(input, configs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
        }
    });

    it('should converge to the expected JS, TS, and JSX layouts', async ({ expect }) => {
        const configs = (await antfu({ typescript: true }, createBaseConfigs())).map((config) => ({
            ...config,
            rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([name]) =>
                name.startsWith('style/')
                || name === 'antfu/consistent-list-newline'
                || name === ruleName)),
        }));

        const inputs = [
            {
                filename: 'fixture.js',
                input: 'fn(a,\n    b, c);',
                output: 'fn(\n    a,\n    b,\n    c,\n);\n',
            },
            {
                filename: 'fixture.js',
                // eslint-disable-next-line style/max-len
                input: 'function fn() { return defineScriptAndTemplateVisitors(context.sourceCode, createVisitor, 1, 2, 3, 4, 5, 5, 5,\n    5, 5\n    , 5, 5); }',
                // eslint-disable-next-line style/max-len
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
                // eslint-disable-next-line style/max-len
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
            {
                filename: 'fixture.tsx',
                input: 'a(\n    {\n        a: 1,\n        b: 2\n    },\n);',
                output: 'a(\n    {\n        a: 1,\n        b: 2,\n    },\n);\n',
            },
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
                input: 'a(\n    {\n        a: 1,\n        b: 2\n    },\n);',
                output: 'a(\n    {\n        a: 1,\n        b: 2,\n    },\n);\n',
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
        ];

        const linter = new Linter();
        for (const {
            filename,
            input,
            output,
        } of inputs) {
            const options = { filename };
            const result = linter.verifyAndFix(input, configs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
        }
    });
});

describe('test-call exceptions', () => {
    const config = {
        ...ruleConfig,
        files: ['**/*.{js,jsx,ts,tsx}'],
    };

    it.for([
        'fixture.test.js',
        'fixture.test.jsx',
        'fixture.test.ts',
        'fixture.test.tsx',
    ])(
        'should skip only the test calls themselves in %s',
        (filename, { expect }) => {
            for (const callee of [
                'describe',
                'describe.concurrent',
                'it',
                'it.concurrent',
            ]) {
                const input = `${callee}('case', () => {\n    work();\n});`;
                const result = new Linter().verifyAndFix(input, config, { filename });
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(input);
                expect(result.fixed).toBe(false);
            }
        },
    );

    it.for([
        [
            'fixture.js',
            'it',
        ],
        [
            'fixture.spec.ts',
            'describe.concurrent',
        ],
        [
            'fixture.test.ts.js',
            'it.concurrent',
        ],
        [
            'fixture.test.js',
            'it.only',
        ],
        [
            'fixture.test.js',
            'describe.skip',
        ],
        [
            'fixture.test.js',
            'suite.it',
        ],
        [
            'fixture.test.js',
            'it.concurrent.each',
        ],
        [
            'fixture.test.js',
            'it["concurrent"]',
        ],
    ])(
        'should retain other calls and filenames: %s',
        ([filename, callee], { expect }) => {
            const input = `${callee}('case', () => {\n    work();\n});`;
            const messages = new Linter().verify(input, config, { filename: filename! });
            expect(messages.map((message) => message.ruleId)).toEqual([ruleName]);
        },
    );

    it('should still check callbacks and calls inside an excluded test call', ({ expect }) => {
        const input = 'it.concurrent(\'case\', (a, {\n    b\n}) => { fn(1,\n    2); });';
        const output = 'it.concurrent(\'case\', (\na, {\n    b\n}) => { fn(\n1,\n    2); });';
        const linter = new Linter();
        const options = { filename: 'fixture.test.ts' };
        expect(linter.verify(input, config, options).map((message) => message.ruleId)).toEqual([
            ruleName,
            ruleName,
        ]);

        const result = linter.verifyAndFix(input, config, options);
        expect(result.messages).toEqual([]);
        expect(result.output).toBe(output);
        expect(linter.verifyAndFix(result.output, config, options).fixed).toBe(false);
    });
});
