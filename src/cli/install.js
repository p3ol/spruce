const path = require('path');
const { spawn, debug } = require('./utils');
const pkg = require('../../package.json');

module.exports = async (spruceConfig = {}, argv) => {
  debug(spruceConfig, 'Installing dependencies...');
  const dependencies = Object.keys(pkg.peerDependencies);

  const installer = argv.npm || argv.n ? 'npm' : 'yarn';
  const installCommands = argv.npm || argv.n ? ['install', '--save'] : ['add'];

  await spawn(
    installer,
    [...installCommands, ...dependencies],
    { stdio: 'inherit', cwd: path.resolve('.') }
  );
};
