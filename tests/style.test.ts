import {
    describe,
    it,
} from 'vitest';

import { createStyleFilesConfigs } from '../src/style';

describe.concurrent('style file config factory', () => {
    it('creates configs in css, sass, and scss order', ({ expect }) => {
        const configs = createStyleFilesConfigs();

        expect(configs).toHaveLength(3);
        expect(configs.map((config) => config.files)).toStrictEqual([
            ['**/*.css'],
            ['**/*.sass'],
            ['**/*.scss'],
        ]);
    });

    it.for([
        'css',
        'sass',
        'scss',
    ])(
        'uses the matching prettier parser and shared options for %s files',
        (parser, { expect }) => {
            const config = createStyleFilesConfigs().find((config) => config.files?.includes(`**/*.${parser}`));
            expect(config?.rules).toEqual({
                'format/prettier': [
                    'error',
                    {
                        parser,
                        printWidth: 120,
                        singleQuote: true,
                        tabWidth: 4,
                    },
                ],
            });

            expect(config?.languageOptions).toHaveProperty('parser');
            expect(config?.plugins).toHaveProperty('format');
        },
    );
});
