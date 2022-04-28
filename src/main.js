import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import mkdirp from "mkdirp";
import {
  initHusky,
  gitAddandCommit,
  initGit,
  installEslintAndPrettier,
  copyPrettierAndESlint,
} from "./utils";
// import {
//   installEslintAndPrettier,
//   copyPrettierAndESlint,
// } from "./utils/static-analysis";
const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function createDirectory(options) {
  return mkdirp(`./${options.projectName}`);
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory:
      options.targetDirectory || `${process.cwd()}/${options.projectName}`,
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templates",
    options.template.toLowerCase()
  );
  const staticDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../static"
  );
  options.templateDirectory = templateDir;
  options.staticDirectory = staticDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
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
          ? "Pass --install to automatically install dependencies"
          : undefined,
    },
    {
      title: "Setting up husky",
      task: () => initHusky(options),
      enabled: () => options.husky,
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
