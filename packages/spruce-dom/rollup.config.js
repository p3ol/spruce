import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import externals from 'rollup-plugin-node-externals';

const INPUT_FILE = './lib/index.js';
const OUTPUT_DIR = './dist';
const FORMATS = ['umd', 'cjs', 'esm'];

const defaultPlugins = [
  externals(),
  babel({
    exclude: /node_modules/,
    runtimeHelpers: true,
  }),
  resolve({ preferBuiltins: true }),
  commonjs(),
  terser(),
];

const defaultExternals = [
  'react',
  'react-dom',
];

const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

export default FORMATS.map(f => ({
  input: INPUT_FILE,
  plugins: [
    ...defaultPlugins,
  ],
  external: defaultExternals,
  output: {
    name: 'spruce-dom',
    file: path.join(OUTPUT_DIR, `lib.${f}.js`),
    format: f,
    sourcemap: true,
    globals: defaultGlobals,
  },
}));
