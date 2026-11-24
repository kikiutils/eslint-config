import { builtinRules } from 'eslint/use-at-your-own-risk';

import { commentIndent } from './rules/comment-indent';
import { compactIterationLayout } from './rules/compact-iteration-layout';
import { consistentConditionLayout } from './rules/consistent-condition-layout';
import { consistentParameterLayout } from './rules/consistent-parameter-layout';
import { noComposableInHeadGetter } from './rules/no-composable-in-head-getter';
import { noSilentCatch } from './rules/no-silent-catch';
import { promiseFunctionAsync } from './rules/promise-function-async';
import { statementPadding } from './rules/statement-padding';

// Each scope adds its restrictions under its own name: a later config replaces a rule's whole option list,
// so sharing the core rule would drop the restrictions of every broader scope.
// eslint-disable-next-line ts/no-deprecated -- No supported API exposes core rules yet; typescript-eslint uses it too.
const coreRules = builtinRules;
const noRestrictedImports = coreRules.get('no-restricted-imports')!;
const noRestrictedSyntax = coreRules.get('no-restricted-syntax')!;

export const customPlugins = {
    rules: {
        'comment-indent': commentIndent,
        'compact-iteration-layout': compactIterationLayout,
        'consistent-condition-layout': consistentConditionLayout,
        'consistent-parameter-layout': consistentParameterLayout,
        'no-composable-in-head-getter': noComposableInHeadGetter,
        'no-restricted-nuxt-page-syntax': noRestrictedSyntax,
        'no-restricted-nuxt-server-imports': noRestrictedImports,
        'no-restricted-nuxt-syntax': noRestrictedSyntax,
        'no-restricted-test-imports': noRestrictedImports,
        'no-silent-catch': noSilentCatch,
        'promise-function-async': promiseFunctionAsync,
        'statement-padding': statementPadding,
    },
};
