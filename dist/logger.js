"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var winston = __importStar(require("winston"));
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
var Logger = /** @class */ (function () {
    /**
     * Create a new Logger instance.
     * @constructor
     */
    function Logger() {
        this.logLevel = this.getLogLevelFromEnv();
        this.logFileName = process.env.LOG_FILE;
        // Check if LOG_FILE is defined; exit with code 1 if not
        if (!this.logFileName) {
            process.exit(1);
        }
        var customFormat = winston.format.printf(function (_a) {
            var timestamp = _a.timestamp, message = _a.message;
            return "".concat(timestamp, " ").concat(message);
        });
        var fileTransportOptions = {
            filename: this.logFileName,
        };
        this.loggerMain = winston.createLogger({
            level: this.logLevel >= LogLevel.Info ? 'info' : 'silent',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
            customFormat),
            transports: [
                new winston.transports.File(__assign(__assign({}, fileTransportOptions), { format: customFormat })),
            ],
        });
        this.loggerDebug = winston.createLogger({
            level: 'debug',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
            customFormat),
            transports: [
                new winston.transports.File(__assign(__assign({}, fileTransportOptions), { format: customFormat })),
            ],
        });
        this.loggerError = winston.createLogger({
            level: 'error',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
            customFormat),
            transports: [
                new winston.transports.File(__assign(__assign({}, fileTransportOptions), { format: customFormat })),
            ],
        });
    }
    /**
     * Get the log level from the environment variable LOG_LEVEL.
     * @private
     */
    Logger.prototype.getLogLevelFromEnv = function () {
        var logLevel = process.env.LOG_LEVEL;
        switch (logLevel) {
            case '0':
                return LogLevel.Silent;
            case '2':
                return LogLevel.Debug;
            case '1':
            default:
                return LogLevel.Info;
        }
    };
    /**
     * Log a debug message.
     * @param {string} message - The debug message to log.
     */
    Logger.prototype.debug = function (message) {
        console.log(message);
        if (this.logLevel >= LogLevel.Debug) {
            this.loggerDebug.debug(message);
        }
    };
    /**
     * Log an information message.
     * @param {string} message - The information message to log.
     */
    Logger.prototype.info = function (message) {
        if (this.logLevel >= LogLevel.Info) {
            this.loggerMain.info(message);
        }
    };
    /**
     * Log a warning message.
     * @param {string} message - The warning message to log.
     */
    Logger.prototype.warn = function (message) {
        console.log(message);
        if (this.logLevel >= LogLevel.Info) {
            this.loggerMain.warn(message);
        }
    };
    /**
     * Log an error message.
     * @param {string} message - The error message to log.
     */
    Logger.prototype.error = function (message) {
        this.loggerError.error(message);
    };
    return Logger;
}());
// Export a singleton instance of the Logger
exports.default = new Logger();
