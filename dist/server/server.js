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
exports.PackageManagementAPI = void 0;
// const jwt = require('jsonwebtoken');
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var body_parser_1 = __importDefault(require("body-parser"));
var server_errors_1 = require("./server_errors");
var logger_1 = __importDefault(require("../logger"));
var Schemas = __importStar(require("../schemas"));
var helper = __importStar(require("./server_helper"));
var dbCommunicator_1 = __importDefault(require("../dbCommunicator"));
var Evaluate = Schemas.Evaluate;
// Example Request: curl -X POST -H "Content-Type: application/json" -d 
//'{"name": "Sample Package", "version": "1.0.0", "data": {"URL": "https://example.com/package.zip"}}' http://localhost:3000/packages
/**
* PackageManagementAPI
*
*
* Current Progress:
* 1. Most of Package Ingestion is Complete (handleCreatePackage), URL and zip content can
* both be analyzed to get metric scores, however, adding package to data base and creating a
* response code still needs to be done.
*
* 2. Created skeleton responses for all endpoints ( a lot should just be data base queries now and formatting return)
*
* Need to be done:
* 1. DataBase queries for all functions - database end, functions in development
* 2. Authentication - database end, functions in development
* 3. Return objects (for successfull queries) - TODO
*
* Issues I see:
* 1. Their code is slow
* 2. we need to update their Ramp_Up_Score, I think it is always < 0.5
* 3. We need to include the new metrics
*
* Testing:
* 1. Currently don't have Unit Tests set up
* 2. Can use make_test_requests.py and PackageContent to test
*
* TODO, and SWITCH are used to find places that need to be updated
*/
var PackageManagementAPI = /** @class */ (function () {
    function PackageManagementAPI() {
        this.server = null;
        this.database = dbCommunicator_1.default;
        this.app = (0, express_1.default)();
        this.app.use(body_parser_1.default.json());
        this.database.connect();
        // authenticate middleware
        this.app.use(this.authenticate);
        // enable CORS for all requests
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        // Define routes
        this.app.get('/', this.handleDefault.bind(this));
        this.app.post('/packages', this.handleSearchPackages.bind(this));
        this.app.delete('/reset', this.handleReset.bind(this));
        this.app.get('/package/:id', this.handleGetPackageById.bind(this));
        this.app.put('/package/:id', this.handleUpdatePackageById.bind(this));
        this.app.delete('/package/:id', this.handleDeletePackageById.bind(this));
        this.app.post('/package', this.handleCreatePackage.bind(this));
        this.app.get('/package/:id/rate', this.handleRatePackage.bind(this));
        this.app.put('/authenticate', this.handleAuthenticateUser.bind(this));
        this.app.get('/package/byName/:name', this.handleGetPackageByName.bind(this));
        this.app.delete('/package/byName/:name', this.handleDeletePackageByName.bind(this));
        this.app.post('/package/byRegEx', this.handleSearchPackagesByRegex.bind(this));
        // error handling after everything else
        this.app.use(this.ErrorHandler);
    }
    // Returns the Express app object (used in testing)
    PackageManagementAPI.prototype.getApp = function () {
        return this.app;
    };
    // Middleware for error handling
    PackageManagementAPI.prototype.ErrorHandler = function (err, req, res, next) {
        var errorMessage;
        var statusCode;
        // Collect multiple errors in an array
        var errors = Array.isArray(err) ? err : [err];
        if (errors.length > 1) {
            err = new server_errors_1.AggregateError(errors);
        }
        errorMessage = err.message;
        statusCode = (err instanceof server_errors_1.Server_Error) ? err.num :
            (err instanceof server_errors_1.AggregateError) ? err.num : // TODO replace with more appropriate error code, or add .num to AggregateError
                500; // default to 500
        // Log and send the error   
        logger_1.default.error("Code:".concat(statusCode, " -> Message: ").concat(err)); // TODO replace with actual error logging logic
        res.status(statusCode).json({ error: errorMessage });
        next();
    };
    // Middleware for authentication (placeholder)
    // curently not working???? idk y
    PackageManagementAPI.prototype.authenticate = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Check the request path to skip authentication for specific routes
                if (req.path === '/authenticate' || req.path === '/') {
                    next(); // Skip authentication for the /authenticate route
                    return [2 /*return*/];
                }
                // Skeleton authentication logic (replace with actual logic)
                // For example, you can check for a valid token here
                // if(!Evaluate.isUser(req.body.user)) { 
                // 	next(new Server_Error(400, 'There is missing field(s) in the AuthenticationRequest or it is formed improperly.'));
                // 	return;
                // }
                // boolean isAuthentificated = await database.isAuthentificated(req.body.user.name, req.body.user.authentification);
                //Should we pass a userPermission to the function called?
                if (true) {
                    next(); // Authentication successful
                    return [2 /*return*/];
                }
                throw new server_errors_1.Server_Error(401, 'Authentication failed');
            });
        });
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////// ENDPOINTS /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // endpoint: '/' GET
    PackageManagementAPI.prototype.handleDefault = function (req, res) {
        res.send('Welcome to the package management API!');
        res.status(200);
    };
    // endpoint: '/packages' POST
    PackageManagementAPI.prototype.handleSearchPackages = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, dbResp_1, e_1, err;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = req.body;
                        dbResp_1 = [];
                        if (!Array.isArray(data)) {
                            throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                        }
                        if (data.length > 100) {
                            throw new server_errors_1.Server_Error(413, "Too many packages returned."); // don't actually know what to do for this error
                        }
                        if (data.length === 0) {
                            throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                        }
                        // ask database and process
                        return [4 /*yield*/, Promise.all(data.map(function (query) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // check if query is valid format
                                            if (!Evaluate.isPackageQuery(query)) {
                                                throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                                            }
                                            return [4 /*yield*/, helper.queryForPackage(query)];
                                        case 1:
                                            result = _a.sent();
                                            dbResp_1.push(result);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        // ask database and process
                        _a.sent();
                        res.status(200).json(dbResp_1);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        err = void 0;
                        if (!(e_1 instanceof server_errors_1.Server_Error)) {
                            err = new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                        }
                        else {
                            err = e_1;
                        }
                        next(err);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // zendpoint: '/package' POST
    PackageManagementAPI.prototype.handleCreatePackage = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var newPackage, result, e_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!req.body || !Evaluate.isPackageData(req.body)) {
                            throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.");
                        }
                        newPackage = req.body // url or base64
                        ;
                        result = void 0;
                        if (!((newPackage.URL && newPackage.Content) || !Evaluate.isPackageJSProgram(newPackage.JSProgram))) return [3 /*break*/, 1];
                        throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
                    case 1:
                        if (!newPackage.URL) return [3 /*break*/, 3];
                        return [4 /*yield*/, helper.APIHelpPackageURL(newPackage.URL, newPackage.JSProgram)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!newPackage.Content) return [3 /*break*/, 5];
                        return [4 /*yield*/, helper.APIHelpPackageContent(newPackage.Content, newPackage.JSProgram)];
                    case 4:
                        result = _a.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
                    case 6:
                        res.status(201).json(result);
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        err = void 0;
                        if (e_2 instanceof server_errors_1.Server_Error) {
                            err = e_2;
                        }
                        else { // might never reach this branch, is likely caught in helper functions, but just in case
                            err = new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
                        }
                        next(err);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/reset' DELETE
    PackageManagementAPI.prototype.handleReset = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, e_3, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = { name: 'admin', isAdmin: true };
                        return [4 /*yield*/, this.database.resetRegistry()];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        res.json('System reset successfully');
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        err = void 0;
                        if (e_3 instanceof server_errors_1.Server_Error) {
                            err = e_3;
                        }
                        else { // req.body does not conform to Schemas.User
                            err = new server_errors_1.Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        next(err);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/package/:id' GET
    PackageManagementAPI.prototype.handleGetPackageById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageId, package_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                          * 200
                          Return the package. Content is required.
                          
                          * 400
                          There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
                          
                          * 404
                          Package does not exist.
                          */
                        if (!req.params.id) {
                            next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                        }
                        if (!Evaluate.isPackageID(req.params.id)) {
                            next(new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
                        }
                        packageId = req.params.id;
                        return [4 /*yield*/, this.database.getPackageById(packageId)];
                    case 1:
                        package_result = _a.sent();
                        if (!package_result) {
                            // Package not found
                            next(new server_errors_1.Server_Error(404, 'Package not found.'));
                        }
                        // Successfully retrieved the package
                        res.status(200).json(package_result);
                        return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/package/:id' PUT
    PackageManagementAPI.prototype.handleUpdatePackageById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageId, updatedPackage, updatedPackageBool, e_4, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.params.id) {
                            throw new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.');
                        }
                        if (!Evaluate.isPackageID(req.params.id)) {
                            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        if (!Evaluate.isPackage(req.body)) {
                            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        packageId = req.params.id;
                        updatedPackage = req.body;
                        if (packageId !== updatedPackage.metadata.ID) {
                            throw new server_errors_1.Server_Error(400, 'Package ID does not match.');
                        }
                        return [4 /*yield*/, this.database.updatePackageById(updatedPackage)];
                    case 1:
                        updatedPackageBool = _a.sent();
                        if (!updatedPackageBool) {
                            // Package does not exist
                            throw new server_errors_1.Server_Error(404, 'Package not found.');
                        }
                        // Successfully updated package
                        res.status(200).json('Version is updated.');
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        err = void 0;
                        if (e_4 instanceof server_errors_1.Server_Error) {
                            err = e_4;
                        }
                        else { // req.body does not conform to Schemas.Package
                            err = new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        next(err);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/package/:id' DELETE
    // TODO test
    // not baseline
    PackageManagementAPI.prototype.handleDeletePackageById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageId, deletedPackage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next(new server_errors_1.Server_Error(501, 'This system does not support Delete by ID.'));
                        return [2 /*return*/];
                    case 1:
                        deletedPackage = _a.sent();
                        if (!deletedPackage) {
                            // Package does not exist
                            next(new server_errors_1.Server_Error(404, 'Package not found.'));
                        }
                        // Successfully deleted package
                        res.status(200).json({
                            message: 'Package is deleted successfully.'
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/package/:id/rate' GET
    PackageManagementAPI.prototype.handleRatePackage = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageId, ratedPackage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                          * 200
                          Return the rating. Only use this if each metric was computed successfully.
                
                          * 400
                          There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
                          
                          * 404
                          Package does not exist.
                          
                          * 500
                          The package rating system choked on at least one of the metrics.
                          */
                        if (!req.params.id) {
                            next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                        }
                        if (!Evaluate.isPackageID(req.params.id)) {
                            next(new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
                        }
                        packageId = req.params.id;
                        return [4 /*yield*/, this.database.getPackageRatings(packageId)];
                    case 1:
                        ratedPackage = _a.sent();
                        if (!ratedPackage) {
                            // Package does not exist
                            next(new server_errors_1.Server_Error(404, 'Package not found.'));
                        }
                        // Successfully rated package
                        res.status(200).json(ratedPackage);
                        return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/authenticate' PUT
    // TODO currently out of scope, will implement if we have time
    // not baseline
    PackageManagementAPI.prototype.handleAuthenticateUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var secretKey, username, isAdmin, password, isValidUser, userObj;
            return __generator(this, function (_a) {
                next(new server_errors_1.Server_Error(501, 'This system does not support authentication.'));
                return [2 /*return*/];
            });
        });
    };
    // endpoint: '/package/byName/:name' GET
    // TODO currently out of scope, will implement if we have time
    // not baseline
    PackageManagementAPI.prototype.handleGetPackageByName = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageName, packageHistory;
            return __generator(this, function (_a) {
                next(new server_errors_1.Server_Error(501, 'This system does not support package history.'));
                return [2 /*return*/];
            });
        });
    };
    // endpoint: '/package/byName/:name' DELETE
    // TODO test
    // not baseline
    PackageManagementAPI.prototype.handleDeletePackageByName = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageName, deletedPackage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next(new server_errors_1.Server_Error(501, 'This system does not support Delete by Name.'));
                        return [2 /*return*/];
                    case 1:
                        deletedPackage = _a.sent();
                        if (!deletedPackage) {
                            // Package does not exist
                            next(new server_errors_1.Server_Error(404, 'Package not found.'));
                        }
                        // Successfully deleted package
                        res.status(200).json('Package is deleted successfully.');
                        return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/package/byRegEx' POST
    PackageManagementAPI.prototype.handleSearchPackagesByRegex = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var regexPattern, searchResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                         * 200
                         Return a list of packages.
                        
                        * 400
                        There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
                        
                        * 404
                        No package found under this regex.
                        */
                        if (!req.body.RegEx || !Evaluate.isPackageRegEx(req.body.RegEx)) {
                            if (!req.body.RegEx) {
                                next(new server_errors_1.Server_Error(400, 'Regular expression pattern is missing.'));
                            }
                            else {
                                next(new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
                            }
                        }
                        regexPattern = req.body.RegEx;
                        return [4 /*yield*/, this.database.searchPackagesByRegex(regexPattern)];
                    case 1:
                        searchResults = _a.sent();
                        if (searchResults.length === 0) {
                            // No packages found matching the regex
                            next(new server_errors_1.Server_Error(404, 'No package found under this regex.'));
                        }
                        // Successfully retrieved search results
                        res.status(200).json(searchResults);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Start the server on the specified port
    PackageManagementAPI.prototype.start = function (port) {
        this.server = this.app.listen(port, function () {
            logger_1.default.info("Server is running on port ".concat(port));
        });
    };
    PackageManagementAPI.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.server) {
                    return [2 /*return*/];
                }
                this.server.close(function () {
                    logger_1.default.info("Server is closed");
                });
                return [2 /*return*/];
            });
        });
    };
    return PackageManagementAPI;
}());
exports.PackageManagementAPI = PackageManagementAPI;
