import type { TypedFlatConfigItem } from '@antfu/eslint-config';

export function createVsCodeJsonConfigs(): TypedFlatConfigItem[] {
    return [
        {
            files: ['**/.vscode/*.json'],
            rules: {
                'jsonc/sort-array-values': [
                    'error',
                    {
                        order: {
                            natural: true,
                            type: 'asc',
                        },
                        pathPattern: '^.*$',
                    },
                ],
                'jsonc/sort-keys': [
                    'error',
                    'asc',
                    {
                        caseSensitive: true,
                        natural: true,
                    },
                ],
            },
        },
    ];
}
