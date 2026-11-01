import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createStyleFilesConfigs } from '../src/style';

describe.concurrent('style file config factory', () => {
    it('creates configs only for the supported css and scss parsers', ({ expect }) => {
        const configs = createStyleFilesConfigs();

        expect(configs).toHaveLength(2);
        expect(configs.map((config) => config.files)).toStrictEqual([
            ['**/*.css'],
            ['**/*.scss'],
        ]);
    });

    it.for([
        {
            input: '.example{color:red}',
            output: '.example {\n    color: red;\n}\n',
            parser: 'css',
        },
        {
            input: '$color:red;.example{color:$color}',
            output: '$color: red;\n.example {\n    color: $color;\n}\n',
            parser: 'scss',
        },
    ])(
        'uses the matching prettier parser and shared options to format $parser files',
        (
            {
                input,
                output,
                parser,
            },
            { expect },
        ) => {
            const configs = createStyleFilesConfigs();
            const config = configs.find((config) => config.files?.includes(`**/*.${parser}`));
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

            const linter = new Linter();
            const options = { filename: `fixture.${parser}` };
            const result = linter.verifyAndFix(input, configs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
        },
    );
});
