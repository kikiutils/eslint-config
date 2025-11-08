import type { TypedFlatConfigItem } from '@antfu/eslint-config';
// @ts-expect-error No declare file.
import kikiutilsTailwindcss from '@kikiutils/eslint-plugin-tailwindcss';
// @ts-expect-error Ignore this error.
import kikiutilsEslintPluginVue from '@kikiutils/eslint-plugin-vue';
// @ts-expect-error No declare file.
import tailwindcss from 'eslint-plugin-tailwindcss';

export function createVueConfig(): TypedFlatConfigItem {
    return {
        files: ['**/*.vue'],
        plugins: {
            '@kikiutils/tailwindcss': kikiutilsTailwindcss,
            '@kikiutils/vue': kikiutilsEslintPluginVue,
            tailwindcss,
        },
        rules: {
            '@kikiutils/tailwindcss/classnames-order': 'error',
            '@kikiutils/vue/attributes-order': [
                'error',
                { alphabetical: true },
            ],
            '@kikiutils/vue/no-extra-space-in-class': 'error',
            'style/max-len': 'off',
            'tailwindcss/classnames-order': 'off',
            'tailwindcss/enforces-negative-arbitrary-values': 'error',
            'tailwindcss/enforces-shorthand': 'error',
            'tailwindcss/no-unnecessary-arbitrary-value': 'error',
            'vue/attribute-hyphenation': 'error',
            'vue/attributes-order': 'off',
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
