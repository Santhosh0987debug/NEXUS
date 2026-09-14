import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/three/') || id.includes('three/')) return 'vendor-three';
            if (id.includes('@react-three/') || id.includes('three-stdlib')) return 'vendor-r3f';
            if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
            if (id.includes('/gsap/') || id.includes('/lenis/')) return 'vendor-gsap';
            return 'vendor';
          }
        },
      },
    },
  },
});