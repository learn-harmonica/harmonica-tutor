import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Default to production if NODE_ENV is not set
const isProduction = process.env.NODE_ENV !== 'development';

export default defineConfig({
  plugins: [react()],
  base: isProduction ? '/harmonica-tutor/' : '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['node_modules/**', 'tests/e2e/**']
  }
});
