import { install } from "pkg-install";
import cpFile from "cp-file";

async function installJest({ workingDirectory, typescript }) {
  let dependencies = {
    jest: undefined,
  };
  if (typescript) {
    dependencies = {
      ...dependencies,
      "@types/jest": undefined,
      "ts-jest": undefined,
    };
  }
  return install(dependencies, {
    cwd: workingDirectory,
    dev: true,
  });
}
async function copyJestTypeScriptConfig(options) {
  if (options.template.toLowerCase() === "typescript") {
    const jestConfig = {
      src: `${options.staticDirectory}/ts-jest.config.js`,
      dst: `${options.targetDirectory}/jest.config.js`,
    };

    return cpFile(jestConfig.src, jestConfig.dst);
  }
  return;
}
export { installJest, copyJestTypeScriptConfig };
