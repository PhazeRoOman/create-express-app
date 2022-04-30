import { install } from "pkg-install";
import cpFile from "cp-file";

async function installEslintAndPrettier({ workingDirectory, typescript }) {
  let dependencies = {
    eslint: undefined,
    "eslint-config-prettier": undefined,
    "eslint-plugin-prettier": undefined,
    prettier: undefined,
  };
  if (typescript) {
    dependencies = {
      ...dependencies,
      "@typescript-eslint/eslint-plugin": undefined,
      "@typescript-eslint/parser": undefined,
    };
  }
  return install(dependencies, {
    cwd: workingDirectory,
    dev: true,
  });
}

async function copyPrettierAndESlint(options) {
  const filesToCopy = [
    {
      src: `${options.staticDirectory}/.prettierrc`,
      dst: `${options.targetDirectory}/.prettierrc`,
    },
  ];
  if (options.template.toLowerCase() === "typescript") {
    filesToCopy.push({
      src: `${options.staticDirectory}/.eslintrc-typescript.json`,
      dst: `${options.targetDirectory}/.eslintrc.json`,
    });
  } else {
    filesToCopy.push({
      src: `${options.staticDirectory}/.eslintrc-javascript.js`,
      dst: `${options.targetDirectory}/.eslintrc.js`,
    });
  }

  return Promise.all(filesToCopy.map((file) => cpFile(file.src, file.dst)));
}

export { installEslintAndPrettier, copyPrettierAndESlint };
