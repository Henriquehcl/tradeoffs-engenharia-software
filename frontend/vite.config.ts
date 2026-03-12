/*
 * ===========================================================================
 * Vite Configuration - Frontend
 * ===========================================================================
 *
 * Configuração do Vite para o projeto React + TypeScript.
 *
 * - Plugin React para suporte a JSX e Fast Refresh
 * - Proxy de '/api' para o backend (localhost:3001) em desenvolvimento
 *   Isso permite que o frontend faça requisições sem CORS issues
 * - Servidor de desenvolvimento na porta 5173
 * ===========================================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy para o backend em desenvolvimento
    // Requisições /api/* são redirecionadas para o NestJS
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
