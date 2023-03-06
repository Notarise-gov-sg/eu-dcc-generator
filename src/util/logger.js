"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = exports.error = exports.info = exports.trace = exports.LOGGER_NAMESPACE = void 0;
const debug_1 = __importDefault(require("debug"));
exports.LOGGER_NAMESPACE = "eu-dcc-generator";
const logger = (0, debug_1.default)(exports.LOGGER_NAMESPACE);
const trace = (namespace) => logger.extend(`trace:${namespace}`);
exports.trace = trace;
const info = (namespace) => logger.extend(`info:${namespace}`);
exports.info = info;
const error = (namespace) => logger.extend(`error:${namespace}`);
exports.error = error;
const getLogger = (namespace) => ({
    trace: (0, exports.trace)(namespace),
    info: (0, exports.info)(namespace),
    error: (0, exports.error)(namespace),
});
exports.getLogger = getLogger;
