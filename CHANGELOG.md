# Changelog

## v5.0.4

[compare changes](https://github.com/kikiutils/eslint-config/compare/v5.0.3...v5.0.4)

### 🏡 Chore

- Update deps and `peerDependencies` ([d0e3854](https://github.com/kikiutils/eslint-config/commit/d0e3854))

### ❤️ Contributors

- Kiki-kanri

## v5.0.3

[compare changes](https://github.com/kikiutils/eslint-config/compare/v5.0.2...v5.0.3)

### 🩹 Fixes

- Scope `node/prefer-global/process` rule to exclude `.vue` files ([60de977](https://github.com/kikiutils/eslint-config/commit/60de977))

### 🏡 Chore

- Upgrade deps ([cea0818](https://github.com/kikiutils/eslint-config/commit/cea0818))

### ❤️ Contributors

- Kiki-kanri

## v5.0.2

[compare changes](https://github.com/kikiutils/eslint-config/compare/v5.0.1...v5.0.2)

### 🏡 Chore

- Update `perfectionist/sort-enums` rule config ([a4b2658](https://github.com/kikiutils/eslint-config/commit/a4b2658))

### ❤️ Contributors

- Kiki-kanri

## v5.0.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v5.0.0...v5.0.1)

### 🏡 Chore

- Update eslint config ([e75c3d7](https://github.com/kikiutils/eslint-config/commit/e75c3d7))
- Upgrade deps ([4adb44d](https://github.com/kikiutils/eslint-config/commit/4adb44d))
- Update deps ([912e07e](https://github.com/kikiutils/eslint-config/commit/912e07e))
- Upgrade deps ([cba24ab](https://github.com/kikiutils/eslint-config/commit/cba24ab))
- Update `perfectionist/sort-imports` rule groups config ([f9e8e6f](https://github.com/kikiutils/eslint-config/commit/f9e8e6f))

### ❤️ Contributors

- Kiki-kanri

## v5.0.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v4.0.1...v5.0.0)

### 💅 Refactors

- ⚠️  Split original create configs into multiple groups (base, vue, style) and separate files, make some dependencies optional ([6922fa6](https://github.com/kikiutils/eslint-config/commit/6922fa6))

### 🏡 Chore

- Update tsdown config ([59407a9](https://github.com/kikiutils/eslint-config/commit/59407a9))
- Disable tsdown `fixedExtension` config ([9039405](https://github.com/kikiutils/eslint-config/commit/9039405))
- Upgrade deps ([bdbdfd9](https://github.com/kikiutils/eslint-config/commit/bdbdfd9))

#### ⚠️ Breaking Changes

- ⚠️  Split original create configs into multiple groups (base, vue, style) and separate files, make some dependencies optional ([6922fa6](https://github.com/kikiutils/eslint-config/commit/6922fa6))

### ❤️ Contributors

- Kiki-kanri

## v4.0.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v4.0.0...v4.0.1)

### 💅 Refactors

- Rename func parameters in `arr.map` and similar methods to `item` for consistency ([c5768ac](https://github.com/kikiutils/eslint-config/commit/c5768ac))
- Tidy up code ([1a92f2c](https://github.com/kikiutils/eslint-config/commit/1a92f2c))

### 🏡 Chore

- Upgrade devDependencies ([aca04e8](https://github.com/kikiutils/eslint-config/commit/aca04e8))
- Replace `@kikiutils/changelogen` with `changelogen` ([8d1d648](https://github.com/kikiutils/eslint-config/commit/8d1d648))
- Update script ([44312fb](https://github.com/kikiutils/eslint-config/commit/44312fb))
- Update `pnpm.onlyBuiltDependencies` ([9788a78](https://github.com/kikiutils/eslint-config/commit/9788a78))
- Upgrade dependencies ([dd22498](https://github.com/kikiutils/eslint-config/commit/dd22498))

### 🤖 CI

- Update config file ([cfba23c](https://github.com/kikiutils/eslint-config/commit/cfba23c))

### ❤️ Contributors

- Kiki-kanri

## v4.0.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v3.0.1...v4.0.0)

### 🚀 Enhancements

- Add `update-peer-dependencies-meta.ts` ([643c006](https://github.com/kikiutils/eslint-config/commit/643c006))

### 🩹 Fixes

- Resolve alias configuration error in tsdown setup ([656e2e0](https://github.com/kikiutils/eslint-config/commit/656e2e0))
- Add missing -b flag to typecheck command ([cf0c795](https://github.com/kikiutils/eslint-config/commit/cf0c795))
- Remove custom exports configuration from tsdown ([efb18bc](https://github.com/kikiutils/eslint-config/commit/efb18bc))
- Remove tsdown `remove-types-js` plugin ([6922c2f](https://github.com/kikiutils/eslint-config/commit/6922c2f))
- Remove tsdown remove-types-js plugin and custom exports configuration ([735a3a9](https://github.com/kikiutils/eslint-config/commit/735a3a9))
- Ensure tsdown `customExports` returns after deleting keys containing internals ([7324bab](https://github.com/kikiutils/eslint-config/commit/7324bab))
- Resolve types error ([5461f6b](https://github.com/kikiutils/eslint-config/commit/5461f6b))

### 📖 Documentation

- Update README ([63ba464](https://github.com/kikiutils/eslint-config/commit/63ba464))

### 📦 Build

- Clean up js files under `dist/types` after tsdown build and update exports config ([2affd31](https://github.com/kikiutils/eslint-config/commit/2affd31))
- Clean up js files under `dist/types` after tsdown build and update exports config ([299e647](https://github.com/kikiutils/eslint-config/commit/299e647))
- Clean up js files under `dist/types` after tsdown build and update exports config ([6fa1d2b](https://github.com/kikiutils/eslint-config/commit/6fa1d2b))
- Update tsdown config to treat all dependencies as external ([f5e4f7a](https://github.com/kikiutils/eslint-config/commit/f5e4f7a))
- Update tsdown customExports to remove entries with keys containing "internals" ([59b1622](https://github.com/kikiutils/eslint-config/commit/59b1622))
- Update tsdown entry ([2e67d6b](https://github.com/kikiutils/eslint-config/commit/2e67d6b))
- Set tsdown external from package.json instead of using wildcard * ([7dc5f28](https://github.com/kikiutils/eslint-config/commit/7dc5f28))
- Update `customExports` rules to enable IDE import hints for package usage ([e4111c0](https://github.com/kikiutils/eslint-config/commit/e4111c0))
- Update `customExports` rules to enable IDE import hints for package usage ([fa88888](https://github.com/kikiutils/eslint-config/commit/fa88888))

### 🏡 Chore

- Update all scripts ([fa5e797](https://github.com/kikiutils/eslint-config/commit/fa5e797))
- Set minimum supported version to 22.12.0 ([76e8cc1](https://github.com/kikiutils/eslint-config/commit/76e8cc1))
- Remove alias config ([e353604](https://github.com/kikiutils/eslint-config/commit/e353604))
- Change `update-peer-dependencies-meta.ts` to non-executable permission file ([62a7690](https://github.com/kikiutils/eslint-config/commit/62a7690))
- Update base tsconfig ([26f4158](https://github.com/kikiutils/eslint-config/commit/26f4158))
- Add `.editorconfig` ([11056ce](https://github.com/kikiutils/eslint-config/commit/11056ce))
- ⚠️ Downgrade eslint-plugin-tailwindcss to v3 ([8c0b695](https://github.com/kikiutils/eslint-config/commit/8c0b695))

#### ⚠️ Breaking Changes

- ⚠️ Downgrade eslint-plugin-tailwindcss to v3 ([8c0b695](https://github.com/kikiutils/eslint-config/commit/8c0b695))

### ❤️ Contributors

- kiki-kanri

## v3.0.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v3.0.0...v3.0.1)

### 💅 Refactors

- Remove unnecessary code ([bf56f37](https://github.com/kikiutils/eslint-config/commit/bf56f37))

### 🏡 Chore

- Update tsdown entry ([9cbb6bb](https://github.com/kikiutils/eslint-config/commit/9cbb6bb))
- Disable `isolatedDeclarations` ([85f066e](https://github.com/kikiutils/eslint-config/commit/85f066e))
- Update eslint config ([09d584b](https://github.com/kikiutils/eslint-config/commit/09d584b))

### ❤️ Contributors

- kiki-kanri

## v3.0.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v2.1.1...v3.0.0)

### 💅 Refactors

- **tsconfig:** Separate references so src and tests use different settings ([df472e2](https://github.com/kikiutils/eslint-config/commit/df472e2))

### 📦 Build

- ⚠️ Switch builder to tsdown and convert package to pure ESM ([d307be4](https://github.com/kikiutils/eslint-config/commit/d307be4))

### 🏡 Chore

- **ci:** Remove pnpm cache configure in workflow ([abc0801](https://github.com/kikiutils/eslint-config/commit/abc0801))
- ⚠️ Drop support for Node.js 20, set minimum supported version to 22 ([3319820](https://github.com/kikiutils/eslint-config/commit/3319820))
- Upgrade devDependencies ([57244a0](https://github.com/kikiutils/eslint-config/commit/57244a0))
- Set tsdown alias and tsconfig paths ([be49779](https://github.com/kikiutils/eslint-config/commit/be49779))
- Update tsdown config ([fc9e7cb](https://github.com/kikiutils/eslint-config/commit/fc9e7cb))
- Add `tsconfig.base.json` ([f6ba6dd](https://github.com/kikiutils/eslint-config/commit/f6ba6dd))
- Update dependencies ([1da643f](https://github.com/kikiutils/eslint-config/commit/1da643f))
- Set `peerDependencies` and meta ([007f887](https://github.com/kikiutils/eslint-config/commit/007f887))
- Update eslint config ([66346eb](https://github.com/kikiutils/eslint-config/commit/66346eb))
- Update eslint config ([99cd82e](https://github.com/kikiutils/eslint-config/commit/99cd82e))

### ✅ Tests

- Fix vitest config to correctly load tsconfig and aliases ([0522f79](https://github.com/kikiutils/eslint-config/commit/0522f79))

#### ⚠️ Breaking Changes

- ⚠️ Switch builder to tsdown and convert package to pure ESM ([d307be4](https://github.com/kikiutils/eslint-config/commit/d307be4))
- ⚠️ Drop support for Node.js 20, set minimum supported version to 22 ([3319820](https://github.com/kikiutils/eslint-config/commit/3319820))

### ❤️ Contributors

- kiki-kanri

## v2.1.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v2.1.0...v2.1.1)

### 🏡 Chore

- **ci:** Configure pnpm cache in workflow ([79e2264](https://github.com/kikiutils/eslint-config/commit/79e2264))
- Upgrade tailwindcss dependencies to v4 beta ([1ea40ef](https://github.com/kikiutils/eslint-config/commit/1ea40ef))

### ❤️ Contributors

- kiki-kanri

## v2.1.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v2.0.0...v2.1.0)

### 🚀 Enhancements

- Add tsx support ([7c601d0](https://github.com/kikiutils/eslint-config/commit/7c601d0))

### 🏡 Chore

- Bump tsconfig target to es2023 ([b9185b7](https://github.com/kikiutils/eslint-config/commit/b9185b7))
- Update `.gitignore` ([1465997](https://github.com/kikiutils/eslint-config/commit/1465997))
- Update dependencies ([d2897e2](https://github.com/kikiutils/eslint-config/commit/d2897e2))

### ❤️ Contributors

- kiki-kanri

## v2.0.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.7...v2.0.0)

### 🏡 Chore

- Update dependencies and modify scripts ([374cc56](https://github.com/kikiutils/eslint-config/commit/374cc56))
- ⚠️ Drop support for Node.js 18.12.1, set minimum supported version to 20 ([32c6ad3](https://github.com/kikiutils/eslint-config/commit/32c6ad3))

### ✅ Tests

- Change vitest config file to mjs ([5c3bc1f](https://github.com/kikiutils/eslint-config/commit/5c3bc1f))

#### ⚠️ Breaking Changes

- ⚠️ Drop support for Node.js 18.12.1, set minimum supported version to 20 ([32c6ad3](https://github.com/kikiutils/eslint-config/commit/32c6ad3))

### ❤️ Contributors

- kiki-kanri

## v1.2.7

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.6...v1.2.7)

### 🏡 Chore

- Update `style/operator-linebreak` rule ([0a8f2ff](https://github.com/kikiutils/eslint-config/commit/0a8f2ff))

### ❤️ Contributors

- kiki-kanri

## v1.2.6

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.5...v1.2.6)

### 🏡 Chore

- Update `style/operator-linebreak` rule ([a003df1](https://github.com/kikiutils/eslint-config/commit/a003df1))

### ❤️ Contributors

- kiki-kanri

## v1.2.5

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.4...v1.2.5)

### 🏡 Chore

- Set `style/operator-linebreak` rule ([1919d7b](https://github.com/kikiutils/eslint-config/commit/1919d7b))

### ❤️ Contributors

- kiki-kanri

## v1.2.4

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.3...v1.2.4)

### 🏡 Chore

- Update dependencies and restore `@antfu/eslint-config` to latest stable version ([0d5c8e5](https://github.com/kikiutils/eslint-config/commit/0d5c8e5))

### ❤️ Contributors

- kiki-kanri

## v1.2.3

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.2...v1.2.3)

### 🏡 Chore

- Temporarily pin `@antfu/eslint-config` version to avoid errors ([92b65f0](https://github.com/kikiutils/eslint-config/commit/92b65f0))

### ❤️ Contributors

- kiki-kanri

## v1.2.2

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.1...v1.2.2)

### 🏡 Chore

- Upgrade dependencies and remove `@types/node` ([32aaf31](https://github.com/kikiutils/eslint-config/commit/32aaf31))
- Wrap all variable expansions in scripts with `${}` ([82c47c9](https://github.com/kikiutils/eslint-config/commit/82c47c9))
- Remove `partitionByComment` option from `basePerfectionistSortOptions` ([4036d23](https://github.com/kikiutils/eslint-config/commit/4036d23))

### 🤖 CI

- Set `--prod=false` when install dependencies ([93d7945](https://github.com/kikiutils/eslint-config/commit/93d7945))
- Remove `--prod=false` flag when install dependencies ([249def0](https://github.com/kikiutils/eslint-config/commit/249def0))

### ❤️ Contributors

- kiki-kanri

## v1.2.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.2.0...v1.2.1)

### 🏡 Chore

- Update `perfectionist/sort-modules` grouping configuration ([65e11ce](https://github.com/kikiutils/eslint-config/commit/65e11ce))

### ❤️ Contributors

- kiki-kanri

## v1.2.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.1.0...v1.2.0)

### 🚀 Enhancements

- Configure `perfectionist/sort-modules` rule ([9a49d2d](https://github.com/kikiutils/eslint-config/commit/9a49d2d))

### 💅 Refactors

- Rename `commonPerfectionistSortOptions` to `basePerfectionistSortOptions` and change `partitionByNewLine` to `partitionByComment` ([7a4fb85](https://github.com/kikiutils/eslint-config/commit/7a4fb85))

### 🏡 Chore

- Set eslint config to enable `lib` mode ([59e03e4](https://github.com/kikiutils/eslint-config/commit/59e03e4))
- Disable `ts/explicit-function-return-type` eslint rule ([5190f6b](https://github.com/kikiutils/eslint-config/commit/5190f6b))
- Lint code ([f8f0974](https://github.com/kikiutils/eslint-config/commit/f8f0974))
- **test:** Migrate from `jest` to `vitest` ([9a9d869](https://github.com/kikiutils/eslint-config/commit/9a9d869))
- Split `tsconfig` and create build-specific config for production builds ([564b6d2](https://github.com/kikiutils/eslint-config/commit/564b6d2))
- **vitest:** Configure coverage to collect files only under `src/` ([e2c7f65](https://github.com/kikiutils/eslint-config/commit/e2c7f65))
- Lint code ([e28ce30](https://github.com/kikiutils/eslint-config/commit/e28ce30))

### ❤️ Contributors

- kiki-kanri

## v1.1.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.0.2...v1.1.0)

### 🚀 Enhancements

- Add vue export ([d3f1d5d](https://github.com/kikiutils/eslint-config/commit/d3f1d5d))
- Enable `@kikiutils/vue/no-extra-space-in-class` rule for vue ([dba5553](https://github.com/kikiutils/eslint-config/commit/dba5553))

### 🏡 Chore

- **scripts:** Ensure all scripts `cd` to their current directory correctly ([5362c3b](https://github.com/kikiutils/eslint-config/commit/5362c3b))
- Set `--max-warnings=0` for `lint` and `lint:fix` ([bffe476](https://github.com/kikiutils/eslint-config/commit/bffe476))
- Upgrade dependencies ([b339660](https://github.com/kikiutils/eslint-config/commit/b339660))

### 🤖 CI

- Update test workflow ([1519e46](https://github.com/kikiutils/eslint-config/commit/1519e46))
- Update condition for uploading to Codecov in workflow job ([39851ac](https://github.com/kikiutils/eslint-config/commit/39851ac))

### ❤️ Contributors

- kiki-kanri

## v1.0.2

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.0.1...v1.0.2)

### 📖 Documentation

- Replace `%2F` with `/` in badge URLs in README ([4aaf916](https://github.com/kikiutils/eslint-config/commit/4aaf916))

### 🏡 Chore

- Ensure all scripts change to their own directory before execution ([9be5fbf](https://github.com/kikiutils/eslint-config/commit/9be5fbf))
- Update ignore files ([c81c294](https://github.com/kikiutils/eslint-config/commit/c81c294))
- Upgrade dependencies ([63273f9](https://github.com/kikiutils/eslint-config/commit/63273f9))
- Set `no-promise-executor-return` rule `allowVoid` to true ([eabe5a9](https://github.com/kikiutils/eslint-config/commit/eabe5a9))

### ❤️ Contributors

- kiki-kanri

## v1.0.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v1.0.0...v1.0.1)

### 💅 Refactors

- Apply css, sass, and scss rules only when CSS formatter is enabled ([2ea5506](https://github.com/kikiutils/eslint-config/commit/2ea5506))

### 📖 Documentation

- Update README badges urls ([499bc71](https://github.com/kikiutils/eslint-config/commit/499bc71))

### 🏡 Chore

- Add option to `upgrade-dependencies.sh` to clean `node_modules` and `pnpm-lock.yaml` before upgrading ([e542b14](https://github.com/kikiutils/eslint-config/commit/e542b14))
- Upgrade dependencies ([d3ee5a7](https://github.com/kikiutils/eslint-config/commit/d3ee5a7))

### ❤️ Contributors

- kiki-kanri

## v1.0.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.12.4...v1.0.0)

### 🚀 Enhancements

- Add `eslint-plugin-promise` plugin and rules ([2a95ca7](https://github.com/kikiutils/eslint-config/commit/2a95ca7))
- Set `no-promise-executor-return` and `require-await` rules ([ab0c4ba](https://github.com/kikiutils/eslint-config/commit/ab0c4ba))

### 🏡 Chore

- Upgrade dependencies ([cc5cf28](https://github.com/kikiutils/eslint-config/commit/cc5cf28))

### ❤️ Contributors

- kiki-kanri

## v0.12.4

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.12.3...v0.12.4)

### 🏡 Chore

- Update destructuring formatting rule to break lines only when more than two elements ([9df8d3a](https://github.com/kikiutils/eslint-config/commit/9df8d3a))

### ❤️ Contributors

- kiki-kanri

## v0.12.3

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.12.2...v0.12.3)

### 💅 Refactors

- Replace `Object.freeze` with `readonly` type definitions for constants and variables ([cedb5fe](https://github.com/kikiutils/eslint-config/commit/cedb5fe))

### 🏡 Chore

- Format script ([16ca049](https://github.com/kikiutils/eslint-config/commit/16ca049))
- Update file permissions after installing or updating dependencies ([d141f76](https://github.com/kikiutils/eslint-config/commit/d141f76))
- Add `--hideAuthorEmail` flag to bumplog command ([382091b](https://github.com/kikiutils/eslint-config/commit/382091b))
- Add typecheck command to package.json scripts ([2a1f7e0](https://github.com/kikiutils/eslint-config/commit/2a1f7e0))
- Rename `jest.config.js` to `jest.config.mjs` ([76371a1](https://github.com/kikiutils/eslint-config/commit/76371a1))
- Reorder lint, test, and build steps in release command ([b63dcb4](https://github.com/kikiutils/eslint-config/commit/b63dcb4))
- Disable `isolatedDeclarations` in tsconfig ([ed1636f](https://github.com/kikiutils/eslint-config/commit/ed1636f))
- Update `modify-files-permissions.sh` ([89f72e3](https://github.com/kikiutils/eslint-config/commit/89f72e3))
- Use self-published package only for `tailwindcss/classnames-order` rule, keep other tailwindcss rules from official packages ([ac9b00a](https://github.com/kikiutils/eslint-config/commit/ac9b00a))
- Upgrade dependencies ([568530f](https://github.com/kikiutils/eslint-config/commit/568530f))
- Add `ts-expect-error` to bypass TypeScript error caused by incorrect export in `@kikiutils/eslint-plugin-vue` ([713c49e](https://github.com/kikiutils/eslint-config/commit/713c49e))
- Update CHANGELOG ([92b8ff1](https://github.com/kikiutils/eslint-config/commit/92b8ff1))

### ✅ Tests

- Add pass test unit ([d7b98bd](https://github.com/kikiutils/eslint-config/commit/d7b98bd))

### 🤖 CI

- Add test github workflow config file ([dd421d1](https://github.com/kikiutils/eslint-config/commit/dd421d1))

### ❤️ Contributors

- kiki-kanri

## v0.12.2

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.12.1...v0.12.2)

### 🏡 Chore

- Set type to module in package.json and remove require-based exports configuration ([cf51b69](https://github.com/kikiutils/eslint-config/commit/cf51b69))

### ❤️ Contributors

- kiki-kanri

## v0.12.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.12.0...v0.12.1)

### 💅 Refactors

- Update import style for some modules ([7fbfa96](https://github.com/kikiutils/eslint-config/commit/7fbfa96))

### 📦 Build

- Enable sourcemap output ([91dfe34](https://github.com/kikiutils/eslint-config/commit/91dfe34))
- Include src folder in npm pack files list ([8502068](https://github.com/kikiutils/eslint-config/commit/8502068))

### 🏡 Chore

- Upgrade dependencies ([101f1a7](https://github.com/kikiutils/eslint-config/commit/101f1a7))
- Remove `dev` script from package.json ([a8fe03b](https://github.com/kikiutils/eslint-config/commit/a8fe03b))
- Format code ([6fb8340](https://github.com/kikiutils/eslint-config/commit/6fb8340))
- Set `sideEffects` to false in package.json ([b9e45e9](https://github.com/kikiutils/eslint-config/commit/b9e45e9))

### ❤️ Contributors

- kiki-kanri

## v0.12.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.11.1...v0.12.0)

### 🚀 Enhancements

- Add custom `vue/attributes-order` rule configuration ([bd09a74](https://github.com/kikiutils/eslint-config/commit/bd09a74))

### ❤️ Contributors

- kiki-kanri

## v0.11.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.11.0...v0.11.1)

### 🏡 Chore

- Change `max-len` rule from `error` to `warn` ([58c6ba2](https://github.com/kikiutils/eslint-config/commit/58c6ba2))

### ❤️ Contributors

- kiki-kanri

## v0.11.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.10.1...v0.11.0)

### 🚀 Enhancements

- Add a 120-character per line code length limit ([57258f4](https://github.com/kikiutils/eslint-config/commit/57258f4))

### 🏡 Chore

- Modify `perfectionist/sort-imports` rule options ([06561c1](https://github.com/kikiutils/eslint-config/commit/06561c1))

### ❤️ Contributors

- kiki-kanri

## v0.10.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.10.0...v0.10.1)

### 🏡 Chore

- Remove `vue/block-lang` rule usage ([650aee7](https://github.com/kikiutils/eslint-config/commit/650aee7))

### ❤️ Contributors

- kiki-kanri

## v0.10.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.9.0...v0.10.0)

### 🚀 Enhancements

- Add CSS formatting functionality ([0ca8b4e](https://github.com/kikiutils/eslint-config/commit/0ca8b4e))

### ❤️ Contributors

- kiki-kanri

## v0.9.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.8.3...v0.9.0)

### 🚀 Enhancements

- Configure additional Vue-related rules ([26a6d3d](https://github.com/kikiutils/eslint-config/commit/26a6d3d))

### 🏡 Chore

- Upgrade dependencies ([cbf87c8](https://github.com/kikiutils/eslint-config/commit/cbf87c8))

### ❤️ Contributors

- kiki-kanri

## v0.8.3

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.8.2...v0.8.3)

### 🏡 Chore

- Upgrade dependencies ([0d67bfd](https://github.com/kikiutils/eslint-config/commit/0d67bfd))
- Update repository URL ([e9505db](https://github.com/kikiutils/eslint-config/commit/e9505db))
- Add `--hideAuthorEmail` arg to build changelogen command ([766fab4](https://github.com/kikiutils/eslint-config/commit/766fab4))
- Remove dev-related dependencies and configurations ([24e0152](https://github.com/kikiutils/eslint-config/commit/24e0152))

### ❤️ Contributors

- kiki-kanri

## v0.8.2

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.8.1...v0.8.2)

### 🩹 Fixes

- Resolve incorrect module imports ([316ab77](https://github.com/kikiutils/eslint-config/commit/316ab77))

### ❤️ Contributors

- kiki-kanri

## v0.8.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.8.0...v0.8.1)

### 🏡 Chore

- Remove `vue/attributes-order` rule ([bfd234d](https://github.com/kikiutils/eslint-config/commit/bfd234d))

### ❤️ Contributors

- kiki-kanri

## v0.8.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.7.4...v0.8.0)

### 🚀 Enhancements

- Configure eslint rules ([7f13184](https://github.com/kikiutils/eslint-config/commit/7f13184))

### 🏡 Chore

- Upgrade dependencies and set `pnpm.onlyBuiltDependencies` in `package.json` ([b39c47c](https://github.com/kikiutils/eslint-config/commit/b39c47c))
- Replace `eslint-plugin-tailwindcss` with `@kikiutils/eslint-plugin-tailwindcss` ([bc8c0dd](https://github.com/kikiutils/eslint-config/commit/bc8c0dd))

### ❤️ Contributors

- kiki-kanri

## v0.7.4

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.7.3...v0.7.4)

### 🏡 Chore

- Upgrade dependencies ([c9530cd](https://github.com/kikiutils/eslint-config/commit/c9530cd))

### ❤️ Contributors

- kiki-kanri

## v0.7.3

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.7.2...v0.7.3)

### 🏡 Chore

- Set `node/prefer-global/process` rule to always ([167044b](https://github.com/kikiutils/eslint-config/commit/167044b))
- Upgrade dependencies ([4f6c847](https://github.com/kikiutils/eslint-config/commit/4f6c847))

### 🎨 Styles

- Format codes ([697500b](https://github.com/kikiutils/eslint-config/commit/697500b))

### ❤️ Contributors

- kiki-kanri

## v0.7.2

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.7.1...v0.7.2)

### 🏡 Chore

- Set `style/array-bracket-newline` and `style/array-element-newline` rules multiline to true ([149db56](https://github.com/kikiutils/eslint-config/commit/149db56))

### ❤️ Contributors

- kiki-kanri

## v0.7.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.7.0...v0.7.1)

### 🏡 Chore

- Update array element line break rule to break line if more than one element ([e0d4de5](https://github.com/kikiutils/eslint-config/commit/e0d4de5))
- Configure `style/object-curly-newline` rule ([2f43471](https://github.com/kikiutils/eslint-config/commit/2f43471))
- Set `vue/max-attributes-per-line` rule singleline to 1 ([3d2bca4](https://github.com/kikiutils/eslint-config/commit/3d2bca4))

### 🎨 Styles

- Format and lint codes ([4eb96bc](https://github.com/kikiutils/eslint-config/commit/4eb96bc))

### ❤️ Contributors

- kiki-kanri

## v0.7.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.6.1...v0.7.0)

### 🚀 Enhancements

- Add rules for vue file ([cf54c8c](https://github.com/kikiutils/eslint-config/commit/cf54c8c))

### 🏡 Chore

- Add prepack script to package.json ([f5cd7ed](https://github.com/kikiutils/eslint-config/commit/f5cd7ed))
- Upgrade dependencies ([a36726c](https://github.com/kikiutils/eslint-config/commit/a36726c))

### ❤️ Contributors

- kiki-kanri

## v0.6.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.6.0...v0.6.1)

### 🏡 Chore

- Set `nestedBinaryExpressions` to false in `style/no-extra-parens rule` ([707717a](https://github.com/kikiutils/eslint-config/commit/707717a))

### ❤️ Contributors

- kiki-kanri

## v0.6.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.5.0...v0.6.0)

### 🚀 Enhancements

- Add new perfectionist related sort rules ([2e546fe](https://github.com/kikiutils/eslint-config/commit/2e546fe))
- Add `style/no-extra-parens` rule ([b698063](https://github.com/kikiutils/eslint-config/commit/b698063))

### 🏡 Chore

- Remove `style/no-tabs` rule ([e1f807b](https://github.com/kikiutils/eslint-config/commit/e1f807b))
- Upgrade dependencies ([04c4c3f](https://github.com/kikiutils/eslint-config/commit/04c4c3f))
- Move `eslint-flat-config-utils` to devDependencies ([3b2bbd9](https://github.com/kikiutils/eslint-config/commit/3b2bbd9))
- Modify internalPattern setting in `perfectionist/sort-imports` rule ([201760f](https://github.com/kikiutils/eslint-config/commit/201760f))

### ❤️ Contributors

- kiki-kanri

## v0.5.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.4.1...v0.5.0)

### 🚀 Enhancements

- Update `sort-imports` rule `internalPattern` to include # prefix ([06ed0b6](https://github.com/kikiutils/eslint-config/commit/06ed0b6))

### 🏡 Chore

- ⚠️ Change indentation rule to 4 spaces ([d529ac3](https://github.com/kikiutils/eslint-config/commit/d529ac3))

### 🎨 Styles

- Format file ([05f49cc](https://github.com/kikiutils/eslint-config/commit/05f49cc))
- Format `build-development.mjs` ([3bbcc57](https://github.com/kikiutils/eslint-config/commit/3bbcc57))

#### ⚠️ Breaking Changes

- ⚠️ Change indentation rule to 4 spaces ([d529ac3](https://github.com/kikiutils/eslint-config/commit/d529ac3))

### ❤️ Contributors

- kiki-kanri

## v0.4.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.4.0...v0.4.1)

### 🏡 Chore

- Remove `style/newline-per-chained-call` rule ([d7dc160](https://github.com/kikiutils/eslint-config/commit/d7dc160))
- Configure `style/padding-line-between-statements` rule to require newline before enum ([33a1dac](https://github.com/kikiutils/eslint-config/commit/33a1dac))

### ❤️ Contributors

- kiki-kanri

## v0.4.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.3.1...v0.4.0)

### 🚀 Enhancements

- Configure `ts/consistent-generic-constructors` rule ([e9cf0da](https://github.com/kikiutils/eslint-config/commit/e9cf0da))

### 🏡 Chore

- Enable natural sort for `sort-keys-plus/sort-keys` rule ([a9f99a1](https://github.com/kikiutils/eslint-config/commit/a9f99a1))
- Configure most perfectionist/sort-related rules and remove sort-keys-plus plugin ([38432ed](https://github.com/kikiutils/eslint-config/commit/38432ed))
- Set `jsonc/sort-array-values` rule to natural sorting order ([842fa63](https://github.com/kikiutils/eslint-config/commit/842fa63))

### ❤️ Contributors

- kiki-kanri

## v0.3.1

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.3.0...v0.3.1)

### 🏡 Chore

- Enable top-level await and disable ts/no-redeclare rule ([429f533](https://github.com/kikiutils/eslint-config/commit/429f533))

### ❤️ Contributors

- kiki-kanri

## v0.3.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.2.0...v0.3.0)

### 🚀 Enhancements

- Add more style-related configurations ([e61dd4d](https://github.com/kikiutils/eslint-config/commit/e61dd4d))

### 🏡 Chore

- Modify lint scripts ([af152b0](https://github.com/kikiutils/eslint-config/commit/af152b0))

### ❤️ Contributors

- kiki-kanri

## v0.2.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/v0.1.0...v0.2.0)

### 🚀 Enhancements

- Add `style/member-delimiter-style` rule ([35e3a51](https://github.com/kikiutils/eslint-config/commit/35e3a51))

### 🩹 Fixes

- Correct incorrect URL in changelog ([6ef2007](https://github.com/kikiutils/eslint-config/commit/6ef2007))

### 🏡 Chore

- Add release script ([e8a298f](https://github.com/kikiutils/eslint-config/commit/e8a298f))

### ❤️ Contributors

- kiki-kanri

## v0.1.0

[compare changes](https://github.com/kikiutils/eslint-config/compare/4bf5b8b...v0.1.0)

### 🚀 Enhancements

- Add dev script and corresponding functionality ([1cf8a2e](https://github.com/kikiutils/eslint-config/commit/1cf8a2e))
- Add ESLint configuration ([32ed232](https://github.com/kikiutils/eslint-config/commit/32ed232))

### 🩹 Fixes

- Resolve type errors and set maximum class count per file to 1 ([4ca57dd](https://github.com/kikiutils/eslint-config/commit/4ca57dd))

### 🏡 Chore

- Add LICENSE file ([4bf5b8b](https://github.com/kikiutils/eslint-config/commit/4bf5b8b))
- Add `.gitignore` ([214526f](https://github.com/kikiutils/eslint-config/commit/214526f))
- Add required dependencies ([c812d1c](https://github.com/kikiutils/eslint-config/commit/c812d1c))
- Set required fields in package.json and add tsconfig.json ([2c174ab](https://github.com/kikiutils/eslint-config/commit/2c174ab))
- Add VSCode configuration file ([05bc764](https://github.com/kikiutils/eslint-config/commit/05bc764))
- Add build script ([60313da](https://github.com/kikiutils/eslint-config/commit/60313da))
- Add build and lint scripts ([1a78542](https://github.com/kikiutils/eslint-config/commit/1a78542))
- Enforce blank line after class and function definitions ([7fdcf24](https://github.com/kikiutils/eslint-config/commit/7fdcf24))
- Remove `lessOpinionated` setting when invoking antfu ([769db73](https://github.com/kikiutils/eslint-config/commit/769db73))
- Set exports, files and types fields in package.json ([5423418](https://github.com/kikiutils/eslint-config/commit/5423418))

### 🎨 Styles

- Format codes ([80469e1](https://github.com/kikiutils/eslint-config/commit/80469e1))

### ❤️ Contributors

- kiki-kanri
