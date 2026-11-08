# @kikiutils/eslint-config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Description

- [✨ Release Notes](./CHANGELOG.md)

## Features

## Requirements

- **Node.js** `>=22.12.0`

## Installation

Using [pnpm](https://pnpm.io):

```bash
pnpm add -D @kikiutils/eslint-config
pnpm add ts-extras type-fest
```

You can also use `yarn`, `npm`, or `bun`.

## Usage

TypeScript and Vue configs enable type-aware checks using TypeScript's Project Service.
Linted files must belong to a discoverable `tsconfig.json`; project references are supported.
The default setup does not require an additional `typescript.tsconfigPath` option.
JavaScript files retain syntax-only linting.
TypeScript tool configs (`*.config.ts`, `*.config.mts`, `*.config.cts`) are excluded from type-aware checks.
TypeScript and Vue configs also enable nine selected `eslint-plugin-typefest` rules for `type-fest` types and `ts-extras` helpers, excluding TypeScript tool configs.
Both packages are required peer dependencies; keep `ts-extras` in runtime dependencies when application code imports its helpers.
Type-aware checks require Promise-returning functions to be `async` and returned promises to use `return await`.
Both `require-await` rules are disabled so `async` wrappers can preserve Promise-based error handling without an `await`.
Base configs keep linting Markdown itself, but exclude its code blocks from all lint rules.
Style configs format CSS and SCSS; indented Sass (`.sass`) is not supported.

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-href]: https://npmjs.com/package/@kikiutils/eslint-config
[npm-version-src]: https://img.shields.io/npm/v/@kikiutils/eslint-config/latest.svg?colorA=18181b&colorB=28cf8d&style=flat

[npm-downloads-href]: https://npmjs.com/package/@kikiutils/eslint-config
[npm-downloads-src]: https://img.shields.io/npm/dm/@kikiutils/eslint-config.svg?colorA=18181b&colorB=28cf8d&style=flat

[license-href]: https://github.com/kikiutils/eslint-config/blob/main/LICENSE
[license-src]: https://img.shields.io/github/license/kikiutils/eslint-config?colorA=18181b&colorB=28cf8d&style=flat
