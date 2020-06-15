const fs = require('fs');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = ({
  entry = './src/index.js',
  outputDir = './dist',
  publicDir = './public',
  sitemapsEntry = './src/sitemaps',
  sitemapsOutput = './sitemaps',
  robotsEntry = './src/robots.txt',
  robotsOutput = './robots.txt',
  templateEntry = './index.ejs',
  templateOutput = '../views/default/index.ejs',
  statsOutput = '../stats.json',
  devServer = false,
  privateKeyPath = './key.pem',
  certificatePath = './cert.pem',
} = {}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const baseConfig = {
    entry,
    target: 'web',
    context: path.resolve(),
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'source-map' : false,
    parallelism: 4,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
        }, {
          test: /\.(gif|svg|jpg|png|eot|ttf|woff|woff2)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: 'assets/[hash].[ext]',
          },
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: sitemapsEntry, to: sitemapsOutput, noErrorOnMissing: true },
          { from: robotsEntry, to: robotsOutput, noErrorOnMissing: true },
        ],
      }),
      new FriendlyErrorsWebpackPlugin({ clearConsole: isDevelopment }),
      new StatsWriterPlugin({
        filename: statsOutput,
        transform: data => {
          return JSON.stringify({
            bundles: data.assetsByChunkName,
          });
        },
      }),
    ],
    optimization: !isDevelopment ? {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    } : {},
    output: {
      publicPath: './',
      path: path.resolve(path.join(outputDir, publicDir)),
      libraryTarget: 'umd2',
      globalObject: 'this',
      filename: '[name].[hash].js',
    },
    devServer: devServer ? {
      host: devServer.host,
      port: devServer.port,
      publicPath: '/',
      quiet: true,
      historyApiFallback: true,
      hot: true,
      open: true,
      https: devServer.https ? {
        key: fs.readFileSync(path.resolve(privateKeyPath)),
        cert: fs.readFileSync(path.resolve(certificatePath)),
      } : undefined,
    } : undefined,
  };

  baseConfig.plugins = baseConfig.plugins.concat(
    typeof templateEntry === 'string' ? [
      new HtmlWebpackPlugin({
        filename: templateOutput,
        inject: true,
        template: templateEntry,
      }),
    ] : Object.entries(templateEntry).map(([k, v]) =>
      new HtmlWebpackPlugin({
        filename: `../views/${k}/index.ejs`,
        chunks: [k],
        inject: true,
        template: require.resolve('raw-loader') + '!' + path.resolve(v),
      }),
    )
  );

  return baseConfig;
};
