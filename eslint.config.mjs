import { antfu } from '@antfu/eslint-config';

// eslint-disable-next-line antfu/no-import-dist
import { createBaseConfigs } from './dist/base.js';
// eslint-disable-next-line antfu/no-import-dist
import { createVsCodeJsonConfigs } from './dist/json.js';

export default antfu(
    {
        type: 'lib',
        typescript: true,
    },
    createBaseConfigs(),
    createVsCodeJsonConfigs(),
    { rules: { 'ts/explicit-function-return-type': 'off' } },
);
