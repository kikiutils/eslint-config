import type {
    AST,
    Rule,
} from 'eslint';

type Comment = ReturnType<Rule.RuleContext['sourceCode']['getAllComments']>[number];

const closingPunctuators = new Set([
    ')',
    ']',
    '}',
]);

const openingPunctuators = new Set([
    '(',
    '[',
    '{',
]);

export const commentIndent: Rule.RuleModule = {
    create(context) {
        const { sourceCode } = context;
        const getIndent = (line: number) => /^[\t ]*/.exec(sourceCode.lines[line - 1]!)![0];
        const startsLine = (token: AST.Token | Comment) => {
            const previous = sourceCode.getTokenBefore(token, { includeComments: true });
            return !previous || previous.loc!.end.line < token.loc!.start.line;
        };

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    if (!startsLine(comment)) continue;
                    // style/indent lets a comment align with the opening bracket before it, which leaves comments
                    // at the outer depth after a fixer nests the bracket's contents one level deeper.
                    let anchor = sourceCode.getTokenBefore(comment, { includeComments: true });
                    while ((anchor?.type === 'Block' || anchor?.type === 'Line') && startsLine(anchor)) {
                        anchor = sourceCode.getTokenBefore(anchor, { includeComments: true });
                    }

                    if (anchor?.type !== 'Punctuator' || !openingPunctuators.has(anchor.value)) continue;
                    const next = sourceCode.getTokenAfter(comment);
                    if (!next || closingPunctuators.has(next.value) || !startsLine(next)) continue;
                    const { end, start } = comment.loc!;
                    // style/indent only lets a comment follow the next code when no blank line separates them.
                    const gapLines = sourceCode.lines.slice(end.line, next.loc.start.line - 1);
                    if (gapLines.some((text) => !text.trim())) continue;
                    const indent = getIndent(start.line);
                    const expected = getIndent(next.loc.start.line);
                    if (indent === expected) continue;
                    const commentLines = Array.from(
                        { length: end.line - start.line + 1 },
                        (_, index) => start.line + index,
                    );

                    context.report({
                        // Shift a multiline block comment as a whole so its continuation lines stay aligned.
                        fix: (fixer) => commentLines
                            .filter((line) => sourceCode.lines[line - 1]!.startsWith(indent))
                            .map((line) => {
                                const offset = sourceCode.getIndexFromLoc({
                                    column: 0,
                                    line,
                                });

                                return fixer.replaceTextRange(
                                    [
                                        offset,
                                        offset + indent.length,
                                    ],
                                    expected,
                                );
                            }),
                        loc: comment.loc!,
                        messageId: 'align',
                    });
                }
            },
        };
    },
    meta: {
        docs: { description: 'Align comments after an opening bracket with the code that follows them.' },
        fixable: 'whitespace',
        messages: { align: 'Indent this comment like the code that follows it.' },
        schema: [],
        type: 'layout',
    },
};
