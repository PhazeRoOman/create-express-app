import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
import boxen from "boxen";
import chalk from "chalk";
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "--name": String,
      "--linters": Boolean,
      "--husky": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
      "-n": "--name",
      "-h": "--husky",
    },
    {
      //slice(2) because we don't need the first two args
      argv: rawArgs.slice(2),
    }
  );
  return {
    template: args._[0],
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    staticAnalysis: args["--linters"] || false,
    runInstall: args["--install"] || false,
    projectName: args["--name"] || "",
    husky: args["--husky"] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "JavaScript";
  const defaultProjectName = "new-project";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
      projectName: options.projectName || defaultProjectName,
    };
  }

  const questions = [];
  if (!options.projectName) {
    questions.push({
      type: "input",
      name: "projectName",
      message: "What should you name your project?",
      default: "project name",
    });
  }
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use?",
      choices: ["JavaScript", "TypeScript"],
      default: defaultTemplate,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }

  if (!options.staticAnalysis) {
    questions.push({
      type: "confirm",
      name: "staticAnalysis",
      message: "Do you wish to include ESlint and prettier default configs?",
      default: false,
    });
  }

  if (!options.husky) {
    questions.push({
      type: "confirm",
      name: "husky",
      message: "Do you wish to setup Husky for git hooks?",
      default: false,
    });
  }

  if (!options.runInstall) {
    questions.push({
      type: "confirm",
      name: "runInstall",
      message: "Do you want to install npm dependencies?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    runInstall: options.runInstall || answers.runInstall,
    projectName: options.projectName || answers.projectName,
    staticAnalysis: answers.staticAnalysis,
    husky: (options.husky || answers.husky) && answers.staticAnalysis,
  };
}

export async function cli(args) {
  console.log(
    boxen(
      chalk
        .hex("#50c9f5")
        .bold(
          "Welcome to Create Express App,\nFollow these steps to setup your project"
        ),
      {
        textAlignment: "center",
        titleAlignment: "center",
        padding: 1,
        title: "PhazeRo",
        margin: 1,
        borderColor: "#4493ff",
        borderStyle: "double",
      }
    ) + "\n"
  );
  console.log(
    chalk.hex("#edf2ff")(
      "Author: Yacine BENKAIDALI <yacine.benkaidali@phaze.ro>"
    ),
    "\n"
  );
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
  console.log("\n" + chalk.hex("#edf2ff")("Happy coding !"));
}
