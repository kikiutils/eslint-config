import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import betteTailwindcss from 'eslint-plugin-better-tailwindcss';
// @ts-expect-error No declare file.
import promise from 'eslint-plugin-promise';

import { createBaseRules } from './base';

export function createVueConfig(environment: 'bun' | 'node' = 'node'): TypedFlatConfigItem {
    return {
        files: ['**/*.vue'],
        plugins: {
            'better-tailwindcss': betteTailwindcss,
            promise,
        },
        rules: {
            ...createBaseRules(environment),
            'better-tailwindcss/enforce-consistent-class-order': 'error',
            'better-tailwindcss/enforce-consistent-important-position': 'error',
            'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
            'better-tailwindcss/enforce-consistent-variant-order': 'error',
            'better-tailwindcss/enforce-shorthand-classes': 'error',
            'better-tailwindcss/no-deprecated-classes': 'warn',
            'better-tailwindcss/no-duplicate-classes': 'error',
            'better-tailwindcss/no-unnecessary-whitespace': 'error',
            'style/max-len': 'off',
            'vue/attribute-hyphenation': 'error',
            'vue/attributes-order': 'error',
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
            'vue/component-api-style': 'error',
            'vue/define-emits-declaration': 'error',
            'vue/define-props-declaration': 'error',
            'vue/enforce-style-attribute': 'error',
            'vue/html-closing-bracket-newline': 'error',
            'vue/html-closing-bracket-spacing': 'error',
            'vue/html-indent': [
                'error',
                4,
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    multiline: 1,
                    singleline: 1,
                },
            ],
            'vue/max-len': [
                'warn',
                {
                    code: 120,
                    comments: 120,
                    template: 120,
                },
            ],
            'vue/no-dupe-keys': 'error',
            'vue/no-lone-template': 'error',
            'vue/no-multi-spaces': 'error',
            'vue/no-multiple-objects-in-class': 'error',
            'vue/no-root-v-if': 'error',
            'vue/no-template-target-blank': 'error',
            'vue/no-v-html': 'error',
            'vue/prefer-define-options': 'error',
            'vue/prefer-separate-static-class': 'error',
            'vue/require-explicit-emits': 'error',
            'vue/require-typed-ref': 'error',
        },
    };
}
