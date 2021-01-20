let appEnv = process.env.APP_ENV || "production";
let appConfig;

try {
  appConfig = require("./environments.json");
} catch (err) {
  if (process.env.APP_ENV !== "production") {
    throw new Error(
      `@slytrunk/app-env: No environments.json found. Did you include the babel plugin?`
    );
  }
}

function setEnvironment(environment) {
  appEnv = environment;
}

function getEnvironmentOptions() {
  return Object.keys(appConfig);
}

function getEnv(key) {
  return appConfig[appEnv][key];
}

module.exports = {
  getEnv,
  getEnvironmentOptions,
  setEnvironment,
};
