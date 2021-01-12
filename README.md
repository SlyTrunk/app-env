# app-env

Import .env files per APP_ENV

## Usage

```json
{
  "plugins": [
    [
      "module:@slytrunk/app-env",
      {
        "moduleName": "@slytrunk/app-env",
        "envs": {
          "stage": ".env.stage",
          "production": ".env.production"
        }
      }
    ]
  ]
}
```

Then you can import env variables in your code:

```js
import { API_URL } from "@slytrunk/app-env";
```

Be sure to specify `APP_ENV` up front.

```sh
$ APP_ENV=stage yarn dev
```

## Debug Mode

If your `APP_ENV` is not production, we support hot-loading different environments so you can test multiple environments in one build.

```js
import { setEnvironment } from "@slytrunk/app-env/debug";
setEnvironment("stage");
```

You can get a list of available environments so you can build ui to switch environments:

```js
import { getEnvironmentOptions } from "@slytrunk/app-env/debug";

getEnvironmentOptions();
// ["stage", "production"]
```

Lastly, you can load variables directly from debug mode, however this is not recommended as the babel plugin does this for you automatically using the regular interface.

```js
// !! Not Recommended
import { getEnv } from "@slytrunk/app-env/debug";

getEnv("API_URL");
// "http://api.example.com"

// Recommended
import { API_URL } from "@slytrunk/app-env";
// "http://api.example.com"
```
