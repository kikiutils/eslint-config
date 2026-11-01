import { Linter } from 'eslint';
import {
    describe,
    it,
} from 'vitest';

import { createStyleFilesConfigs } from '../src/style';

describe.concurrent('style file config factory', () => {
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
        'should use the matching prettier parser and shared options to format $parser files',
        (
            {
                input,
                output,
                parser,
            },
            { expect },
        ) => {
            const configs = createStyleFilesConfigs();
            const linter = new Linter();
            const options = { filename: `fixture.${parser}` };
            const result = linter.verifyAndFix(input, configs, options);
            expect(result.messages).toEqual([]);
            expect(result.output).toBe(output);
            expect(linter.verifyAndFix(result.output, configs, options).fixed).toBe(false);
        },
    );
});
