export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/test/**/*.test.js"],
};
