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
exports.queryForPackage = exports.APIHelpPackageURL = exports.APIHelpPackageContent = void 0;
var fs = __importStar(require("fs"));
var console_1 = require("console");
var adjusted_main_1 = require("../adjusted_main");
var server_errors_1 = require("./server_errors");
var dbCommunicator_1 = __importDefault(require("../dbCommunicator"));
var logger_1 = __importDefault(require("../logger"));
var Schemas = __importStar(require("../schemas"));
var Evaluate = Schemas.Evaluate;
var Buffer = require('buffer').Buffer;
var AdmZip = require('adm-zip');
function getPackageMetadataFromURL(url, version) {
    var packageMetadata = {
        Name: url.split('/')[url.split('/').length - 1],
        Version: version,
        ID: null,
    };
    packageMetadata.ID = packageMetadata.Name.toLowerCase() + '_' + packageMetadata.Version;
    return packageMetadata;
}
function APIHelpPackageContent(base64, JsProgram) {
    return __awaiter(this, void 0, void 0, function () {
        var zipBuffer, unzipDir, gitRemoteUrl, zip, zipEntries, foundURL_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zipBuffer = Buffer.from(base64, 'base64');
                    unzipDir = './src/cloned_repositories';
                    if (!fs.existsSync(unzipDir)) {
                        fs.mkdirSync(unzipDir);
                    }
                    gitRemoteUrl = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    zip = new AdmZip(zipBuffer);
                    zipEntries = zip.getEntries();
                    foundURL_1 = false;
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
                    if (!gitRemoteUrl) {
                        throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                    }
                    if (!Evaluate.isPackageURL(gitRemoteUrl) || !Evaluate.isPackageJSProgram(JsProgram)) {
                        throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                    }
                    return [4 /*yield*/, APIHelpPackageURL(gitRemoteUrl, JsProgram, base64)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    if (error_1 instanceof server_errors_1.Server_Error) {
                        throw error_1;
                    }
                    throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.APIHelpPackageContent = APIHelpPackageContent;
function APIHelpPackageURL(url, JsProgram, content) {
    return __awaiter(this, void 0, void 0, function () {
        var result, newPackageRating, keys, _i, keys_1, key, value, newPackageData, newPackageMetadata, newPackage, db_response_package, db_response_ratings, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, adjusted_main_1.fetchDataAndCalculateScore)(url, content)];
                case 1:
                    result = _a.sent();
                    newPackageRating = result.ratings;
                    //Check to see if Scores Fulfill the threshold if not return a different return code
                    // Believe they all have to be over 0.5
                    content = result.content;
                    keys = Object.keys(newPackageRating);
                    for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        key = keys_1[_i];
                        value = newPackageRating[key];
                        if (typeof value === 'number' && value < 0.5) {
                            logger_1.default.info("Package is not uploaded due to the disqualified rating. ".concat(key, " is ").concat(value, " for ").concat(url));
                            throw new server_errors_1.Server_Error(424, "Package is not uploaded due to the disqualified rating.");
                        }
                    }
                    newPackageData = {
                        Content: content,
                        URL: result.url,
                        JSProgram: JsProgram
                    };
                    newPackageMetadata = getPackageMetadataFromURL(result.url, result.version);
                    newPackage = {
                        metadata: newPackageMetadata,
                        data: newPackageData,
                    };
                    return [4 /*yield*/, dbCommunicator_1.default.injestPackage(newPackage, result.reademe)];
                case 2:
                    db_response_package = _a.sent();
                    if (db_response_package === -1) {
                        throw new server_errors_1.Server_Error(409, "Package already exists");
                    }
                    else if (db_response_package === 0) {
                        throw new server_errors_1.Server_Error(500, "Internal Server Error");
                    }
                    if (!newPackage.metadata.ID) {
                        throw new server_errors_1.Server_Error(500, "Internal Server Error");
                    }
                    return [4 /*yield*/, dbCommunicator_1.default.injestPackageRatings(newPackage.metadata.ID, newPackageRating)];
                case 3:
                    db_response_ratings = _a.sent();
                    if (!db_response_ratings) {
                        throw new server_errors_1.Server_Error(500, "Internal Server Error");
                    }
                    return [2 /*return*/, newPackage];
                case 4:
                    error_2 = _a.sent();
                    // propogate error
                    if (error_2 instanceof server_errors_1.Server_Error) {
                        throw error_2;
                    }
                    throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.APIHelpPackageURL = APIHelpPackageURL;
// not used currently
// export async function getUserAPIKey(username: string, password: string): Promise<string | boolean> {
//     const admin = username === "ece30861defaultadminuser" && password === "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;";
//     if(admin){
//         return true
//     }
//     // let authenication = await dbCommunicator.authenticateUser(username, password);
//     if (!authenication) {
//         return false;
//     }
//     return authenication;
// }
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
            switch (_a.label) {
                case 0:
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
                            throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                        }
                    });
                    foundPackages = [];
                    _i = 0, versions_1 = versions;
                    _a.label = 1;
                case 1:
                    if (!(_i < versions_1.length)) return [3 /*break*/, 4];
                    version = versions_1[_i];
                    return [4 /*yield*/, dbCommunicator_1.default.getPackageMetadata(Input.Name, version)];
                case 2:
                    packageData = _a.sent();
                    foundPackages.push.apply(foundPackages, packageData);
                    if (foundPackages.length > 100) {
                        throw new server_errors_1.Server_Error(413, "Too many packages returned");
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // make unique list
                    foundPackages = foundPackages.filter(function (item, index) {
                        return foundPackages.findIndex(function (obj) { return obj.Name === item.Name && obj.Version === item.Version; }) === index;
                    });
                    return [2 /*return*/, foundPackages];
            }
        });
    });
}
exports.queryForPackage = queryForPackage;
