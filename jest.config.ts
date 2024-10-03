export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/?(*.)+(spec|test).[t]s?(x)'],
  setupFilesAfterEnv: ["<rootDir>/test/__mocks__/setupTests.tsx"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
