import { defineConfig } from '@seasun/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/auth': {
            changeOrigin: true,
            target: 'http://localhost:8400',
            ws: true,
          },
          '/api': {
            changeOrigin: true,
            target: 'http://localhost:8400',
            ws: true,
          },
        },
      },
    },
  };
});
