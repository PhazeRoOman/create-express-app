import execa from "execa";
async function initHusky(options) {
  const result = await execa("npx", ["mrm@2 lint-staged"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize Husky"));
  }
  return;
}
export { initHusky };
