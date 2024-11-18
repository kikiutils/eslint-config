import antfu from '@antfu/eslint-config';
// @ts-expect-error No Type Definition File.
import sortKeysPlus from 'eslint-plugin-sort-keys-plus';

export function createConfig(environment: 'bun' | 'node' = 'node', options?: Parameters<typeof antfu>[0]) {
	return antfu(
		{ typescript: true, ...options },
		{
			files: ['**/*.{cjs,js,mjs,ts}'],
			plugins: { 'sort-keys-plus': sortKeysPlus },
			rules: {
				'antfu/curly': 'off',
				'antfu/if-newline': 'off',
				'curly': ['error', 'multi-line'],
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
						internalPattern: ['@/**'],
					},
				],
				'sort-keys-plus/sort-keys': ['error', 'asc', { caseSensitive: true, natural: false }],
				'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
				'style/indent': ['error', 'tab'],
				'style/no-tabs': 'off',
				'style/padding-line-between-statements': ['error', { blankLine: 'always', next: ['class', 'function'], prev: '*' }],
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
