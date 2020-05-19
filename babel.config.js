module.exports = {
  presets: ['@babel/env'],
  overrides: [{
    test: 'packages/spruce/**/*',
    presets: [
      ['@babel/env', {
        corejs: 3,
        targets: {
          // node: 'current',
          browsers: ['last 2 versions'],
        },
        useBuiltIns: 'usage',
      }],
      '@babel/react',
    ],
    plugins: [
      ['@babel/transform-runtime', {
        corejs: 3,
        regenerator: true,
      }],
    ],
  }],
};
