let appEnv = process.env.APP_ENV || "production";
let appConfig;

if (process.env.APP_ENV !== "production") {
  try {
    appConfig = require("../../../.env.json");
  } catch (err) {
    throw new Error(
      `@slytrunk/app-env: No .env.json found. Did you include the babel plugin?`
    );
  }
}

function getEnvironment() {
  return appEnv;
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
