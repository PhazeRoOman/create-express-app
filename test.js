// const { execSync, exec } = require("child_process");
const execa = require("execa");
execa("npx", ["mrm@2", "lint-staged"]).then(({ stdout }) => {
  console.log({ stdout });
});
