#!/usr/bin/env node

const fs = require("fs");
const { extname, resolve } = require("path");
const process = require("process");
const dotEnv = require("dotenv");

function loadConfig(path) {
  if (!path) return {};
  const env = dotEnv.config({ path, silent: true });

  return env ? env.parsed : {};
}

const environments = {};
const projectRoot = process.cwd();
const envDir = resolve(projectRoot, process.argv[2] || "config");

if (!fs.existsSync(envDir)) {
  throw new Error(`@slytrunk/app-env: missing env dir "${envDir}"`);
}

const envFiles = fs.readdirSync(envDir);

envFiles.forEach((envFile) => {
  const name = envFile.replace(extname(envFile), "");
  environments[name] = loadConfig(resolve(envDir, envFile));
});

fs.writeFileSync(
  resolve(projectRoot, ".env.json"),
  JSON.stringify(environments)
);

console.log(`> @slytrunk/app-env: .env.json built successfully`);
