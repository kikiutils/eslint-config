import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createVueConfig } from '../src/vue';

describe.concurrent('vue config factory', () => {
    it('should format Vue script and template expressions without circular fixes', async ({ expect }) => {
        const configs = await antfu(
            {
                typescript: true,
                vue: true,
            },
            createVueConfig(),
        );

        const formatConfigs = configs.map((config) => ({
            ...config,
            rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([name]) =>
                name.startsWith('style/')
                || name === 'vue/html-indent'
                || name === 'antfu/consistent-list-newline'
                || name === 'kikiutils/consistent-parameter-layout')),
        }));

        const ruleId = 'kikiutils/consistent-parameter-layout';
        const ruleConfigs = configs.map((config) => ({
            ...config,
            rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([name]) => name === ruleId)),
        }));

        const linter = new Linter();
        const options = { filename: 'fixture.vue' };
        const expectedMessage = { ruleId };
        const expressions = [
            'fn(1, {\n    key: 2\n}, 3, 4)',
            'new A(1, {\n    key: 2\n})',
            '({\n    a, b\n}, c) => fn(a, c)',
            'fn(\n    1, {\n        key: 2\n}, 3, 4)',
            'fn(1, /* reason */ {\n    key: 2\n}, 3)',
            'fn(1, {\n    key: 2\n}, // reason\n3)',
            'fn((1), ({\n    key: 2\n}), 3)',
        ];

        const inputs = [
            ...expressions.map((expression) => `<template>\n    <div :value="${expression}" />\n</template>\n`),
            '<template>\n    <button @click="fn(1, {\n    key: 2\n})" />\n</template>\n',
            '<template>\n    {{ fn(1, {\n    key: 2\n}) }}\n</template>\n',
        ];

        for (const input of inputs) {
            expect(linter.verify(input, ruleConfigs, options)).toContainEqual(expect.objectContaining(expectedMessage));
            const result = linter.verifyAndFix(input, formatConfigs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toMatch(/\(\n/);
            expect(result.output).toMatch(/\n\s*\)/);
            expect(result.output).not.toContain(', 3');
            expect(result.output).not.toContain(', 4');
            if (input.includes('reason')) expect(result.output).toContain('reason');
            expect(linter.verifyAndFix(result.output, formatConfigs, options).fixed).toBe(false);
        }

        const singleInput = '<template>\n    <div :value="fn(\n    { key: 2 },\n)" />\n</template>\n';
        const singleResult = linter.verifyAndFix(singleInput, ruleConfigs, options);
        expect(singleResult.messages).toEqual([]);
        expect(singleResult.output).toBe(singleInput);
        expect(singleResult.fixed).toBe(false);
        const commentExpression = 'fn(\n    // reason\n    value,\n)';
        const commentInput = `<template>\n    <div :value="${commentExpression}" />\n</template>\n`;
        expect(linter.verifyAndFix(commentInput, ruleConfigs, options).output).toBe(commentInput);

        // eslint-disable-next-line style/max-len
        const combinedInput = '<script setup lang="ts">\nfn(1, {\n    key: 2\n});\n</script>\n<template>\n    <div :value="fn(1, {\n    key: 2 as number\n})" />\n</template>\n';
        const combinedResult = linter.verifyAndFix(combinedInput, formatConfigs, options);
        expect(combinedResult.messages).toEqual([]);
        expect(combinedResult.output.match(/fn\(\n/g)).toHaveLength(2);
        expect(linter.verifyAndFix(combinedResult.output, formatConfigs, options).fixed).toBe(false);

        for (const tag of [
            'script',
            'script setup',
            'script lang="ts"',
            'script setup lang="ts"',
        ]) {
            const input = `<${tag}>\nfn(1, {\n    key: 2\n});\n</script>\n`;
            const result = linter.verifyAndFix(input, formatConfigs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toContain('fn(\n');
            expect(linter.verifyAndFix(result.output, formatConfigs, options).fixed).toBe(false);
        }
    });

    it('creates a vue config with vue, tailwind, and shared promise rules', ({ expect }) => {
        const config = createVueConfig();

        expect(config.files).toStrictEqual(['**/*.vue']);
        expect(config.plugins).toHaveProperty('@kikiutils/vue');
        expect(config.plugins).toHaveProperty('better-tailwindcss');
        expect(config.plugins).toHaveProperty('promise');
        expect(config.plugins).toHaveProperty('kikiutils.rules.consistent-parameter-layout');
        expect((config.plugins?.['@kikiutils/vue'] as { rules?: Record<string, unknown> }).rules)
            .toHaveProperty('class-hex-color-case');

        expect(config.rules).toMatchObject({
            '@kikiutils/vue/attributes-order': [
                'error',
                {
                    alphabetical: true,
                    alphabeticalEnhanced: true,
                },
            ],
            '@kikiutils/vue/class-hex-color-case': 'error',
            'better-tailwindcss/enforce-consistent-class-order': 'error',
            'better-tailwindcss/no-deprecated-classes': 'warn',
            'better-tailwindcss/no-duplicate-classes': 'error',
            'promise/no-return-wrap': 'error',
            'style/max-len': 'off',
            'vue/block-order': [
                'error',
                {
                    order: [
                        'template',
                        'script',
                        'style',
                    ],
                },
            ],
            'vue/html-indent': [
                'error',
                4,
            ],
            'vue/max-len': [
                'warn',
                {
                    code: 120,
                    comments: 120,
                    template: 120,
                },
            ],
            'vue/require-typed-ref': 'error',
        });
    });

    it('forwards the requested runtime environment to inherited import sorting rules', ({ expect }) => {
        const config = createVueConfig('bun');

        expect(config.rules?.['perfectionist/sort-imports']).toMatchObject([
            'error',
            { environment: 'bun' },
        ]);
    });
});
