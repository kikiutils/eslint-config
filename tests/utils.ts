import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { objectEntries } from 'ts-extras';

export function createSyntaxConfigs(
    configs: readonly TypedFlatConfigItem[],
    predicate: (ruleId: string) => boolean,
): TypedFlatConfigItem[] {
    return [
        ...filterRules(configs, (ruleId) => ruleId !== 'kikiutils/promise-function-async' && predicate(ruleId)),
        { languageOptions: { parserOptions: { projectService: false } } },
    ];
}

export function filterRules(
    configs: readonly TypedFlatConfigItem[],
    predicate: (ruleId: string) => boolean,
): TypedFlatConfigItem[] {
    return configs.map((config) => ({
        ...config,
        rules: Object.fromEntries(objectEntries(config.rules ?? {}).filter(([ruleId]) => predicate(ruleId))),
    }));
}
