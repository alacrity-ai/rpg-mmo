import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  root: './public',
  build: {
    outDir: '../editor-dist',
    rollupOptions: {
      input: './public/editor.html'
    }
  },
  server: {
    open: '/editor.html',
    port: 8002, // Different port for Vite development server
    host: '0.0.0.0'
  }
});
