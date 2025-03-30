module.exports = {
  preset: 'ts-jest', 
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: [
    '**/*.spec.ts',
    '**/**/*.test.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
};
