const fs = require("fs");

let appEnv = process.env.APP_ENV || "production";
let appConfig;

if (process.env.APP_ENV !== "production") {
  try {
    const envFile = fs.readFileSync("./environments.json");
    appConfig = JSON.parse(envFile);
  } catch (err) {
    throw new Error(
      `@slytrunk/app-env: No environments.json found. Did you include the babel plugin?`
    );
  }
}

function setEnvironment(environment) {
  appEnv = environment;
}

function getEnvironmentOptions() {
  return Object.keys(appConfig || {});
}

function getEnv(key) {
  return appConfig[appEnv][key];
}

module.exports = {
  getEnv,
  getEnvironmentOptions,
  setEnvironment,
};
