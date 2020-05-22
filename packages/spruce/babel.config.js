module.exports = {
  presets: [
    ['@babel/env', {
      corejs: 3,
      targets: {
        node: 'current',
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
};
