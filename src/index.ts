import antfu from '@antfu/eslint-config';
import type { ConfigNames, TypedFlatConfigItem } from '@antfu/eslint-config';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';
// @ts-expect-error No Type Definition File.
import sortKeysPlus from 'eslint-plugin-sort-keys-plus';

export function createConfig(environment: 'bun' | 'node' = 'node', options?: Parameters<typeof antfu>[0]): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	return antfu(
		{ typescript: true, ...options },
		{
			files: ['**/*.{cjs,js,mjs,ts}'],
			plugins: { 'sort-keys-plus': sortKeysPlus },
			rules: {
				'antfu/curly': 'off',
				'antfu/if-newline': 'off',
				'curly': ['error', 'multi-line'],
				'max-classes-per-file': ['error', 1],
				'perfectionist/sort-imports': [
					'error',
					{
						environment,
						groups: [
							['builtin', 'external'],
							'internal',
							'parent',
							'sibling',
						],
						ignoreCase: false,
						internalPattern: ['@/**', '~/**'],
					},
				],
				'sort-keys-plus/sort-keys': ['error', 'asc', { caseSensitive: true, natural: false }],
				'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
				'style/indent': ['error', 'tab'],
				'style/no-tabs': 'off',
				'style/padding-line-between-statements': [
					'error',
					{ blankLine: 'always', next: ['class', 'function'], prev: '*' },
					{ blankLine: 'always', next: '*', prev: ['class', 'function'] },
				],
				'style/semi': ['error', 'always'],
			},
		},
		{
			files: ['**/.vscode/*.json'],
			rules: {
				'jsonc/sort-array-values': ['error', { order: { type: 'asc' }, pathPattern: '^.*$' }],
				'jsonc/sort-keys': ['error', 'asc', { caseSensitive: true, natural: true }],
			},
		},
	);
}

export const bun = createConfig('bun');
export const node = createConfig('node');
