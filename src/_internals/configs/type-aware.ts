import type { TypedFlatConfigItem } from '@antfu/eslint-config';

export function createTypeAwareConfig(): TypedFlatConfigItem {
    return {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: process.cwd(),
            },
        },
        rules: {
            'kikiutils/no-thenable-zod-refinement': 'error',
            'kikiutils/promise-function-async': 'error',
            // The typed replacements below report these more accurately.
            'no-implied-eval': 'off',
            'no-throw-literal': 'off',
            'prefer-promise-reject-errors': 'off',
            'ts/await-thenable': 'error',
            'ts/consistent-type-exports': 'error',
            'ts/no-array-delete': 'error',
            'ts/no-base-to-string': 'error',
            'ts/no-deprecated': 'error',
            'ts/no-duplicate-type-constituents': 'error',
            'ts/no-floating-promises': [
                'error',
                {
                    allowForKnownSafePromises: [
                        {
                            from: 'package',
                            name: 'SafePromise',
                            package: '@kikiutils/shared',
                        },
                    ],
                },
            ],
            'ts/no-for-in-array': 'error',
            'ts/no-implied-eval': 'error',
            'ts/no-misused-promises': 'error',
            'ts/no-misused-spread': 'error',
            'ts/no-unnecessary-boolean-literal-compare': 'error',
            'ts/no-unnecessary-template-expression': 'error',
            'ts/no-unnecessary-type-arguments': 'error',
            'ts/no-unnecessary-type-assertion': 'error',
            'ts/only-throw-error': 'error',
            // Matches only-throw-error, which allows `any` and `unknown` by default.
            'ts/prefer-promise-reject-errors': [
                'error',
                {
                    allowThrowingAny: true,
                    allowThrowingUnknown: true,
                },
            ],
            'ts/promise-function-async': 'off',
            'ts/require-await': 'off',
            // Exhaustive-switch fallbacks interpolate the `never` value into their error message.
            'ts/restrict-template-expressions': [
                'error',
                { allowNever: true },
            ],
            'ts/return-await': [
                'error',
                'always',
            ],
            'ts/switch-exhaustiveness-check': [
                'error',
                { considerDefaultExhaustiveForUnions: true },
            ],
        },
    };
}
