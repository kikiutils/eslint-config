export const internalsImportPattern = {
    message: '`_internals` modules are private to their own directory; import the public module instead.',
    regex: String.raw`^[^.].*/_internals(/|$)`,
};
