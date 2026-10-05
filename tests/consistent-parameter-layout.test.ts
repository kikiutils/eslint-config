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
    plugins: { kikiutils: { rules: { 'consistent-parameter-layout': consistentParameterLayout } } },
    rules: { [ruleName]: 'error' as const },
};

describe('consistent-parameter-layout', () => {
    it.for([
        '({ a, b }) => {};',
        '({\n    a, b, c\n}) => {};',
        'a({\n    a: 1,\n    b: 2\n});',
        'new A({\n    a: 1,\n    b: 2\n});',
    ])(
        'should preserve compact single-parameter parentheses: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.output).toBe(input);
            expect(result.messages).toEqual([]);
        },
    );

    it.for([
        [
            '(\n    { a, b }) => {};',
            '({ a, b }) => {};',
        ],
        [
            '(\n    { a, b },\n) => {};',
            '({ a, b }) => {};',
        ],
        [
            'a(\n    {\n        a: 1\n    },\n);',
            'a({\n        a: 1\n    });',
        ],
        [
            'new A(\n    {\n        a: 1\n    },\n);',
            'new A({\n        a: 1\n    });',
        ],
        [
            'a(\n    ({\n        a: 1\n    }),\n);',
            'a(({\n        a: 1\n    }));',
        ],
        [
            'function fn(\n    a,\n) {}',
            'function fn(a) {}',
        ],
    ])(
        'should collapse only the outer single-parameter whitespace: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            const result = linter.verifyAndFix(input!, ruleConfig);
            expect(result.output).toBe(output);
            expect(result.messages).toEqual([]);
            expect(linter.verifyAndFix(result.output, ruleConfig).fixed).toBe(false);
        },
    );

    it.for([
        'a(\n    // keep this reason\n    value,\n);',
        'a(\n    value, // keep this reason\n);',
        'a(/* keep this reason */ value\n);',
        'function fn(\n    // keep this reason\n    value\n) {}',
    ])(
        'should leave single-parameter comment boundaries unchanged: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
            expect(result.messages).toEqual([]);
        },
    );

    it.for([
        'foo(x => bar(\n    a,\n    b,\n));',
        'foo((x => bar(\n    a,\n    b,\n)));',
        'foo(async x => bar(\n    a,\n    b,\n));',
    ])(
        'should not borrow parentheses for an unparenthesized arrow: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.output).toBe(input);
            expect(result.messages).toEqual([]);
        },
    );

    it.for([
        'import { it } from \'vitest\'; it',
        'import { describe } from \'vitest\'; describe.concurrent',
        'import * as runner from \'bun:test\'; runner.test',
        'import { test as spec } from \'@jest/globals\'; spec.each([1])',
        'ordinary.unknown',
    ])(
        'should use the same layout for every call site: %s',
        (prefix, { expect }) => {
            const input = `${prefix}('case', () => {\n    work();\n});`;
            const output = `${prefix}(\n'case', () => {\n    work();\n});`;
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.output).toBe(output);
            expect(result.messages).toEqual([]);
        },
    );

    it.for([
        'a(1, 2, 3);',
        'new ClassA(1, 2, 3);',
        '(a, b, c) => {};',
        'function fn(a, b) {\n    return a;\n}',
        'a(() => { work(); });',
        'a(\n    1, {\n        key: 2\n    }\n);',
        '() => {\n    work();\n};',
    ])(
        'should preserve an already valid list: %s',
        (input, { expect }) => {
            const result = new Linter().verifyAndFix(input, ruleConfig);
            expect(result.output).toBe(input);
            expect(result.messages).toEqual([]);
        },
    );

    it.for([
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
    ])(
        'should seed only the first newline: %s',
        ([input, output], { expect }) => {
            const linter = new Linter();
            expect(linter.verify(input!, ruleConfig).map((message) => message.ruleId)).toEqual([ruleName]);
            const result = linter.verifyAndFix(input!, ruleConfig);
            expect(result.output).toBe(output);
            expect(result.messages).toEqual([]);
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

    it.for([
        'render(<div>\n    text\n</div>);',
        'render(\n    <div>\n        text\n    </div>,\n);',
        'render(\n    <>\n        text\n    </>,\n);',
        'new A(\n    <div>\n        text\n    </div>,\n);',
    ])(
        'should leave single JSX arguments to JSX formatting rules: %s',
        (input, { expect }) => {
            const config = {
                ...ruleConfig,
                languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
            };

            const result = new Linter().verifyAndFix(input, config);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
            expect(result.messages).toEqual([]);
        },
    );

    it(
        'should converge with the existing formatters for JS and TS',
        async ({ expect }) => {
            const configs = await antfu({ typescript: true }, createBaseConfigs());
            const formatConfigs = configs.map((config) => ({
                ...config,
                rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([name]) =>
                    name.startsWith('style/')
                    || name === 'antfu/consistent-list-newline'
                    || name === ruleName)),
            }));

            const linter = new Linter();
            const inputs = [
                {
                    code: 'a(1, 2, () => {\n    work();\n});',
                    filename: 'fixture.js',
                },
                {
                    code: 'new ClassA(\'value\', {\n    cause: \'\'\n});',
                    filename: 'fixture.js',
                },
                {
                    code: '({ a }, {\n    b, c\n}) => {};',
                    filename: 'fixture.js',
                },
                {
                    code: 'a<{ fn: () => void }>(1, {\n    key: 2\n});',
                    filename: 'fixture.ts',
                },
                {
                    code: 'new ClassA<{ fn: () => void }>(1, {\n    key: 2\n});',
                    filename: 'fixture.ts',
                },
                {
                    code: '(a: {\n    key: number\n}, b: number) => {};',
                    filename: 'fixture.ts',
                },
                {
                    code: 'a(({\n    key: 2\n}), 3);',
                    filename: 'fixture.js',
                },
                {
                    code: 'function fn({\n    a, b, c\n}, d) {}',
                    filename: 'fixture.js',
                },
            ];

            for (const { code, filename } of inputs) {
                const result = linter.verifyAndFix(code, formatConfigs, { filename });
                expect(result.messages).toEqual([]);
                expect(result.output).toMatch(/\(\n/);
                expect(result.output).toMatch(/\n\)/);
                expect(linter.verifyAndFix(result.output, formatConfigs, { filename }).fixed).toBe(false);
            }

            const edgeInputs = [
                {
                    code: 'render(<div>\n    text\n</div>);',
                    filename: 'fixture.tsx',
                },
                {
                    code: 'render(<div>{fn(1, {\n    key: 2\n})}</div>);',
                    filename: 'fixture.tsx',
                },
                {
                    code: 'function fn(\n    // rationale\n    value\n) {}',
                    filename: 'fixture.js',
                },
                {
                    code: 'fn(\n    // rationale\n    value,\n    1,2,3,4\n);',
                    filename: 'fixture.js',
                },
                {
                    code: 'foo(x => bar(\n    a,\n    b,\n));',
                    filename: 'fixture.js',
                },
                {
                    code: '(a)<{ fn: () => void }>({\n    key: 2\n});',
                    filename: 'fixture.ts',
                },
                {
                    code: 'new (A)<{ fn: () => void }>({\n    key: 2\n});',
                    filename: 'fixture.ts',
                },
            ];

            for (const { code, filename } of edgeInputs) {
                const result = linter.verifyAndFix(code, formatConfigs, { filename });
                expect(result.messages).toEqual([]);
                expect(linter.verifyAndFix(result.output, formatConfigs, { filename }).fixed).toBe(false);
            }

            const jsxInputs = [
                {
                    code: 'render(<div>\n    text\n</div>);',
                    output: 'render(\n    <div>\n        text\n    </div>,\n);\n',
                },
                {
                    code: 'render(<>\n    text\n</>);',
                    output: 'render(\n    <>\n        text\n    </>,\n);\n',
                },
                {
                    code: 'render(<Component />);',
                    output: 'render(<Component />);\n',
                },
                {
                    code: 'a(\n    {\n        a: 1,\n        b: 2\n    },\n);',
                    output: 'a({\n    a: 1,\n    b: 2,\n});\n',
                },
            ];

            for (const { code, output } of jsxInputs) {
                const options = { filename: 'fixture.tsx' };
                const result = linter.verifyAndFix(code, formatConfigs, options);
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(output);
                expect(linter.verifyAndFix(result.output, formatConfigs, options).fixed).toBe(false);
            }

            const singleInputs = [
                {
                    code: '(\n    { a, b },\n) => {};',
                    output: '({ a, b }) => {};\n',
                },
                {
                    code: '(\n    {\n        a, b, c\n    },\n) => {};',
                    output: '({\n    a,\n    b,\n    c,\n}) => {};\n',
                },
                {
                    code: 'a(\n    {\n        a: 1,\n        b: 2\n    },\n);',
                    output: 'a({\n    a: 1,\n    b: 2,\n});\n',
                },
                {
                    code: 'new A(\n    {\n        a: 1,\n        b: 2\n    },\n);',
                    output: 'new A({\n    a: 1,\n    b: 2,\n});\n',
                },
                {
                    code: 'function fn(\n    value,\n) {}',
                    output: 'function fn(value) {}\n',
                },
            ];

            for (const { code, output } of singleInputs) {
                const options = { filename: 'fixture.js' };
                const result = linter.verifyAndFix(code, formatConfigs, options);
                expect(result.messages).toEqual([]);
                expect(result.output).toBe(output);
                expect(linter.verifyAndFix(result.output, formatConfigs, options).fixed).toBe(false);
            }
        },
    );
});
