import { fileURLToPath } from 'node:url';

import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
    vi,
} from 'vitest';

import { noComposableInHeadGetter } from '../src/_internals/rules/no-composable-in-head-getter';
import { createBaseConfigs } from '../src/base';
import { createNuxtConfigs } from '../src/nuxt';
import { createVueConfig } from '../src/vue';

import {
    createSyntaxConfigs,
    filterRules,
} from './utils';

const ruleId = 'kikiutils/no-composable-in-head-getter';
const ruleConfig = {
    plugins: { kikiutils: { rules: { 'no-composable-in-head-getter': noComposableInHeadGetter } } },
    rules: { [ruleId]: 'error' as const },
};

describe('no-composable-in-head-getter', () => {
    it.for([
        'useSeoMeta({ title: () => useI18n().t(\'title\') });',
        'useHead(() => ({ title: useRoute().meta.title }));',
        'useHead({ meta: [{ content: () => { return useRuntimeConfig().public.name; } }] });',
        'useServerSeoMeta({ description: function () { return useState(\'description\').value; } });',
    ])(
        'should report a composable called inside a head getter: %s',
        (input, { expect }) => {
            const messages = new Linter().verify(input, ruleConfig);
            expect(messages.map((message) => message.ruleId)).toEqual([ruleId]);
        },
    );

    it.for([
        'const { t } = useI18n(); useSeoMeta({ title: () => t(\'title\') });',
        'const route = useRoute(); useHead({ title: () => route.meta.title });',
        'useHead({ title: useRoute().meta.title });',
        'watch(() => useRoute().path, refresh);',
    ])(
        'should allow composables called in setup: %s',
        (input, { expect }) => {
            expect(new Linter().verify(input, ruleConfig)).toEqual([]);
        },
    );

    describe('nuxt config', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            configs = createSyntaxConfigs(
                await antfu(
                    {
                        typescript: true,
                        vue: true,
                    },
                    createBaseConfigs(),
                    createVueConfig(),
                    ...createNuxtConfigs(),
                ),
                (id) => id === ruleId || id === 'no-restricted-imports' || id === 'no-restricted-syntax',
            );
        });

        it.for([
            [
                'await navigateTo(\'/login\');',
                'no-restricted-syntax',
            ],
            [
                'useSeoMeta({ title: () => useI18n().t(\'title\') });',
                ruleId,
            ],
            [
                'if (error instanceof AxiosError) handle();',
                'no-restricted-syntax',
            ],
        ] as const)(
            'should report %s in a Vue setup block',
            ([code, expected], { expect }) => {
                const input = `<script setup lang="ts">\n${code}\n</script>\n`;
                const messages = new Linter().verify(input, configs, { filename: 'fixture.vue' });
                expect(messages.map((message) => message.ruleId)).toEqual([expected]);
            },
        );

        it('should allow navigateTo outside the setup top level', ({ expect }) => {
            const input = '<script setup lang="ts">\nasync function logout() {\n    await navigateTo(\'/login\');\n}\n</script>\n';
            expect(new Linter().verify(input, configs, { filename: 'fixture.vue' })).toEqual([]);
        });

        it.for([
            [
                'useHead({ htmlAttrs: { lang: \'en\' } });',
                ['no-restricted-syntax'],
            ],
            [
                'await navigateTo(\'/login\');',
                ['no-restricted-syntax'],
            ],
            [
                'useHead({ htmlAttrs: { class: \'dark\' } });',
                [],
            ],
        ] as const)(
            'should keep every restriction and forbid html lang in pages: %s',
            ([code, expected], { expect }) => {
                const input = `<script setup lang="ts">\n${code}\n</script>\n`;
                const messages = new Linter().verify(input, configs, { filename: 'app/pages/index.vue' });
                expect(messages.map((message) => message.ruleId)).toEqual(expected);
            },
        );

        it('should allow html lang outside pages', ({ expect }) => {
            const input = 'useHead({ htmlAttrs: { lang: () => locale.value } });';
            const filename = 'layers/i18n/app/plugins/locale-head.ts';
            expect(new Linter().verify(input, configs, { filename })).toEqual([]);
        });

        it('should allow handwritten Open Graph meta without the SEO modules', ({ expect }) => {
            const input = 'useSeoMeta({ ogTitle: \'Title\', title: \'Title\' });';
            expect(new Linter().verify(input, configs, { filename: 'fixture.ts' })).toEqual([]);
        });

        it.for([
            [
                'import { defineEventHandler, getQuery } from \'h3\';',
                [
                    'no-restricted-imports',
                    'no-restricted-imports',
                ],
            ],
            [
                'import { useRuntimeConfig } from \'nitropack/runtime\';',
                ['no-restricted-imports'],
            ],
            [
                'import { x } from \'pkg/_internals/x\';',
                ['no-restricted-imports'],
            ],
            [
                'import { readMultipartFormData } from \'h3\';',
                [],
            ],
            [
                'import { defineEventHandler, getQuery } from \'nuxt/server\';',
                [],
            ],
        ] as const)(
            'should require nuxt/server for the helpers it provides in server code: %s',
            ([code, expected], { expect }) => {
                const input = `${code}\nexport default 1;\n`;
                const messages = new Linter().verify(input, configs, { filename: 'server/api/items.get.ts' });
                expect(messages.map((message) => message.ruleId)).toEqual(expected);
            },
        );

        it('should keep the test-scope import restrictions in server test files', ({ expect }) => {
            const input = 'import { expect } from \'vitest\';\nexpect(1);\n';
            const messages = new Linter().verify(input, configs, { filename: 'server/utils/items.test.ts' });
            expect(messages.map((message) => message.ruleId)).toEqual(['no-restricted-imports']);
        });
    });

    describe('nuxt config with the SEO modules', () => {
        let configs: TypedFlatConfigItem[];

        beforeAll(async () => {
            const cwd = vi.spyOn(process, 'cwd').mockReturnValue(fileURLToPath(new URL('./fixtures/nuxt-seo', import.meta.url)));
            try {
                configs = filterRules(createNuxtConfigs(), (id) => id === 'no-restricted-syntax');
            } finally {
                cwd.mockRestore();
            }
        });

        it.for([
            'useSeoMeta({ ogTitle: \'Title\' });',
            'useServerSeoMeta({ twitterCard: \'summary\' });',
        ])(
            'should report inferred meta written by hand: %s',
            (input, { expect }) => {
                const messages = new Linter().verify(input, configs, { filename: 'fixture.js' });
                expect(messages.map((message) => message.ruleId)).toEqual(['no-restricted-syntax']);
            },
        );

        it('should allow the title, description, and image', ({ expect }) => {
            const input = 'useSeoMeta({ description: \'Description\', ogImage: \'/og.png\', title: \'Title\' });';
            expect(new Linter().verify(input, configs, { filename: 'fixture.js' })).toEqual([]);
        });
    });
});
