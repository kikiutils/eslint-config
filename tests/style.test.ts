import {
    describe,
    it,
} from 'vitest';

import { createStyleFilesConfigs } from '../src/style';

describe.concurrent('style file config factory', () => {
    it('creates prettier-backed configs for css, sass, and scss files', ({ expect }) => {
        const configs = createStyleFilesConfigs();

        expect(configs).toHaveLength(3);
        expect(configs.map((config) => config.files)).toStrictEqual([
            ['**/*.css'],
            ['**/*.sass'],
            ['**/*.scss'],
        ]);

        expect(configs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    rules: {
                        'format/prettier': [
                            'error',
                            {
                                parser: 'css',
                                printWidth: 120,
                                singleQuote: true,
                                tabWidth: 4,
                            },
                        ],
                    },
                }),
                expect.objectContaining({
                    rules: {
                        'format/prettier': [
                            'error',
                            expect.objectContaining({ parser: 'sass' }),
                        ],
                    },
                }),
                expect.objectContaining({
                    rules: {
                        'format/prettier': [
                            'error',
                            expect.objectContaining({ parser: 'scss' }),
                        ],
                    },
                }),
            ]),
        );

        configs.forEach((config) => {
            expect(config.languageOptions).toHaveProperty('parser');
            expect(config.plugins).toHaveProperty('format');
        });
    });
});
