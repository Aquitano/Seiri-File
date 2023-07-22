import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

await esbuild
    .build({
        entryPoints: ['./src/index.ts', './src/cli.ts'],
        outdir: 'dist',
        minify: true,
        bundle: true,
        platform: 'node',
        format: 'esm',
        sourcemap: true,
        treeShaking: true,
        plugins: [nodeExternalsPlugin()],
    })
    .catch(() => process.exit(1));
