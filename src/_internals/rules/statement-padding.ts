import type { Rule } from 'eslint';

type StatementNode = Extract<Rule.Node, { type: 'Program' }>['body'][number];

export const statementPadding: Rule.RuleModule = {
    create(context) {
        const { sourceCode } = context;

        function checkStatements(statements: readonly StatementNode[]): void {
            for (let index = 1; index < statements.length; index++) {
                const previous = statements[index - 1]!;
                const next = statements[index]!;
                const lastToken = sourceCode.getLastToken(previous)!;
                const firstToken = sourceCode.getFirstToken(next)!;
                const closingLine = sourceCode.lines[lastToken.loc.end.line - 1]!;
                const openingLine = sourceCode.lines[firstToken.loc.start.line - 1]!;
                const hasDifferentIndent = /^\s*/.exec(closingLine)![0] !== /^\s*/.exec(openingLine)![0];
                const hasStandaloneClosing = /^[)\]}]+;?$/.test(closingLine.slice(0, lastToken.loc.end.column).trim());
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

                if (!hasDifferentIndent && !hasStandaloneClosing && !hasBlockClosing) continue;
                const comments = sourceCode.getCommentsBefore(next);
                if (
                    sourceCode
                        .lines
                        .slice(lastToken.loc.end.line, firstToken.loc.start.line - 1)
                        .some((line, index) => !line.trim() && !comments.some((comment) =>
                            comment.loc!.start.line <= lastToken.loc.end.line + index + 1
                            && comment.loc!.end.line >= lastToken.loc.end.line + index + 1))
                ) continue;

                // Keep leading comments attached to the next statement and trailing comments in place.
                const boundary = comments
                    .find((comment) => comment.loc!.start.line > lastToken.loc.end.line) ?? firstToken;

                const offset = boundary.loc!.start.line > lastToken.loc.end.line
                    ? boundary.range![0] - boundary.loc!.start.column
                    : boundary.range![0];

                context.report({
                    fix: (fixer) => fixer.insertTextBeforeRange(
                        [
                            offset,
                            offset,
                        ],
                        boundary.loc!.start.line === lastToken.loc.end.line ? '\n\n' : '\n',
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
        docs: { description: 'Separate statements after closing lines, blocks, or indentation changes.' },
        fixable: 'whitespace',
        messages: { blankLine: 'Add a blank line between these complete statements.' },
        schema: [],
        type: 'layout',
    },
};
