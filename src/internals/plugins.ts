import { compactIterationLayout } from './rules/compact-iteration-layout';
import { consistentConditionLayout } from './rules/consistent-condition-layout';
import { consistentParameterLayout } from './rules/consistent-parameter-layout';

export const customPlugins = {
    rules: {
        'compact-iteration-layout': compactIterationLayout,
        'consistent-condition-layout': consistentConditionLayout,
        'consistent-parameter-layout': consistentParameterLayout,
    },
};
