import {Options} from 'tsup'

export const tsup: Options = {
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  watch: false,
  external: ['react', 'react-dom'],
  ignoreWatch: ['**/node_modules/**'],
  esbuildOptions: (options) => {
    options.footer = {
        js: `module.exports = module.exports.default;`,
    }
  }
}