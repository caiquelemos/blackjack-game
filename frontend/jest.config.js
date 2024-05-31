export default {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif)$": "<rootDir>/test/__mocks__/fileMock.js",
    "^bootstrap$": "<rootDir>/test/__mocks__/bootstrap.js",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.js"],
  testEnvironment: "jest-environment-jsdom",
};
