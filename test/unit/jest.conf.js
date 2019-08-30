// jest.config.js
const {defaults} = require('jest-config');
module.exports = {
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'jsx', 'json', 'vue', 'ts', 'tsx'],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    snapshotSerializers: ['jest-serializer-vue'],    
    preset: 'ts-jest/presets/js-with-ts',
    transformIgnorePatterns: ["/node_modules/(?!(bootstrap-vue)/)"],
    roots: ["<rootDir>/client", "<rootDir>/server"],
    rootDir: "<rootDir>/../../../"
  };