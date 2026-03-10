import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    sourcemap: true
  },
  base: '/dasf-toolset/',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173,
    open: true
  },
  plugins: [react()]
});
