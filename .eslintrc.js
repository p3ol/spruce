module.exports = {
  extends: ['@poool/eslint-config'],
  overrides: [{
    files: ['tests/**/*.js'],
    parser: 'babel-eslint',
    env: {
      jest: true,
    },
    rules: {
      'react/display-name': 0,
    },
  }],
};
