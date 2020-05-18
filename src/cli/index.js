#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const help = require('command-line-usage');
const yargs = require('yargs');
const build = require('./build');
const install = require('./install');
const pkg = require('../../package.json');

const argv = yargs
  .boolean(['version', 'v', 'help', 'h', 'npm', 'n']).argv;

const usage = [{
  header: chalk.green.bold('spruce'),
  content: '🌲 A React SSR toolbelt for your everyday life',
}, {
  header: chalk.underline.bold('Usage'),
  content: [
    `% ./node_modules/.bin/spruce <${chalk.underline('command')}>`,
  ],
}, {
  header: 'Commands',
  content: [
    chalk.underline('install') + ' -> Install the needed peer dependencies ' +
      'to run your server after build',
    chalk.underline('build') + ' -> Build your SSR server for production use',
    chalk.underline('serve') + ' -> Run your SSR server for dev purposes',
  ],
}, {
  header: 'Options',
  optionList: [{
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Get some help running spruce',
  }, {
    name: 'version',
    alias: 'v',
    type: Boolean,
    description: 'Display package version \n',
  }, {
    name: 'service',
    alias: 's',
    type: String,
    description: 'Only build/serve some services',
  }, {
    name: 'npm',
    alias: 'n',
    type: Boolean,
    description: 'Install dependencies using npm instead of yarn',
  }],
}];

if (argv.version || argv.v) {
  console.log(`v${pkg.version}`);
  process.exit(0);
}

if (argv.help || argv.h || !argv._[0]) {
  console.log(help(usage));
}

(async () => {
  const configPath = path.resolve('spruce.config.js');
  let userConfig = {};

  if (await fs.exists(configPath)) {
    const userConfigModule = require(configPath);
    userConfig = userConfigModule.default || userConfigModule;
  }

  switch (argv._[0]) {
    case 'install':
      await install(userConfig, argv);
      break;
    case 'build':
      await build(userConfig, argv);
      break;
  }
})();
