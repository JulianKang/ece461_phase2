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
var console_1 = require("console");
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
        // this.app.use(this.authenticate);
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
        // Check the request path to skip authentication for specific routes
        if (req.path === '/authenticate') {
            next(); // Skip authentication for the /authenticate route
        }
        // Skeleton authentication logic (replace with actual logic)
        // For example, you can check for a valid token here
        // let userAPIKey = helper.getUserAPIKey(req.body.User.name, req.body.Secret.password);
        //Should we pass a userPermission to the function called?
        if (true) {
            next(); // Authentication successful
        }
        throw new server_errors_1.Server_Error(401, 'Authentication failed');
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////// ENDPOINTS /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // endpoint: '/' GET
    PackageManagementAPI.prototype.handleDefault = function (req, res) {
        res.send('Welcome to the package management API!');
    };
    // endpoint: '/packages' POST
    // TODO test
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
                        // ask database and process
                        return [4 /*yield*/, Promise.all(data.map(function (query) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // check if query is valid format
                                            if (!Evaluate.isPackageQuery(query)) {
                                                throw console_1.error;
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
    // TODO validate helpers and test
    PackageManagementAPI.prototype.handleCreatePackage = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var newPackage, result, e_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!Evaluate.isPackageData(req.body)) {
                            throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.");
                        }
                        newPackage = req.body // url or base64
                        ;
                        result = void 0;
                        if (!!newPackage) return [3 /*break*/, 1];
                        throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, helper.APIHelpPackageURL(newPackage, 'no js program?')];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        result = /* await  */ helper.APIHelpPackageContent(newPackage, 'no js program');
                        _a.label = 4;
                    case 4:
                        res.status(201).json(result);
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        err = void 0;
                        if (e_2 instanceof server_errors_1.Server_Error) {
                            err = e_2;
                        }
                        else { // might never reach this branch, is likely caught in helper functions, but just in case
                            err = new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
                        }
                        next(err);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/reset' DELETE
    // TODO test
    PackageManagementAPI.prototype.handleReset = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, e_3, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!Evaluate.isUser(req.body.User)) {
                            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        data = req.body.User;
                        if (!data.isAdmin) {
                            throw new server_errors_1.Server_Error(401, 'You do not have permission to reset the registry.');
                        }
                        return [4 /*yield*/, this.database.resetRegistry(data)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        res.json({ message: 'System reset successfully' });
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
    // TODO test
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
                        if (!Evaluate.isPackageID(req.params.id)) {
                            if (!req.params.id) {
                                next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                            }
                            else {
                                next(new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
                            }
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
    // TODO test
    PackageManagementAPI.prototype.handleUpdatePackageById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageId, updatedPackageData, updatedPackage, e_4, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!Evaluate.isPackageID(req.params.id)) {
                            if (!req.params.id) {
                                next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                            }
                            else {
                                throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                            }
                        }
                        if (!Evaluate.isPackage(req.body)) {
                            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
                        }
                        packageId = req.params.id;
                        updatedPackageData = req.body;
                        return [4 /*yield*/, this.database.updatePackageById(packageId, updatedPackageData)];
                    case 1:
                        updatedPackage = _a.sent();
                        if (!updatedPackage) {
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
    PackageManagementAPI.prototype.handleDeletePackageById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageId, deletedPackage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                          * 200
                          Version is deleted.
                          
                          * 400
                          There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
                          
                          * 404
                          Package does not exist.
                          */
                        if (!Evaluate.isPackageID(req.params.id)) {
                            if (!req.params.id) {
                                next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                            }
                            else {
                                next(new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
                            }
                        }
                        packageId = req.params.id;
                        // Check if the package ID is provided
                        if (!packageId) {
                            next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                        }
                        return [4 /*yield*/, this.database.deletePackageById(packageId)];
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
    // TODO test
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
                        if (!Evaluate.isPackageID(req.params.id)) {
                            if (!req.params.id) {
                                next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                            }
                            else {
                                next(new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
                            }
                        }
                        packageId = req.params.id;
                        // Check if the package ID is provided
                        if (!packageId) {
                            next(new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.'));
                        }
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
    PackageManagementAPI.prototype.handleAuthenticateUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var secretKey, username, isAdmin, password, isValidUser, userObj, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next(new server_errors_1.Server_Error(501, 'This system does not support authentication.'));
                        return [2 /*return*/];
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        username = req.body.User.name;
                        isAdmin = req.body.User.isAdmin;
                        password = req.body.Secret.password;
                        if (!username || !password || req.body.User.isAdmin == null) {
                            res.status(400).json({ error: 'Missing Fields' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, helper.getUserAPIKey(username, password)];
                    case 2:
                        isValidUser = _a.sent();
                        //Temporary 'Base Case' Authentication
                        if (!isValidUser) {
                            throw new server_errors_1.Server_Error(401, 'User or Password is invalid');
                        }
                        userObj = req.body.User;
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        res.status(400).json({ error: 'Missing Fields' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/package/byName/:name' GET
    // TODO currently out of scope, will implement if we have time
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
    PackageManagementAPI.prototype.handleDeletePackageByName = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var packageName, deletedPackage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                         * 200
                         Package is deleted.
                        
                        * 400
                        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
                        
                        * 404
                        Package does not exist.
                        */
                        if (!Evaluate.isPackageName(req.params.name)) {
                            if (!req.params.name) {
                                next(new server_errors_1.Server_Error(400, 'Package name is missing or invalid.'));
                            }
                            else {
                                next(new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
                            }
                        }
                        packageName = req.params.name;
                        // Check if the package name is provided
                        if (!packageName) {
                            next(new server_errors_1.Server_Error(400, 'Package name is missing or invalid.'));
                        }
                        return [4 /*yield*/, this.database.deletePackageByName(packageName)];
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
    // TODO test
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
                        if (!Evaluate.isPackageRegEx(req.body.RegEx)) {
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
// import request from 'supertest';
var port = 3000;
var apiServer = new PackageManagementAPI();
logger_1.default.info("Starting server on port ".concat(port));
apiServer.start(port);
// const response = request(apiServer.getApp()).post('/packages').send({ Name: "package1", Version: "(1.0.0)\n(1.1.0)\n(~1.0)\n(^1.0.0)\n(1.0.0-1.2.0)\n" },);
