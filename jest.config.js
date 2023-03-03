module.exports = {
  setupFiles: [
    // 'react-app-polyfill/jsdom'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest/setup.js'
  ],
  testEnvironment: 'jsdom',
}