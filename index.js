const dotEnv = require("dotenv");
const fs = require("fs");
const sysPath = require("path");
const process = require("process");

module.exports = function(data) {
  const t = data.types;

  return {
    visitor: {
      ImportDeclaration: function(path, state) {
        const options = state.opts;

        if (options.moduleName === undefined) return;

        const envs = options.envs || {};
        const defaultEnvFile = envs.default;
        const envFile = envs[process.env.APP_ENV];

        if (path.node.source.value === options.moduleName) {
          const defaultConfig =
            dotEnv.config({
              path: sysPath.join(defaultEnvFile),
              silent: true
            }) || {};
          const envConfig = Object.assign(
            defaultConfig,
            dotEnv.config({ path: sysPath.join(envFile), silent: true })
          );

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

            if (!config.hasOwnProperty(importedId)) {
              throw path
                .get("specifiers")
                [idx].buildCodeFrameError(
                  'Try to import dotenv variable "' +
                    importedId +
                    '" which is not defined in any ' +
                    configFile +
                    " files."
                );
            }

            const binding = path.scope.getBinding(localId);
            binding.referencePaths.forEach(function(refPath) {
              refPath.replaceWith(t.valueToNode(config[importedId]));
            });
          });

          path.remove();
        }
      }
    }
  };
};
