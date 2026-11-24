import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import type { Rule } from 'eslint';
import { objectEntries } from 'ts-extras';

interface TypedRuleDocs {
    requiresTypeChecking?: boolean;
}

export function createSyntaxConfigs(
    configs: readonly TypedFlatConfigItem[],
    predicate: (ruleId: string) => boolean,
): TypedFlatConfigItem[] {
    // Syntax-only configs disable type information, so rules that require it cannot run.
    const typedRuleIds = new Set(configs.flatMap(({ plugins = {} }) => objectEntries(plugins).flatMap(
        ([prefix, plugin]) => objectEntries((plugin.rules ?? {}) as Record<string, Rule.RuleModule>)
            .filter(([, rule]) => (rule.meta?.docs as TypedRuleDocs | undefined)?.requiresTypeChecking)
            .map(([name]) => `${prefix}/${name}`),
    )));

    return [
        ...filterRules(configs, (ruleId) => !typedRuleIds.has(ruleId) && predicate(ruleId)),
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
