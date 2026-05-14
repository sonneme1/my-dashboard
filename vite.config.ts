import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
})
