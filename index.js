const { writeFileSync } = require("fs");
const { resolve } = require("path");
const process = require("process");
const dotEnv = require("dotenv");

let envConfig;

const loadConfig = (path) => {
  if (!path) return {};
  const env = dotEnv.config({ path, silent: true });

  return env ? env.parsed : {};
};

const DEBUG = process.env.APP_ENV !== "production";

module.exports = function ({ types: t }) {
  const isLeftSideOfAssignmentExpression = (path) => {
    return (
      t.isAssignmentExpression(path.parent) && path.parent.left === path.node
    );
  };

  return {
    pre() {
      if (envConfig) return;
      const envs = this.opts.envs || {};

      if (DEBUG) {
        const environments = {};

        Object.keys(envs).forEach((env) => {
          if (env === "default") return;
          environments[env] = loadConfig(envs[env]);
        });

        writeFileSync(
          `${resolve(this.opts.projectRoot || process.cwd())}/.env.json`,
          JSON.stringify(environments)
        );
        envConfig = true;
      } else {
        const envFile = envs[process.env.APP_ENV || "production"];
        envConfig = Object.assign(
          {},
          loadConfig(envs.default || ""),
          loadConfig(envFile || "")
        );
      }
    },
    visitor: {
      ImportDeclaration: function (path, state) {
        const options = state.opts;

        if (options.moduleName === undefined) return;

        if (path.node.source.value === options.moduleName) {
          path.insertBefore(
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier("getEnv"),
                  t.identifier("getEnv")
                ),
              ],
              t.stringLiteral("@slytrunk/app-env/debug")
            )
          );

          path.node.specifiers.forEach(function (specifier, idx) {
            if (specifier.type === "ImportDefaultSpecifier") {
              throw path
                .get("specifiers")
                [idx].buildCodeFrameError(
                  "Import dotenv as default is not supported."
                );
            }

            const importedId = specifier.imported.name;
            const localId = specifier.local.name;

            // if (!envConfig.hasOwnProperty(importedId)) {
            //   throw path
            //     .get("specifiers")
            //     [idx].buildCodeFrameError(
            //       'Try to import dotenv variable "' +
            //         importedId +
            //         '" which is not defined in any ' +
            //         (defaultEnvFile || envFile) +
            //         " files."
            //     );
            // }

            const binding = path.scope.getBinding(localId);
            binding.referencePaths.forEach(function (refPath) {
              refPath.replaceWith(
                DEBUG
                  ? t.callExpression(t.identifier("getEnv"), [
                      t.stringLiteral(importedId),
                    ])
                  : t.valueToNode(envConfig[importedId])
              );
            });
          });

          path.remove();
        }
      },
      MemberExpression(path) {
        if (path.get("object").matchesPattern("process.env")) {
          const key = path.toComputedKey();
          if (
            t.isStringLiteral(key) &&
            !isLeftSideOfAssignmentExpression(path) &&
            key.value === "APP_ENV"
          ) {
            path.replaceWith(t.valueToNode(process.env[key.value]));
          }
        }
      },
    },
  };
};
