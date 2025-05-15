import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // default but good to be explicit
  },
  server: {
    port: 5173, // for local dev
  },
  preview: {
    port: 4173, // used when previewing the prod build
  },
});
