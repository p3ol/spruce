const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
// const autoprefixer = require('autoprefixer');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const { StatsWriterPlugin } = require('webpack-stats-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = ({ service, spruceConfig = {} } = {}) => {
  const isCoreServer = service.name === '_spruceCoreServer';
  const isDevelopment = process.env.NODE_ENV === 'development';

  let baseConfig = {
    entry: isCoreServer
      ? path.join(__dirname, '../server.js')
      : path.resolve(service.bundle),
    target: isCoreServer ? 'node' : 'web',
    externals: isCoreServer ? [nodeExternals({ modulesFromFile: true })] : [],
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'source-map' : false,
    parallelism: 4,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              require.resolve('@babel/preset-react'),
            ],
          },
        }, {
          test: /\.(gif|svg|jpg|png|eot|ttf|woff|woff2)$/,
          loader: require.resolve('file-loader'),
          options: {
            outputPath: isCoreServer ? './public/' : './',
            publicPath: '../',
            name: 'assets/[hash].[ext]',
          },
        },
      ],
    },
    plugins: [
      ...(isCoreServer ? [
        // new webpack.DefinePlugin({
        //   'process.env.SERVICES': ,
        // }),
        // new CopyPlugin([
        //   { from: './core/sitemaps', to: 'public/sitemaps' },
        //   { from: './core/robots.txt', to: 'public/robots.txt' },
        // ]),
      ] : [
        // new webpack.DefinePlugin({
        //   'process.env.ENV': JSON.stringify(getEnv(process.env.NODE_ENV)),
        // }),
        ...(isDevelopment ? [
          new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: true,
            template: path.resolve(service.server.view),
          }),
        ] : [
          new HtmlWebpackPlugin({
            filename: `views/${service.name}/index.ejs`,
            inject: true,
            template: require.resolve('raw-loader') +
              '!' + path.resolve(service.server.view),
            minify: {
              caseSensitive: true,
              collapseWhitespace: true,
              conservativeCollapse: true,
              collapseBooleanAttributes: true,
              removeCommentsFromCDATA: true,
              minifyJS: true,
            },
          }),
        ]),
        // new MiniCssExtractPlugin({
        //   filename: `${service}.[hash].css`,
        // }),
      ]),
      new FriendlyErrorsWebpackPlugin({ clearConsole: isDevelopment }),
    ],
    optimization: !isCoreServer && !isDevelopment ? {
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
        // new OptimizeCSSAssetsPlugin({}),
      ],
    } : {},
    output: {
      publicPath: './',
      path: path.join(
        path.resolve(spruceConfig.outputDir || './dist'), './public'),
      filename: `${service.name}.[hash].js`,
    },
  };

  const customConfig = spruceConfig.webpackConfig
    ? spruceConfig.webpackConfig(baseConfig) : {};

  baseConfig = {
    ...baseConfig,
    ...customConfig,
  };

  return baseConfig;
};
