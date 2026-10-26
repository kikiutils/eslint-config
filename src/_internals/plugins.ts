import { compactIterationLayout } from './rules/compact-iteration-layout';
import { consistentConditionLayout } from './rules/consistent-condition-layout';
import { consistentParameterLayout } from './rules/consistent-parameter-layout';
import { statementPadding } from './rules/statement-padding';

export const customPlugins = {
    rules: {
        'compact-iteration-layout': compactIterationLayout,
        'consistent-condition-layout': consistentConditionLayout,
        'consistent-parameter-layout': consistentParameterLayout,
        'statement-padding': statementPadding,
    },
};
