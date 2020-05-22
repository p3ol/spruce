const SpruceWebpackConfig = require('../../packages/spruce-webpack-config');

module.exports = (() => {
  if (process.env.NODE_ENV === 'development') {
    return SpruceWebpackConfig({
      publicDir: './',
      entry: './src/index.js',
      templateEntry: './src/index.ejs',
      templateOutput: 'index.html',
      devServer: {
        host: 'localhost',
        port: 8000,
      },
    });
  }

  return SpruceWebpackConfig({
    entry: './src/index.js',
    templateEntry: './src/index.ejs',
  });
})();
