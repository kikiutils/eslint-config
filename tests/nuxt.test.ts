import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { noComposableInHeadGetter } from '../src/_internals/rules/no-composable-in-head-getter';
import { createBaseConfigs } from '../src/base';
import { createNuxtConfig } from '../src/nuxt';
import { createVueConfig } from '../src/vue';

import { createSyntaxConfigs } from './utils';

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
        'useSeoMeta({ title: () => format(useless) });',
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
                    createNuxtConfig(),
                ),
                (id) => id === ruleId || id === 'no-restricted-syntax',
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
    });
});
