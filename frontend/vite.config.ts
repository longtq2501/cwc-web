import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: true, // Cho phép Docker truy cập
      port: 3000,
      watch: {
        usePolling: true, // Sửa lỗi không nhận thay đổi file trên Docker Windows
      },
      proxy: {
        '/api': {
          target: 'http://backend:8000',
          changeOrigin: true,
          secure: false,
        },
        '/storage': {
          target: 'http://backend:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
