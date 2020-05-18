const webpackAsync = require('webpack');
const spawnAsync = require('cross-spawn');

const webpack = (...args) => new Promise((resolve, reject) => {
  webpackAsync(...args, (err, stats) => {
    if (err) {
      reject(err);
    } else if (stats.hasErrors()) {
      reject(stats.toJson().errors.join('\n\n'));
    } else {
      resolve(stats);
    }
  });
});

const spawn = (...args) =>
  new Promise((resolve, reject) => {
    let result = '';
    let error = '';
    const req = spawnAsync(...args);
    req.stdout && req.stdout.on('data', data => { result += data; });
    req.stderr && req.stderr.on('data', data => { error += data; });
    req.on('close', code => code !== 0 ? reject(error, code) : resolve(result));
    req.on('error', err => reject(err));
  });

const debug = (spruceConfig = {}, ...args) => {
  spruceConfig.debug !== false && console.log('🌲', ...args);
};

module.exports = {
  webpackAsync,
  webpack,
  spawnAsync,
  spawn,
  debug,
};
