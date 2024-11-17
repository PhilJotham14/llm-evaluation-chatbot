module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // for TypeScript
        '^.+\\.(js|jsx)$': 'babel-jest', // for JavaScript with Babel
    },
    transformIgnorePatterns: [
      'node_modules/(?!(your-es6-package))', // Add if you're using modern JS libraries that need transpiling
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  };
  