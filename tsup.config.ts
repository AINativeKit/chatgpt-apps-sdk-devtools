import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@ainativekit/ui'],
  treeshake: true,
  injectStyle: true, // Inject CSS into the bundle
  esbuildOptions(options) {
    options.jsx = 'automatic';
  }
});