module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/config/enzyme.js',
  ],
};
