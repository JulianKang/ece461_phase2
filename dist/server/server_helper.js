"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryForPackage = exports.getUserAPIKey = exports.APIHelpPackageURL = exports.APIHelpPackageContent = void 0;
/*************************************************
 *
 * Ideas:
 * 1. DataBase Communicator Object?
 * 2. Handle all API Computations. API should only handle responses nothing else.
 * 3.
 *
 * ************************************************** */
var fs = __importStar(require("fs"));
// import DBCommunicator from '../dbCommunicator';
var adjusted_main_1 = require("../adjusted_main");
var SE = __importStar(require("./server_errors"));
var logger_1 = __importDefault(require("../logger"));
var console_1 = require("console");
var Buffer = require('buffer').Buffer;
var AdmZip = require('adm-zip');
function APIHelpPackageContent(base64, JsProgram) {
    var zipBuffer = Buffer.from(base64, 'base64');
    var unzipDir = './src/cloned_repositories';
    if (!fs.existsSync(unzipDir)) {
        fs.mkdirSync(unzipDir);
    }
    var gitRemoteUrl = '';
    var githubUrl = null;
    try {
        var zip = new AdmZip(zipBuffer);
        var zipEntries = zip.getEntries();
        var foundURL_1 = false;
        zipEntries.forEach(function (entry) {
            if (!entry.isDirectory && !foundURL_1) {
                var entryName = entry.entryName;
                var entryData = entry.getData();
                var outputPath = "".concat(unzipDir, "/").concat(entryName);
                // Create subdirectories if they don't exist
                var outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                // Write the entry data to the corresponding file
                fs.writeFileSync(outputPath, entryData);
                //logger.info(`Extracted: ${entryName}`);
                // Check for package.json with GitHub URL
                if (entryName.includes('package.json')) {
                    //logger.info('here');
                    var packageJson = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
                    if (packageJson.repository && packageJson.repository.url) {
                        gitRemoteUrl = packageJson.repository.url.split('+')[1].replace('.git', '');
                        foundURL_1 = true; // Set the flag to true when the URL is found
                    }
                }
            }
        });
        fs.rmSync(unzipDir, { recursive: true });
        //logger.info('ZIP file extraction complete.');
        //logger.info(gitRemoteUrl)
        return gitRemoteUrl;
    }
    catch (error) {
        logger_1.default.error("".concat(error));
        return gitRemoteUrl;
    }
}
exports.APIHelpPackageContent = APIHelpPackageContent;
function APIHelpPackageURL(url, JsProgram) {
    return __awaiter(this, void 0, void 0, function () {
        var error_response, result, keys, _i, keys_1, key, value, package_exists, success_response, error_out_1, error_response_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    error_response = { error: 'Package is not uploaded due to the disqualified rating.' };
                    console.log(url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, adjusted_main_1.fetchDataAndCalculateScore)(url)];
                case 2:
                    result = _a.sent();
                    keys = Object.keys(result);
                    for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        key = keys_1[_i];
                        value = result[key];
                        if (typeof value === 'number' && value < 0) {
                            //logger.info(value)
                            return [2 /*return*/, error_response];
                        }
                    }
                    package_exists = false //DataBase.ScanForPacakge(url)
                    ;
                    if (package_exists) {
                        return [2 /*return*/, { error: 'package already exists' }];
                    }
                    else {
                        //DataBase.AddPackage(url, metrics, ...)
                    }
                    success_response = {
                        metadata: {
                            Name: "Underscore",
                            Version: "1.0.0",
                            ID: "underscore"
                        },
                        data: "Base64 of zipfile"
                    };
                    return [2 /*return*/, success_response];
                case 3:
                    error_out_1 = _a.sent();
                    console.error('Error in fetchDataAndCalculateScore:', error_out_1);
                    error_response_1 = {
                        error: "Invalid package format. Please ensure the package meets the required format."
                    };
                    return [2 /*return*/, error_response_1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.APIHelpPackageURL = APIHelpPackageURL;
function getUserAPIKey(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var authenication;
        return __generator(this, function (_a) {
            authenication = 'abc123' //await DBCommunicator.authenticateUser(username, password);
            ;
            if (!authenication) {
                return [2 /*return*/, false];
            }
            return [2 /*return*/, authenication];
        });
    });
}
exports.getUserAPIKey = getUserAPIKey;
// TODO explicitly define the typings and set return once DBCommunicator is implemented for package search
/*
    example input
    {
        "Version": "Exact (1.2.3)\nBounded range (1.2.3-2.1.0)\nCarat (^1.2.3)\nTilde (~1.2.0)",
        "Name": "string"
    }
 */
function queryForPackage(Input) {
    return __awaiter(this, void 0, void 0, function () {
        var versionRegex, lines, versions, foundPackages, _i, versions_1, version, packageData;
        return __generator(this, function (_a) {
            versionRegex = /\(([^)]+)\)/;
            lines = Input.Version.split('\n');
            versions = lines.map(function (line) {
                try {
                    var match = line.match(versionRegex);
                    if (!match) {
                        throw console_1.error;
                    }
                    return match[1];
                }
                catch (error) {
                    throw new SE.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                }
            });
            foundPackages = [];
            for (_i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
                version = versions_1[_i];
                packageData = {
                    Name: Input.Name,
                    Version: version,
                    ID: 'id'
                };
                if (packageData) {
                    foundPackages.push(packageData);
                }
            }
            return [2 /*return*/, foundPackages];
        });
    });
}
exports.queryForPackage = queryForPackage;
