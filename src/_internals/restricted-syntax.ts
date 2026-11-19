export const restrictedSyntax = [
    'TSEnumDeclaration[const=true]',
    'TSExportAssignment',
    {
        message: 'Use `axios.isAxiosError(error)`; `instanceof` fails when the error comes from another copy of axios.',
        selector: 'BinaryExpression[operator="instanceof"][right.name="AxiosError"]',
    },
    {
        message: 'Do not swallow the rejection silently: log it, or handle it in a way that shows why it can be ignored.',
        selector: 'CallExpression[callee.property.name="catch"] > ArrowFunctionExpression[body.type="BlockStatement"][body.body.length=0]',
    },
];
