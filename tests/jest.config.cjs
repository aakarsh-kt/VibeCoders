/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  // Only run these integration tests
  testMatch: ["**/index.test.ts"],
  // Use ts-jest so Jest can understand TypeScript syntax like `let x: WebSocket`.
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json",
        // Don't block test execution on TS type errors in test code.
        diagnostics: false,
      },
    ],
  },
  // Keep output clean-ish
  verbose: false,
};
