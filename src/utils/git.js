import execa from "execa";
async function initGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

async function gitAddandCommit(options, message = "Initial commit 🎉") {
  const movingFilestoStaging = await execa("git", ["add", "."], {
    cwd: options.targetDirectory,
  });
  const makingInitialCommit = await execa("git", ["commit", "-m", message], {
    cwd: options.targetDirectory,
  });
  if (movingFilestoStaging.failed || makingInitialCommit.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}
export { gitAddandCommit, initGit };
