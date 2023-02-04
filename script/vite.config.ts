import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            },
            output: {
                entryFileNames: '[name].js',
            },
            external: [
                'inquirer',
                'fs/promises',
                '@prisma/client',
                'node-fetch',
                'jsdom',
                'node:path',
                'puppeteer',
            ],
        },
        minify: false,
        target: 'esnext',
        reportCompressedSize: false,
    },
});
