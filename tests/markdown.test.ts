import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';
import { createStyleFilesConfigs } from '../src/style';
import { createVueConfig } from '../src/vue';

describe('markdown linting', () => {
    let configs: TypedFlatConfigItem[];

    beforeAll(async () => {
        configs = await antfu(
            {
                typescript: true,
                vue: true,
            },
            createBaseConfigs(),
            createVueConfig(),
            createStyleFilesConfigs(),
        );
    });

    it.for([
        {
            code: 'const value: =',
            language: 'ts',
        },
        {
            code: '<template><div></template>',
            language: 'vue',
        },
        {
            code: '.example {',
            language: 'css',
        },
    ])(
        'should ignore $language code blocks without reporting or fixing them',
        ({ code, language }, { expect }) => {
            const input = `# Example\n\n\`\`\`${language}\n${code}\n\`\`\`\n`;
            const result = new Linter().verifyAndFix(input, configs, { filename: 'README.md' });

            expect(result.messages).toEqual([]);
            expect(result.output).toBe(input);
            expect(result.fixed).toBe(false);
        },
    );

    it('should still report Markdown content problems', ({ expect }) => {
        const messages = new Linter().verify('# Example\n\n### Skipped level\n', configs, { filename: 'README.md' });

        expect(messages.map((message) => message.ruleId)).toEqual(['markdown/heading-increment']);
    });
});
