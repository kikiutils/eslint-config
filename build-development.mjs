import { build } from 'esbuild';
import { rm } from 'node:fs/promises';

const outDir = './dist';

(async () => {
    await rm(outDir, { force: true, recursive: true });
    await build({
        bundle: false,
        entryPoints: ['./src/**/*.ts'],
        format: 'esm',
        outExtension: { '.js': '.mjs' },
        outdir: outDir,
        platform: 'node',
        target: 'esnext',
    });
})();
