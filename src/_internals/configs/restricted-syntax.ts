export const restrictedSyntax = [
    'TSEnumDeclaration[const=true]',
    'TSExportAssignment',
    {
        message: 'Use `axios.isAxiosError(error)`; `instanceof` fails when the error comes from another copy of axios.',
        selector: 'BinaryExpression[operator="instanceof"][right.name="AxiosError"]',
    },
];
