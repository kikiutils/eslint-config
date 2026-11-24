import { commentIndent } from './rules/comment-indent';
import { compactIterationLayout } from './rules/compact-iteration-layout';
import { consistentConditionLayout } from './rules/consistent-condition-layout';
import { consistentParameterLayout } from './rules/consistent-parameter-layout';
import { noSilentCatch } from './rules/no-silent-catch';
import { promiseFunctionAsync } from './rules/promise-function-async';
import { statementPadding } from './rules/statement-padding';

export const customPlugins = {
    rules: {
        'comment-indent': commentIndent,
        'compact-iteration-layout': compactIterationLayout,
        'consistent-condition-layout': consistentConditionLayout,
        'consistent-parameter-layout': consistentParameterLayout,
        'no-silent-catch': noSilentCatch,
        'promise-function-async': promiseFunctionAsync,
        'statement-padding': statementPadding,
    },
};
