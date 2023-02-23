import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        commonjsOptions: {
            transformMixedEsModules: true, // Enable @walletconnect/web3-provider which has some code in CommonJS
        },
        // rollupOptions: {
        //     plugins: [
        //         // @ts-ignore
        //         inject({
        //             global: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'global'],
        //             process: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'process'],
        //             Buffer: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'Buffer'],
        //         }),
        //     ],
        // },
        outDir: 'build',
    },
    // resolve: {
    //     alias: {
    //         buffer: 'buffer/',
    //     },
    // },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis',
            },
            // Enable esbuild polyfill plugins
            // plugins: [
            //     NodeGlobalsPolyfillPlugin({
            //         process: true,
            //         buffer: true,
            //     }),
            //     NodeModulesPolyfillPlugin(),
            // ],
        },
    },
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
})
