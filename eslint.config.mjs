import { antfu } from '@antfu/eslint-config';

// eslint-disable-next-line antfu/no-import-dist
import { createBaseConfigs } from './dist/base.js';

export default antfu(
    {
        type: 'lib',
        typescript: true,
    },
    createBaseConfigs(),
    { rules: { 'ts/explicit-function-return-type': 'off' } },
);
