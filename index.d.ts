declare module "@slytrunk/app-env" {
  const env: Record<string, string>;
  export default env;
}

declare module "@slytrunk/app-env/debug" {
  export function getEnv(key: string): string;
  export function getEnvironmentOptions(): string[];
  export function setEnvironment(environment: string): void;
}
