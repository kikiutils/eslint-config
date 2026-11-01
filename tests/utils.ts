import type { TypedFlatConfigItem } from '@antfu/eslint-config';

export function filterRules(
    configs: readonly TypedFlatConfigItem[],
    predicate: (ruleId: string) => boolean,
): TypedFlatConfigItem[] {
    return configs.map((config) => ({
        ...config,
        rules: Object.fromEntries(Object.entries(config.rules ?? {}).filter(([ruleId]) => predicate(ruleId))),
    }));
}
