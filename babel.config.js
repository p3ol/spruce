module.exports = {
  env: {
    tests: {
      presets: ['@babel/env', '@babel/react'],
      plugins: [
        ['@babel/transform-runtime', {
          regenerator: true,
        }],
      ],
    },
  },
};
