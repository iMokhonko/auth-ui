import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  define: {
    'process.env': {
      // You can define your environment variables here.
      // For example, you might want to read them from an .env file or directly hardcode them.
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      BASE_URL: JSON.stringify(process.env.BASE_URL),
    }
  },
  
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})