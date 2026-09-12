import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@cifra-hub/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'node',
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'src/shared/ui/**/*.test.tsx'],
        },
      },
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          include: ['src/shared/ui/**/*.test.tsx'],
        },
      },
    ],
  },
});
