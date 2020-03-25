# babel-plugin-app-env

Import .env files per APP_ENV

## Usage

```json
{
  "plugins": [
    [
      "@slytrunk/babel-plugin-app-env",
      {
        "moduleName": "env",
        "envs": {
          "default": "../k8s/staging.env",
          "production": "../k8s/production.env"
        }
      }
    ]
  ]
}
```
