import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import externals from 'rollup-plugin-node-externals';

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;
const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, 'lib/index.js');
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, 'dist');
const FORMATS = ['cjs', 'esm'];

const defaultPlugins = [
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    configFile: path.join(LERNA_ROOT_PATH, 'babel.config.js'),
  }),
  externals({
    deps: false,
    peerDeps: true,
    devDeps: true,
  }),
  resolve(),
  commonjs(),
  terser(),
];

const defaultExternals = [];

const defaultGlobals = {};

export default FORMATS.map(f => ({
  input: INPUT_FILE,
  plugins: [
    ...defaultPlugins,
  ],
  external: defaultExternals,
  output: {
    name: LERNA_PACKAGE_NAME,
    file: path.join(OUTPUT_DIR, `lib.${f}.js`),
    format: f,
    sourcemap: true,
    globals: defaultGlobals,
  },
}));
