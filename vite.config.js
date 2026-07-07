import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build into a separate folder so the delivered `dist/` (asset source of truth)
// is never overwritten by the production build.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    assetsInlineLimit: 0,
  },
});
