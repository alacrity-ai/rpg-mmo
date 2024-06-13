import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  root: './public',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: './public/index.html',
      }
    }
  },
  server: {
    open: process.env.NODE_ENV !== 'production',
    port: 8000,
    host: '0.0.0.0'
  }
});
