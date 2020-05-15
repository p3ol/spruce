const webpackSync = require('webpack');

const webpack = (...args) => new Promise((resolve, reject) => {
  webpackSync(...args, (err, stats) => {
    if (err) {
      reject(err);
    } else if (stats.hasErrors()) {
      reject(stats.toJson().errors.join('\n\n'));
    } else {
      resolve(stats);
    }
  });
});

const debug = (spruceConfig = {}, ...args) => {
  spruceConfig.debug !== false && console.log(...args);
};

module.exports = {
  webpackSync,
  webpack,
  debug,
};
