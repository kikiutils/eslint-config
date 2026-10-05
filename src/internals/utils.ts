import type {
    Rule,
    SourceCode,
} from 'eslint';

export type TokenStore = Pick<
    SourceCode,
    'commentsExistBetween' | 'getLastToken' | 'getTokenAfter' | 'getTokenBefore' | 'getTokensBetween'
>;

interface TemplateParserServices {
    defineTemplateBodyVisitor?: (
        templateVisitor: Rule.RuleListener,
        scriptVisitor: Rule.RuleListener,
    ) => Rule.RuleListener;

    getTemplateBodyTokenStore?: () => TokenStore;
}

export function defineScriptAndTemplateVisitors(
    sourceCode: SourceCode,
    createVisitor: (tokenStore: TokenStore, isTemplate: boolean) => Rule.RuleListener,
): Rule.RuleListener {
    const scriptVisitor = createVisitor(sourceCode, false);
    const parserServices = sourceCode.parserServices as TemplateParserServices;
    if (!parserServices.defineTemplateBodyVisitor || !parserServices.getTemplateBodyTokenStore) return scriptVisitor;

    return parserServices.defineTemplateBodyVisitor(
        createVisitor(parserServices.getTemplateBodyTokenStore(), true),
        scriptVisitor,
    );
}
