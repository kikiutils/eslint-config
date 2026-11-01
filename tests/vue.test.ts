import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createVueConfig } from '../src/vue';

import { filterRules } from './utils';

describe.concurrent('vue config factory', () => {
    it('should apply the registered parameter layout rule to both script and template', async ({ expect }) => {
        const configs = await antfu(
            {
                typescript: true,
                vue: true,
            },
            createVueConfig(),
        );

        const formatConfigs = filterRules(
            configs,
            (ruleId) => ruleId.startsWith('style/')
              || ruleId === 'vue/html-indent'
              || ruleId === 'antfu/consistent-list-newline'
              || ruleId === 'kikiutils/consistent-parameter-layout',
        );

        const linter = new Linter();
        const options = { filename: 'fixture.vue' };
        // eslint-disable-next-line style/max-len
        const combinedInput = '<script setup lang="ts">\nfn(1, {\n    key: 2\n});\n</script>\n<template>\n    <div :value="fn(1, {\n    key: 2 as number\n})" />\n</template>\n';
        const combinedResult = linter.verifyAndFix(combinedInput, formatConfigs, options);
        expect(combinedResult.messages).toEqual([]);
        expect(combinedResult.output.match(/fn\(\n/g)).toHaveLength(2);
        expect(linter.verifyAndFix(combinedResult.output, formatConfigs, options).fixed).toBe(false);
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
