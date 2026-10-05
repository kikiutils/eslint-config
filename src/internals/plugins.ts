import { consistentConditionLayout } from './rules/consistent-condition-layout';
import { consistentParameterLayout } from './rules/consistent-parameter-layout';

export const customPlugins = {
    rules: {
        'consistent-condition-layout': consistentConditionLayout,
        'consistent-parameter-layout': consistentParameterLayout,
    },
};
