import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';

import { filterRules } from './utils';

const args = [
    '--port',
    '3000',
    '--host',
    '127.0.0.1',
];

const autoAttachSmartPattern = [
    '**/*',
    '!**/node_modules/**',
];

describe('vscode jsonc sorting', () => {
    let configs: TypedFlatConfigItem[];

    beforeAll(async () => {
        configs = filterRules(
            await antfu({ typescript: true }, createBaseConfigs()),
            (id) => id === 'jsonc/sort-array-values' || id === 'jsonc/sort-keys',
        );
    });

    it.for([
        {
            filename: '.vscode/launch.json',
            input: {
                args,
                configurations: [
                    {
                        args,
                        autoAttachSmartPattern,
                        outFiles: [
                            'dist/**/*.js',
                            '!dist/vendor/**',
                        ],
                        resolveSourceMapLocations: [
                            '**',
                            '!**/node_modules/**',
                        ],
                        runtimeArgs: [
                            '--require',
                            'z-register',
                            '--inspect',
                        ],
                        skipFiles: [
                            '**/node_modules/**',
                            '!**/node_modules/my-module/**',
                        ],
                        windows: { args },
                    },
                ],
                values: [
                    'z',
                    'a',
                ],
            },
            output: {
                args,
                configurations: [
                    {
                        args,
                        autoAttachSmartPattern,
                        outFiles: [
                            'dist/**/*.js',
                            '!dist/vendor/**',
                        ],
                        resolveSourceMapLocations: [
                            '**',
                            '!**/node_modules/**',
                        ],
                        runtimeArgs: [
                            '--require',
                            'z-register',
                            '--inspect',
                        ],
                        skipFiles: [
                            '**/node_modules/**',
                            '!**/node_modules/my-module/**',
                        ],
                        windows: { args },
                    },
                ],
                values: [
                    'a',
                    'z',
                ],
            },
        },
        {
            filename: 'packages/app/.vscode/tasks.json',
            input: {
                inputs: [
                    {
                        id: 'mode',
                        options: [
                            'production',
                            'development',
                        ],
                        type: 'pickString',
                    },
                ],
                tasks: [
                    {
                        args,
                        dependsOn: [
                            'prepare',
                            'build',
                        ],
                        dependsOrder: 'sequence',
                        linux: { args },
                        problemMatcher: [
                            '$tsc',
                            '$eslint-stylish',
                        ],
                    },
                ],
                values: [
                    'z',
                    'a',
                ],
            },
            output: {
                inputs: [
                    {
                        id: 'mode',
                        options: [
                            'production',
                            'development',
                        ],
                        type: 'pickString',
                    },
                ],
                tasks: [
                    {
                        args,
                        dependsOn: [
                            'prepare',
                            'build',
                        ],
                        dependsOrder: 'sequence',
                        linux: { args },
                        problemMatcher: [
                            '$tsc',
                            '$eslint-stylish',
                        ],
                    },
                ],
                values: [
                    'a',
                    'z',
                ],
            },
        },
        {
            filename: '.vscode/settings.json',
            input: {
                'args': args,
                'debug.javascript.autoAttachSmartPattern': autoAttachSmartPattern,
                'eslint.validate': [
                    'typescript',
                    'javascript',
                ],
                'terminal.integrated.profiles.linux': {
                    custom: {
                        args,
                        path: '/bin/bash',
                    },
                },
            },
            output: {
                'args': args,
                'debug.javascript.autoAttachSmartPattern': autoAttachSmartPattern,
                'eslint.validate': [
                    'javascript',
                    'typescript',
                ],
                'terminal.integrated.profiles.linux': {
                    custom: {
                        args,
                        path: '/bin/bash',
                    },
                },
            },
        },
        {
            filename: '.vscode/extensions.json',
            input: {
                recommendations: [
                    'publisher.z',
                    'publisher.a',
                ],
            },
            output: {
                recommendations: [
                    'publisher.a',
                    'publisher.z',
                ],
            },
        },
    ])(
        'should apply file-scoped array sorting in $filename',
        (
            {
                filename,
                input,
                output,
            },
            { expect },
        ) => {
            const linter = new Linter();
            const result = linter.verifyAndFix(JSON.stringify(input), configs, { filename });

            expect(result.messages).toEqual([]);
            expect(JSON.parse(result.output)).toEqual(output);
            expect(linter.verifyAndFix(result.output, configs, { filename }).fixed).toBe(false);
        },
    );
});
