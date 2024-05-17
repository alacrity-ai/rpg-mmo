import { defineConfig } from 'vite';

export default defineConfig({
  root: './public',
  build: {
    outDir: '../dist',
  },
  server: {
    open: process.env.NODE_ENV !== 'production',
    port: 8000,
    host: '0.0.0.0'
  },
});
