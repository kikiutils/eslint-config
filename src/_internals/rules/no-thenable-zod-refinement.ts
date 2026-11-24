import type { Rule } from 'eslint';
import type {
    Node,
    Type,
    TypeChecker,
} from 'typescript';

interface ParserServices {
    esTreeNodeToTSNodeMap: { get: (node: unknown) => Node };
    program: { getTypeChecker: () => TypeChecker };
}

const refinementMethods = new Set([
    'check',
    'refine',
    'superRefine',
]);

// Zod awaits a refinement only when it returns a native Promise; any other thenable counts as a truthy result.
function isNonPromiseThenable(type: Type): boolean {
    return (type.isUnion() ? type.types : [type]).some(
        (part) => part.getProperty('then') && part.getSymbol()?.getName() !== 'Promise',
    );
}

export const noThenableZodRefinement: Rule.RuleModule = {
    create(context) {
        const services = context.sourceCode.parserServices as ParserServices;
        const checker = services.program.getTypeChecker();
        const getType = (node: unknown) => checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));

        return {
            CallExpression(node) {
                const { callee } = node;
                if (
                    callee.type !== 'MemberExpression'
                    || callee.computed
                    || callee.property.type !== 'Identifier'
                    || !refinementMethods.has(callee.property.name)
                    // Covers schema methods such as `z.objectId().refine()` and standalone checks such as `z.refine()`.
                    || !getType(node).getProperty('_zod')
                ) return;

                const method = callee.property.name;
                // `.check()` takes several checks; non-function checks have no call signatures.
                for (const callback of node.arguments) {
                    const returnsThenable = getType(callback)
                        .getCallSignatures()
                        .some((signature) => isNonPromiseThenable(checker.getReturnTypeOfSignature(signature)));

                    if (!returnsThenable) continue;
                    context.report({
                        data: { method },
                        messageId: 'thenable',
                        node: callback,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            description: 'Disallow Zod refinements and checks that return a thenable other than a Promise.',
            requiresTypeChecking: true,
        } as Rule.RuleMetaData['docs'],
        messages: { thenable: 'Zod only awaits a native Promise, so this `{{ method }}()` callback\'s thenable (such as a Mongoose Query) counts as a passing check. Make the callback `async` and `await` the value.' },
        schema: [],
        type: 'problem',
    },
};
