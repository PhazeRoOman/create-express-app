import chalk from "chalk";
import fs from "fs/promises";
import { constants, existsSync } from "fs";
import ncp from "ncp";
import cpFile from "cp-file";
import path from "path";
import { promisify } from "util";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import mkdirp from "mkdirp";
import os from "os";
import {
  initHusky,
  gitAddandCommit,
  initGit,
  installEslintAndPrettier,
  copyPrettierAndESlint,
  installJest,
  copyJestTypeScriptConfig,
} from "./utils";
const copy = promisify(ncp);
const WINDOWS = os.platform() === "win32";

async function copyTemplateFiles(options) {
  return Promise.all([
    copy(options.templateDirectory, options.targetDirectory, {
      clobber: false,
    }),
    cpFile(
      `${options.staticDirectory}/.gitignore-template`,
      `${options.targetDirectory}/.gitignore`
    ),
  ]);
}

async function createDirectory(options) {
  return mkdirp(`./${options.projectName}`);
}
async function updatePackageJson(options) {
  const fileContent = JSON.parse(
    (await fs.readFile(`./${options.projectName}/package.json`)).toString(
      "utf-8"
    )
  );
  fileContent["name"] = options.projectName.replace(" ", "-");
  await fs.writeFile(
    `./${options.projectName}/package.json`,
    JSON.stringify(fileContent, null, 4)
  );
}
export async function createProject(options) {
  options = {
    ...options,
    targetDirectory:
      options.targetDirectory || `${process.cwd()}/${options.projectName}`,
  };

  const fullPathName = new URL(import.meta.url).pathname;
  let templateDir = path.resolve(
    fullPathName.substring(fullPathName.indexOf("/")),
    "../../templates",
    options.template.toLowerCase()
  );
  let staticDir = path.resolve(
    fullPathName.substring(fullPathName.indexOf("/")),
    "../../static"
  );
  if (WINDOWS) {
    templateDir = templateDir.replace(/^(\w:\\)(\w:\\)/, "$2");
    staticDir = staticDir.replace(/^(\w:\\)(\w:\\)/, "$2");
  }
  options.templateDirectory = templateDir;
  options.staticDirectory = staticDir;

  try {
    await fs.access(templateDir, constants.R_OK);
  } catch (err) {
    console.log({ err });
    console.error("%s Invalid template name", chalk.red.bold("[ERROR]"));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: "Create project directory",
      task: () => createDirectory(options),
    },
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Update package.json info",
      task: () => updatePackageJson(options),
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automatically install dependencies"
          : undefined,
    },
    {
      title: "Install static analysis tools",
      task: async () => {
        await installEslintAndPrettier({
          workingDirectory: options.targetDirectory,
          typescript: options.template.toLowerCase() === "typescript",
        });
        await copyPrettierAndESlint(options);
      },
      skip: () =>
        !options.staticAnalysis
          ? "Pass --linters to automatically add Eslint &pPrettier default configs"
          : undefined,
    },
    {
      title: "Setting up husky",
      task: async () => {
        await initHusky(options);
        if (WINDOWS && existsSync(`${options.targetDirectory}/6`)) {
          await fs.rm(`${options.targetDirectory}/6`);
        }
      },
      skip: () => {
        return !(options.git && options.staticAnalysis && options.husky)
          ? "The repository has to be a git repository with default ESlint and prettier configs"
          : undefined;
      },
    },
    {
      title: "Setting up Jest and copying its config file",
      task: async () => {
        await installJest({
          workingDirectory: options.targetDirectory,
          typescript: options.template.toLowerCase() === "typescript",
        });
        await copyJestTypeScriptConfig(options);
      },
      enabled: () => options.jest,
    },
    {
      title: "Making first commit",
      task: () => gitAddandCommit(options),
      enabled: () => options.git,
    },
  ]);
  try {
    await tasks.run();
  } catch (error) {
    console.error(
      "%s There was an unknown issue, please report this problem",
      chalk.red.bold("[ERROR]")
    );
    process.exit(1);
  }

  console.log("%s Project is ready, Enjoy !", chalk.green.bold("[DONE]"));
  return true;
}
