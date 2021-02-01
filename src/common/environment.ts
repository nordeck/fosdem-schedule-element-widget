const getWindowEnvironment = () => {
  let environment: { [key: string]: string | undefined } = {};

  if (typeof window.__ENVIRONMENT__ === 'string') {
    const encoded = window.__ENVIRONMENT__;
    // check if mustache placeholder hasn't been replaced for some reason.
    if (!encoded.match(/^{{.*}}$/)) {
      try {
        environment = JSON.parse(atob(encoded));
      } catch {
        console.warn('window.__ENVIRONMENT__ has an unexpected format', encoded);
      }
    }
  }
  return environment;
};

const handler = {
  get(target: { [key: string]: string | undefined }, name: string) {
    return target[name] || process.env[name];
  }
};

/**
 * Reads environment variables starting with `REACT_APP_` from a global variable at runtime and falls back to `process.env` build time variables.
 * @module environment
 */
export default new Proxy(getWindowEnvironment(), handler);
