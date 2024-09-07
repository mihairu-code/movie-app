import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src', // Указываем, что корнем приложения будет папка src
  build: {
    outDir: '../dist', // Указываем выходную папку
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'), // Указываем новый путь к index.html
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
