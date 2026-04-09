// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        // If you add a background script later:
        // background: 'src/background.js'
      },
      output: {
        entryFileNames: `\[name].js`,
      }
    },
  },
});
