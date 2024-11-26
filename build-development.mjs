import { build } from 'esbuild';
import { rm } from 'node:fs/promises';

const outDir = './dist';

(async () => {
    await rm(outDir, { force: true, recursive: true });
    await build({
        bundle: false,
        entryPoints: ['./src/**/*.ts'],
        format: 'esm',
        outdir: outDir,
        outExtension: { '.js': '.mjs' },
        platform: 'node',
        target: 'esnext',
    });
})();
