/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  setupFiles: [
    // 'react-app-polyfill/jsdom'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest/setup.js'
  ],
  // transform: {
  //   "^.+\\.(ts|tsx)$": ["babel-jest"]
  // },
//  transformIgnorePatterns: ['<rootDir>/node_modules/'],
 testEnvironment: "node",
//  verbose: true
};