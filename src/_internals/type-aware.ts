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
            'ts/await-thenable': 'error',
            'ts/no-base-to-string': 'error',
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
            'ts/no-misused-promises': 'error',
            'ts/no-misused-spread': 'error',
            'ts/no-unnecessary-type-assertion': 'error',
            'ts/promise-function-async': 'error',
            'ts/require-await': 'off',
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
