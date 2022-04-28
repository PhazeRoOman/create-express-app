const eslintPrettier = require("eslint-config-prettier");
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest", // Allows the use of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"], // Uses the linting rules from @typescript-eslint/eslint-plugin
  plugins: ["eslint-plugin-prettier"],
  rules: {
    "prettier/prettier": "error",
    ...eslintPrettier.rules,
    "@typescript-eslint/no-unused-vars": "error",
    "no-async-promise-executor": "off",
  },
};
