import debug from "debug";

export const LOGGER_NAMESPACE = "eu-dcc-generator";

const logger = debug(LOGGER_NAMESPACE);

export const trace = (namespace: string) => logger.extend(`trace:${namespace}`);
export const info = (namespace: string) => logger.extend(`info:${namespace}`);
export const error = (namespace: string) => logger.extend(`error:${namespace}`);

export const getLogger = (namespace: string) => ({
  trace: trace(namespace),
  info: info(namespace),
  error: error(namespace),
});
