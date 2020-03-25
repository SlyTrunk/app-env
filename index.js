const dotEnv = require("dotenv");
const process = require("process");

let envConfig;

const loadConfig = path => {
  if (!path) return {};
  const env = dotEnv.config({ path, silent: true });

  return env ? env.parsed : {};
};

module.exports = function(data) {
  const t = data.types;

  return {
    visitor: {
      ImportDeclaration: function(path, state) {
        const options = state.opts;

        if (options.moduleName === undefined) return;

        const envs = options.envs || {};
        const defaultEnvFile = envs.default || "";
        const envFile = envs[process.env.APP_ENV || "development"] || "";

        if (path.node.source.value === options.moduleName) {
          if (!envConfig) {
            envConfig = Object.assign(
              {},
              loadConfig(defaultEnvFile),
              loadConfig(envFile)
            );
          }

          path.node.specifiers.forEach(function(specifier, idx) {
            if (specifier.type === "ImportDefaultSpecifier") {
              throw path
                .get("specifiers")
                [idx].buildCodeFrameError(
                  "Import dotenv as default is not supported."
                );
            }

            const importedId = specifier.imported.name;
            const localId = specifier.local.name;

            if (!envConfig.hasOwnProperty(importedId)) {
              throw path
                .get("specifiers")
                [idx].buildCodeFrameError(
                  'Try to import dotenv variable "' +
                    importedId +
                    '" which is not defined in any ' +
                    (defaultEnvFile || envFile) +
                    " files."
                );
            }

            const binding = path.scope.getBinding(localId);
            binding.referencePaths.forEach(function(refPath) {
              refPath.replaceWith(t.valueToNode(envConfig[importedId]));
            });
          });

          path.remove();
        }
      }
    }
  };
};
