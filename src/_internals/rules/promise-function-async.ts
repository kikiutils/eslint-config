import tseslint from '@typescript-eslint/eslint-plugin';
import type { Rule } from 'eslint';
import type {
    Node,
    SignatureDeclaration,
    Type,
    TypeChecker,
} from 'typescript';

interface ParserServices {
    esTreeNodeToTSNodeMap: { get: (node: unknown) => Node };
    program: { getTypeChecker: () => TypeChecker };
}

const upstream = tseslint.rules['promise-function-async'] as unknown as Rule.RuleModule;
const promiseMembers = new Set([
    'catch',
    'finally',
    'then',
]);

// A thenable with extra members, such as Nuxt's `AsyncData`, loses those members once the function becomes async.
function hasNonPromiseMembers(checker: TypeChecker, type: Type): boolean {
    return (type.isUnion() ? type.types : [type]).some((part) => {
        const names = checker.getPropertiesOfType(part).map((symbol) => symbol.getName());
        return names.includes('then') && names.some((name) => !promiseMembers.has(name) && !name.startsWith('__@'));
    });
}

export const promiseFunctionAsync: Rule.RuleModule = {
    create(context) {
        const report = (descriptor: Rule.ReportDescriptor) => {
            if ('node' in descriptor) {
                const services = context.sourceCode.parserServices as ParserServices;
                const checker = services.program.getTypeChecker();
                const tsNode = services.esTreeNodeToTSNodeMap.get(descriptor.node) as SignatureDeclaration;
                // Overloads are what callers see, so they count alongside the implementation signature.
                const signatures = [
                    checker.getSignatureFromDeclaration(tsNode),
                    ...checker.getTypeAtLocation(tsNode).getCallSignatures(),
                ];

                if (
                    signatures.some((signature) => signature
                      && hasNonPromiseMembers(checker, checker.getReturnTypeOfSignature(signature)))
                ) return;
            }

            context.report(descriptor);
        };

        // The upstream rule validates that type information is available.
        return upstream.create(Object.create(context, { report: { value: report } }));
    },
    meta: upstream.meta,
};
