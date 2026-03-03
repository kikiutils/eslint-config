import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import format from 'eslint-plugin-format';

function createPrettierCssConfig(parser: 'css' | 'sass' | 'scss'): TypedFlatConfigItem {
    return {
        files: [`**/*.${parser}`],
        languageOptions: { parser: format.parserPlain },
        plugins: { format },
        rules: {
            'format/prettier': [
                'error',
                {
                    parser,
                    printWidth: 120,
                    singleQuote: true,
                    tabWidth: 4,
                },
            ],
        },
    };
}

export function createStyleFilesConfigs(): TypedFlatConfigItem[] {
    return [
        createPrettierCssConfig('css'),
        createPrettierCssConfig('sass'),
        createPrettierCssConfig('scss'),
    ];
}
