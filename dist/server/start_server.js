"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var logger_1 = __importDefault(require("../logger"));
var port = 3000;
var apiServer = new server_1.PackageManagementAPI();
logger_1.default.info("Starting server on port ".concat(port));
apiServer.start(port);
