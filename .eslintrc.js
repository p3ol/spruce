module.exports = {
  extends: ['@poool/eslint-config-react'],
  overrides: [{
    files: ['tests/**/*.js'],
    env: {
      jest: true,
    },
    rules: {
      'react/display-name': 0,
    },
  }],
};
