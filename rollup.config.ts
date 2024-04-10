import _eslint from '@rollup/plugin-eslint';
import _typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild, { Options as EsbuildOptions } from 'rollup-plugin-esbuild';
import outputSize from 'rollup-plugin-output-size';
import pkg from './package.json' with { type: 'json' };

// NOTE: remove once import errors are fixed for their respective packages
const eslint = _eslint as unknown as typeof _eslint.default;
const typescript = _typescript as unknown as typeof _typescript.default;

// skip sourcemap and umd unless production
// const PROD = process.env.NODE_ENV !== 'development';
const WATCH = process.env.ROLLUP_WATCH === 'true';
const input = 'src/index.ts';

function build(options: EsbuildOptions = {}) {
  return esbuild({ target: 'esnext', ...options });
}

function defineConfig(options: (false | RollupOptions)[]) {
  return options.filter((options): options is RollupOptions => !!options);
}

export default defineConfig([
  {
    input,
    output: { file: pkg.module, format: 'esm', exports: 'named' },
    plugins: [build(), outputSize()]
  },
  { input, output: { file: pkg.types }, plugins: [dts(), outputSize()] },
  WATCH && {
    input,
    watch: { skipWrite: true },
    plugins: [eslint(), typescript()]
  }
]);
