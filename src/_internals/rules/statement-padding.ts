import type { Rule } from 'eslint';

type StatementNode = Extract<Rule.Node, { type: 'Program' }>['body'][number];

export const statementPadding: Rule.RuleModule = {
    create(context) {
        const { sourceCode } = context;
        const newline = sourceCode.text.match(/\r\n|[\n\r\u2028\u2029]/)?.[0] ?? '\n';

        function checkStatements(statements: readonly StatementNode[]): void {
            for (let index = 1; index < statements.length; index++) {
                const previous = statements[index - 1]!;
                const next = statements[index]!;
                if (
                    [
                        previous,
                        next,
                    ].some((node) =>
                        node.type === 'ImportDeclaration'
                        || node.type === 'ExportAllDeclaration'
                        || (node.type === 'ExportNamedDeclaration' && node.source))
                ) continue;

                const previousFirstToken = sourceCode.getFirstToken(previous)!;
                const lastToken = sourceCode.getLastToken(previous)!;
                const firstToken = sourceCode.getFirstToken(next)!;
                const isMultiline = previousFirstToken.loc.start.line !== lastToken.loc.end.line;
                const blockNode = previous.type === 'ExportDefaultDeclaration'
                  || previous.type === 'ExportNamedDeclaration'
                    ? previous.declaration
                    : previous;

                const hasBlockClosing = lastToken.value === '}' && blockNode && [
                    'BlockStatement',
                    'ClassDeclaration',
                    'ForInStatement',
                    'ForOfStatement',
                    'ForStatement',
                    'FunctionDeclaration',
                    'IfStatement',
                    'LabeledStatement',
                    'SwitchStatement',
                    'TryStatement',
                    'WhileStatement',
                    'WithStatement',
                ].includes(blockNode.type);

                if (!isMultiline && !hasBlockClosing) continue;
                let previousEnd = lastToken.range[1];
                let previousEndLine = lastToken.loc.end.line;
                let nextStart = firstToken.range[0];
                let nextStartLine = firstToken.loc.start.line;

                // Include trailing comments in the previous boundary, not leading comments of the next statement.
                for (const comment of sourceCode.getCommentsBefore(next)) {
                    if (comment.loc!.start.line === previousEndLine) {
                        previousEnd = comment.range![1];
                        previousEndLine = comment.loc!.end.line;
                    } else {
                        nextStart = comment.range![0];
                        nextStartLine = comment.loc!.start.line;
                        break;
                    }
                }

                if (nextStartLine > previousEndLine + 1) continue;
                const linebreak = sourceCode.text.slice(previousEnd, nextStart).match(/\r\n|[\n\r\u2028\u2029]/);
                const offset = linebreak
                    ? previousEnd + linebreak.index! + linebreak[0].length
                    : nextStart;

                context.report({
                    fix: (fixer) => fixer.insertTextBeforeRange(
                        [
                            offset,
                            offset,
                        ],
                        linebreak?.[0] ?? newline.repeat(2),
                    ),
                    messageId: 'blankLine',
                    node: next,
                });
            }
        }

        return {
            BlockStatement: (node) => checkStatements(node.body),
            Program: (node) => checkStatements(node.body),
            StaticBlock: (node) => checkStatements(node.body),
            SwitchCase: (node) => checkStatements(node.consequent),
        };
    },
    meta: {
        docs: { description: 'Separate complete multiline statements and block-ending statements with blank lines.' },
        fixable: 'whitespace',
        messages: { blankLine: 'Add a blank line between these complete statements.' },
        schema: [],
        type: 'layout',
    },
};
