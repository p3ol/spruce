const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const { webpack, debug } = require('./utils');
const webpackConfig = require('./webpack.config');

module.exports = async (spruceConfig = {}) => {
  if (!spruceConfig.services.length) {
    console.error(chalk.red('You should have at least one service defined.'));
    process.exit(1);
  }

  if (spruceConfig.services.filter(s => !s.name).length > 1) {
    console.error(chalk.red(
      'You should not have more than one unnamed service.'
    ));
    process.exit(1);
  }

  const outputDir = path.resolve(spruceConfig.outputDir || './dist');
  if (await fs.exists(outputDir)) {
    debug(spruceConfig, 'Cleaning existing output dir...');
    await fs.remove(outputDir);
  }

  for (const service of spruceConfig.services) {
    service.name = service.name || 'default';

    if (service.server && service.bundle) {
      debug(spruceConfig, `Building service ${service.name}...\n`);

      try {
        const serviceWebpackConfig = webpackConfig({ service, spruceConfig });
        await webpack(serviceWebpackConfig);
      } catch (err) {
        console.error(err);
      }
    }
  }

  debug(spruceConfig, 'Building SSR enabled server...\n');

  const serverWebpackConfig = webpackConfig({
    service: { name: '_spruceCoreServer' },
    spruceConfig: {
      ...spruceConfig,
      webpackConfig: baseWebpackConfig => ({
        output: {
          path: path.resolve(spruceConfig.outputDir || './dist'),
          filename: 'server.js',
        },
      }),
    },
  });

  await webpack(serverWebpackConfig);
};
