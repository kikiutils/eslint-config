import {
    describe,
    it,
} from 'vitest';

import { createVueConfig } from '../src/vue';

describe.concurrent('vue config factory', () => {
    it('creates a vue config with vue, tailwind, and shared promise rules', ({ expect }) => {
        const config = createVueConfig();

        expect(config.files).toStrictEqual(['**/*.vue']);
        expect(config.plugins).toHaveProperty('@kikiutils/vue');
        expect(config.plugins).toHaveProperty('better-tailwindcss');
        expect(config.plugins).toHaveProperty('promise');
        expect(config.rules).toMatchObject({
            '@kikiutils/vue/attributes-order': [
                'error',
                {
                    alphabetical: true,
                    alphabeticalEnhanced: true,
                },
            ],
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
