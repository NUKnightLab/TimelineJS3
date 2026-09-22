const path = require('path');
const { defineConfig } = require('vite');
const { viteStaticCopy } = require('vite-plugin-static-copy');

// The main CSS (and its icon font url()s) is compiled independently by
// tasks/compile_less.js, the same way theme/font CSS already is - see
// RELEASING.md / vite.config.js history for why. Treat the LESS import in
// src/js/index.js as a no-op for our own dist/ build so Vite doesn't try
// (and fail) to resolve those url()s itself.
function ignoreLessImports() {
    return {
        name: 'ignore-less-imports',
        enforce: 'pre',
        resolveId(id) {
            if (id.endsWith('.less')) {
                return '\0ignored-less:' + id;
            }
            return null;
        },
        load(id) {
            if (id.startsWith('\0ignored-less:')) {
                return 'export default {};';
            }
            return null;
        }
    };
}

module.exports = defineConfig(({ command }) => ({
    root: path.resolve(__dirname, 'src/template'),
    server: {
        host: true,
        allowedHosts: true,
        open: true
    },
    plugins: [
        // Only during `vite build`: in dev, src/js/index.js's own LESS
        // import flows through Vite's native pipeline instead, giving CSS
        // HMR for free (see index.html's comment).
        ...(command === 'build' ? [ignoreLessImports()] : []),
        viteStaticCopy({
            targets: [
                { src: path.resolve(__dirname, 'src/js/language/locale/*.json'), dest: 'js/locale', rename: { stripBase: true } },
                { src: path.resolve(__dirname, 'src/embed/*'), dest: 'embed', rename: { stripBase: true } },
                // Dev only: the CSS Vite injects via <style> resolves its
                // relative icon url()s against the page URL, not the source
                // file, so the icons need to be servable at /icons/*. Build
                // gets them at dist/css/icons/ via tasks/compile_less.js
                // instead (matching where dist/css/timeline.css expects them).
                ...(command !== 'build' ? [
                    { src: path.resolve(__dirname, 'src/css/icons/tl-icons.*'), dest: 'icons', rename: { stripBase: true } }
                ] : [])
            ]
        })
    ],
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'src/js/index.js'),
            name: 'TL', // https://vite.dev/guide/build.html#library-mode
            formats: ['iife']
        },
        rollupOptions: {
            output: {
                entryFileNames: 'js/timeline.js'
            }
        }
    }
}));
