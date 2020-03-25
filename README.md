# babel-plugin-app-env

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
          "default": "../k8s/staging.env",
          "production": "../k8s/production.env"
        }
      }
    ]
  ]
}
```
