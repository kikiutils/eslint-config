import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import typefest from 'eslint-plugin-typefest';

export function createTypefestConfig(): TypedFlatConfigItem {
    return {
        plugins: { typefest },
        rules: {
            'typefest/prefer-ts-extras-is-present-filter': 'error',
            'typefest/prefer-ts-extras-object-entries': 'error',
            'typefest/prefer-ts-extras-object-has-own': 'error',
            'typefest/prefer-ts-extras-object-keys': 'error',
            'typefest/prefer-ts-extras-object-values': 'error',
            'typefest/prefer-type-fest-array-values': 'error',
            'typefest/prefer-type-fest-arrayable': 'error',
            'typefest/prefer-type-fest-unknown-record': 'error',
            'typefest/prefer-type-fest-value-of': 'error',
        },
    };
}
