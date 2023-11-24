"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
require("dotenv/config");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Silent"] = 0] = "Silent";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
})(LogLevel || (LogLevel = {}));
/**
 * Logger class for handling application logs.
 */
class Logger {
    /**
     * Create a new Logger instance.
     * @constructor
     */
    constructor() {
        this.logLevel = this.getLogLevelFromEnv();
        this.logFileName = process.env.LOG_FILE;
        // Check if LOG_FILE is defined; exit with code 1 if not
        if (!this.logFileName) {
            process.exit(1);
        }
        const customFormat = winston.format.printf(({ timestamp, message }) => {
            return `${timestamp} ${message}`;
        });
        const fileTransportOptions = {
            filename: this.logFileName,
        };
        this.loggerMain = winston.createLogger({
            level: this.logLevel >= LogLevel.Info ? 'info' : 'silent',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
            customFormat),
            transports: [
                new winston.transports.File(Object.assign(Object.assign({}, fileTransportOptions), { format: customFormat })),
            ],
        });
        this.loggerDebug = winston.createLogger({
            level: 'debug',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
            customFormat),
            transports: [
                new winston.transports.File(Object.assign(Object.assign({}, fileTransportOptions), { format: customFormat })),
            ],
        });
        this.loggerError = winston.createLogger({
            level: 'error',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
            customFormat),
            transports: [
                new winston.transports.File(Object.assign(Object.assign({}, fileTransportOptions), { format: customFormat })),
            ],
        });
    }
    /**
     * Get the log level from the environment variable LOG_LEVEL.
     * @private
     */
    getLogLevelFromEnv() {
        const logLevel = process.env.LOG_LEVEL;
        switch (logLevel) {
            case '0':
                return LogLevel.Silent;
            case '2':
                return LogLevel.Debug;
            case '1':
            default:
                return LogLevel.Info;
        }
    }
    /**
     * Log a debug message.
     * @param {string} message - The debug message to log.
     */
    debug(message) {
        console.log(message);
        if (this.logLevel >= LogLevel.Debug) {
            this.loggerDebug.debug(message);
        }
    }
    /**
     * Log an information message.
     * @param {string} message - The information message to log.
     */
    info(message) {
        console.log(message);
        if (this.logLevel >= LogLevel.Info) {
            this.loggerMain.info(message);
        }
    }
    /**
     * Log a warning message.
     * @param {string} message - The warning message to log.
     */
    warn(message) {
        console.log(message);
        if (this.logLevel >= LogLevel.Info) {
            this.loggerMain.warn(message);
        }
    }
    /**
     * Log an error message.
     * @param {string} message - The error message to log.
     */
    error(message) {
        this.loggerError.error(message);
    }
}
// Export a singleton instance of the Logger
exports.default = new Logger();
