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
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest",{
      tsconfig: require('./tsconfig.json'),
      babelConfig: require('./babel.config.js'),
    }]
  },
  globals: {
     TextEncoder: require("util").TextEncode,
     TextDecoder: require("util").TextDecoder
 },
 transformIgnorePatterns: ['<rootDir>/node_modules/'],
};