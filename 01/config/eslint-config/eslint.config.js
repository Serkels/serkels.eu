//

/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "next/core-web-vitals",
    "turbo",
    "prettier",
  ],
  plugins: ["simple-import-sort", "testing-library"],
  rules: {},
};
