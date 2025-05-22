// eslint-disable-next-line antfu/no-import-dist
import { createConfig } from './dist/index.mjs';

export default createConfig('node', { type: 'lib' }).overrideRules({ 'ts/explicit-function-return-type': 'off' });
