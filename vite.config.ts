import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin as html } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import legacy from '@vitejs/plugin-legacy'

function getPlugins(command: string) {
  return [
    react({
      // https://github.com/vitejs/vite/tree/main/packages/plugin-react#babel-configuration
      babel: {
        configFile: true
      }
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      dts: 'auto-imports.d.ts',
      imports: ['react'],
    }),
    eslintPlugin({
      shouldLint: (path) => /\/src\/[^\?\r\n]*\.([tj]sx?)$/.test(path),
      eslintOptions: {
        cache: false
      }
    }),
    html({
      minify: command === 'build',
      inject: {
        data: {
          title: 'Vite App'
        }
      }
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}

// https://vitejs.dev/config/
export default ({ command }) => defineConfig({
  plugins: getPlugins(command),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      MAGIC_TOKEN: 'pk_live_BB95C8769C9B1295' // public web3.storage token
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  },
  server: {
    port: 8080,
    host: true,
    // For Windows WSL
    watch: {
      usePolling: true
    }
  },
  build: {
    sourcemap: false
  }
})
