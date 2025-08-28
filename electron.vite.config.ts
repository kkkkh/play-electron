import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
// import pkg from './package.json'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main/'),
        '@electron': resolve('src/electron/')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: {
      alias: {
        '@preload': resolve('src/preload/'),
        '@electron': resolve('src/electron/')
      }
    },
    plugins: [externalizeDepsPlugin({ exclude: ['@electron-toolkit/preload'] })],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        },
        external: ['electron'],
        // external: Object.keys(pkg.dependencies ?? {}),
        output: {
          entryFileNames: 'index.js',
          dir: resolve(__dirname, 'out/preload'),
          format: 'cjs'
        }
      },
      commonjsOptions: {
        include: [/node_modules/]
      }
    },
    ssr: {
      noExternal: ['@electron-toolkit/preload']
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // add electron specific tags
            isCustomElement: (tag) => ['webview'].includes(tag)
          }
        }
      })
    ]
  }
})
