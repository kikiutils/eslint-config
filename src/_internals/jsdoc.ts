import type { TypedFlatConfigItem } from '@antfu/eslint-config';

export const jsdocSettings = {
    jsdoc: {
        tagNamePreference: {
            arg: 'param',
            argument: 'param',
            desc: false,
            description: false,
            exception: 'throws',
            return: 'returns',
            types: false,
        },
    },
};

export const typescriptJsdocConfig = {
    rules: {
        'jsdoc/check-tag-names': [
            'error',
            {
                definedTags: [
                    'alpha',
                    'beta',
                    'defaultValue',
                    'eventProperty',
                    'experimental',
                    'hidden',
                    'inheritDoc',
                    'internal',
                    'packageDocumentation',
                    'privateRemarks',
                    'remarks',
                    'sealed',
                    'typeParam',
                    'virtual',
                ],
            },
        ],
        'jsdoc/multiline-blocks': [
            'error',
            {
                noSingleLineBlocks: true,
                singleLineTags: [],
            },
        ],
        'jsdoc/no-types': 'error',
    },
    settings: {
        jsdoc: {
            mode: 'typescript',
            tagNamePreference: {
                ...jsdocSettings.jsdoc.tagNamePreference,
                callback: false,
                class: false,
                constructor: false,
                default: 'defaultValue',
                function: false,
                method: false,
                readonly: false,
                static: false,
                template: false,
                type: false,
                typedef: false,
                typeParam: 'typeParam',
                virtual: 'virtual',
            },
        },
    },
} satisfies TypedFlatConfigItem;
