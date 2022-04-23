import arg from "arg";
import inquirer from "inquirer";
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
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
    runInstall: args["--install"] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "JavaScript";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
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

  if (!options.runInstall) {
    questions.push({
      type: "confirm",
      name: "install",
      message: "Do you want to install npm dependencies?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    runInstall: options.runInstall || answers.install,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  console.log(options);
}
