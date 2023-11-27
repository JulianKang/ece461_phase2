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
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var helper = __importStar(require("./server_helper"));
// import dbCommunicator from '../dbCommunicator';
var server_errors_1 = require("./server_errors");
var logger_1 = __importDefault(require("../logger"));
// const jwt = require('jsonwebtoken');
// Example Request: curl -X POST -H "Content-Type: application/json" -d 
//'{"name": "Sample Package", "version": "1.0.0", "data": {"URL": "https://example.com/package.zip"}}' http://localhost:3000/packages
/**
* PackageManagementAPI
*
* Functions:
*  this.app.post('/packages', this.handleSearchPackages.bind(this));
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
    // private database = dbCommunicator;
    function PackageManagementAPI() {
        this.app = (0, express_1.default)();
        this.app.use(body_parser_1.default.json());
        this.packages = [];
        this.nextPackageId = 1;
        // Middleware
        // this.app.use(this.authenticate);
        this.app.use(this.ErrorHandler);
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
            (err instanceof server_errors_1.AggregateError) ? 500 : // TODO replace with more appropriate error code, or add .num to AggregateError
                500; // default to 500
        // Log and send the error          
        logger_1.default.error("".concat(err)); // TODO replace with actual error logging logic
        res.status(statusCode).json({ error: errorMessage });
    };
    // Middleware for authentication (placeholder)
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
    PackageManagementAPI.prototype.handleSearchPackages = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, dbResp;
            var _this = this;
            return __generator(this, function (_a) {
                data = req.body;
                dbResp = [];
                /**
                * 200
                List of packages
                
                400
                There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
                
                413
                Too many packages returned.
                */
                if (!Array.isArray(data)) {
                    throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                }
                if (data.length > 100) {
                    throw new server_errors_1.Server_Error(413, "Too many packages returned."); // don't actually know what to do for this error
                }
                // ask database and process
                data.forEach(function (query) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, helper.queryForPackage(query)];
                            case 1:
                                result = _a.sent();
                                dbResp.push(result);
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.status(200).json(dbResp);
                return [2 /*return*/];
            });
        });
    };
    // zendpoint: '/package' POST
    // TODO validate and test
    PackageManagementAPI.prototype.handleCreatePackage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var newPackage, url, JsProgram, result, base64, JSprogram, URL_1, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if ("URL" in req.body && "Content" in req.body || !("JSProgram" in req.body)) {
                            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set)');
                        }
                        if (!("URL" in req.body)) return [3 /*break*/, 2];
                        newPackage = req.body;
                        url = newPackage.URL;
                        JsProgram = newPackage.JsProgram;
                        return [4 /*yield*/, helper.APIHelpPackageURL(url, JsProgram)];
                    case 1:
                        result = _a.sent();
                        if ('metadata' in result) {
                            res.status(201).json(result);
                        }
                        else if ('package already exists' in result) {
                            throw new server_errors_1.Server_Error(409, "Package exists already");
                        }
                        else {
                            throw new server_errors_1.Server_Error(424, "Package Disqualified Rating");
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        if (!("Content" in req.body)) return [3 /*break*/, 5];
                        base64 = req.body.Content;
                        JSprogram = req.body.JsProgram;
                        URL_1 = helper.APIHelpPackageContent(base64, JSprogram);
                        result = { error: "Package Disqualified Rating" };
                        if (!URL_1) return [3 /*break*/, 4];
                        return [4 /*yield*/, helper.APIHelpPackageURL(URL_1, JSprogram)];
                    case 3:
                        result = _a.sent();
                        logger_1.default.info("".concat(result));
                        _a.label = 4;
                    case 4:
                        if ('metadata' in result) {
                            res.status(201).json(result);
                        }
                        else if ('package exists' in result) {
                            throw new server_errors_1.Server_Error(409, "Package exists already");
                        }
                        else {
                            throw new server_errors_1.Server_Error(424, "Package Disqualified Rating");
                        }
                        return [3 /*break*/, 6];
                    case 5: throw new server_errors_1.Server_Error(400, 'There is missing field(s)');
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set)');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/reset' DELETE
    // TODO test
    PackageManagementAPI.prototype.handleReset = function (req, res) {
        // Skeleton system reset logic (replace with actual logic)
        // For example, you can clear data or perform other reset actions
        // Respond with a success message
        /**
        * 200
        Registry is reset.
        
        400
        There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        401
        You do not have permission to reset the registry.
        */
        // Check if the user is an admin
        var data = req.body.User;
        if (!data.isAdmin) {
            throw new server_errors_1.Server_Error(401, 'You do not have permission to reset the registry.');
        }
        // Pass user to Database to authenticate token and reset if valid
        var result = true; // CHANGE this.database.resetRegistry(data);
        if (!result) {
            throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
        }
        res.json({ message: 'System reset successfully' });
    };
    // endpoint: '/package/:id' GET
    // TODO validate and test
    PackageManagementAPI.prototype.handleGetPackageById = function (req, res) {
        // Skeleton logic to retrieve a package by ID (replace with actual logic)
        // You can access the ID using req.params.id
        /**
        *
        * 200
        Return the package. Content is required.
        
        * 400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        Package does not exist.
        */
        var packageId = req.params.id;
        // Check if packageId is provided and is not empty
        if (!packageId) {
            throw new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.');
        }
        // Perform database query or other actions to get the package by ID
        // For demonstration purposes, let's assume you have a packages database and a function getPackageById
        var package_result = {
            metadata: {
                Name: "Sample Package",
                Version: "1.0.0",
                ID: "smplpkg"
            },
            data: "print('Hello World')"
        }; //getPackageById(packageId);
        if (!package_result) {
            // Package not found
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully retrieved the package
        return res.status(200).json(package_result);
    };
    // endpoint: '/package/:id' PUT
    // TODO validate and test
    PackageManagementAPI.prototype.handleUpdatePackageById = function (req, res) {
        // Skeleton logic to update a package by ID (replace with actual logic)
        // You can access the ID using req.params.id and data using req.body
        /**
        * 200
        Version is updated.
        
        400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        Package does not exist.
        */
        var packageId = req.params.id;
        var updatedPackageData = req.body;
        // Check for top-level required fields in the request body
        var requiredTopLevelFields = ["metadata", "data"];
        var missingTopLevelFields = requiredTopLevelFields.filter(function (field) { return !updatedPackageData[field]; });
        if (missingTopLevelFields.length > 0) {
            throw new server_errors_1.Server_Error(400, "Missing required top-level fields: ".concat(missingTopLevelFields.join(', ')));
        }
        // Check for required subfields within 'metadata' and 'data'
        if (updatedPackageData.metadata) {
            var requiredMetadataFields = ["Name", "Version", "ID"];
            var missingMetadataFields = requiredMetadataFields.filter(function (field) { return !updatedPackageData.metadata[field]; });
            if (missingMetadataFields.length > 0) {
                throw new server_errors_1.Server_Error(400, "Missing required 'metadata' subfields: ".concat(missingMetadataFields.join(', ')));
            }
        }
        if (updatedPackageData.data) {
            var requiredDataFields = ["Content", "URL", "JSProgram"];
            var missingDataFields = requiredDataFields.filter(function (field) { return !updatedPackageData.data[field]; });
            if (missingDataFields.length > 0) {
                throw new server_errors_1.Server_Error(400, "Missing required 'data' subfields: ".concat(missingDataFields.join(', ')));
            }
        }
        // Update the package (replace this with your actual update logic)
        // For demonstration purposes, let's assume you have a packages database and a function updatePackageById
        var updatedPackage = false; //updatePackageById(packageId, updatedPackageData);
        if (!updatedPackage) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully updated package
        return res.status(200).json({
            message: 'Version is updated.',
            updatedPackage: updatedPackage
        });
    };
    // endpoint: '/package/:id' DELETE
    // TODO validate and test
    PackageManagementAPI.prototype.handleDeletePackageById = function (req, res) {
        // Skeleton logic to delete a package by ID (replace with actual logic)
        // You can access the ID using req.params.id
        /**
        * 200
        Version is deleted.
        
        400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        Package does not exist.
        */
        var packageId = req.params.id;
        // Check if the package ID is provided
        if (!packageId) {
            throw new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.');
        }
        // Perform database delete or other actions to delete the package
        // For demonstration purposes, let's assume you have a packages database and a function deletePackageById
        var deletedPackage = false; //deletePackageById(packageId);
        if (!deletedPackage) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully deleted package
        return res.status(200).json({
            message: 'Package is deleted successfully.'
        });
    };
    // endpoint: '/package/:id/rate' GET
    // TODO validate and test
    PackageManagementAPI.prototype.handleRatePackage = function (req, res) {
        // Skeleton logic to rate a package by ID (replace with actual logic)
        // You can access the ID using req.params.id
        /**
        * 200
        Return the rating. Only use this if each metric was computed successfully.
        * 400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        Package does not exist.
        
        500
        The package rating system choked on at least one of the metrics.
        */
        var packageId = req.params.id;
        var ratingData = req.body;
        // Check if the package ID is provided
        if (!packageId) {
            throw new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.');
        }
        // Check for required fields in the rating data
        var requiredFields = [
            "BusFactor",
            "Correctness",
            "RampUp",
            "ResponsiveMaintainer",
            "LicenseScore",
            "GoodPinningPractice",
            "PullRequest",
            "NetScore"
        ];
        var missingFields = requiredFields.filter(function (field) { return typeof ratingData[field] !== 'number'; });
        if (missingFields.length > 0) {
            throw new server_errors_1.Server_Error(400, "Missing or invalid rating fields: ".concat(missingFields.join(', ')));
        }
        // Perform rating logic or database updates here
        // For demonstration purposes, let's assume you have a package ratings database and a function ratePackage
        var ratedPackage = {}; //ratePackage(packageId, ratingData);
        if (!ratedPackage) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully rated package
        return res.status(200).json(ratedPackage);
    };
    // endpoint: '/authenticate' PUT
    // currently out of scope, will implement if we have time
    PackageManagementAPI.prototype.handleAuthenticateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var secretKey, username, isAdmin, password, isValidUser, userObj, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: throw new server_errors_1.Server_Error(501, 'This system does not support authentication.');
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
                        error_2 = _a.sent();
                        res.status(400).json({ error: 'Missing Fields' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // endpoint: '/package/byName/:name' GET
    // TODO validate and test
    PackageManagementAPI.prototype.handleGetPackageByName = function (req, res) {
        // Skeleton logic to retrieve a package by name (replace with actual logic)
        // You can access the name using req.params.name
        /**
        *
        * 200
        Return the package history.
        
        * 400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        Package does not exist.
        */
        var packageName = req.params.name;
        // Check if the package name is provided
        if (!packageName) {
            throw new server_errors_1.Server_Error(400, 'Package name is missing or invalid.');
        }
        // Perform a database query or other actions to retrieve the package history by name
        // For demonstration purposes, let's assume you have a packages database and a function getPackageByName
        var packageHistory = {}; //getPackageByName(packageName);
        if (!packageHistory) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully retrieved package history
        return res.status(200).json(packageHistory);
    };
    // endpoint: '/package/byName/:name' DELETE
    // TODO validate and test
    PackageManagementAPI.prototype.handleDeletePackageByName = function (req, res) {
        // Skeleton logic to delete a package by name (replace with actual logic)
        // You can access the name using req.params.name
        /**
        *
        * 200
        Package is deleted.
        
        * 400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        Package does not exist.
        */
        var packageName = req.params.name;
        // Check if the package name is provided
        if (!packageName) {
            throw new server_errors_1.Server_Error(400, 'Package name is missing or invalid.');
        }
        // Perform database delete or other actions to delete the package by name
        // For demonstration purposes, let's assume you have a packages database and a function deletePackageByName
        var deletedPackage = false; //deletePackageByName(packageName);
        if (!deletedPackage) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully deleted package
        return res.status(200).json({
            message: 'Package is deleted successfully.'
        });
    };
    // endpoint: '/package/byRegEx' POST
    // TODO validate and test
    PackageManagementAPI.prototype.handleSearchPackagesByRegex = function (req, res) {
        // Skeleton logic to search packages by regex (replace with actual logic)
        // You can access the search parameters using req.body
        /**
        *
        * 200
        Return a list of packages.
        
        * 400
        There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        No package found under this regex.
        */
        var regexPattern = req.body.RegEx; // The property should match the name in the request body
        // Check if the regex pattern is provided
        if (!regexPattern) {
            throw new server_errors_1.Server_Error(400, 'Regular expression pattern is missing.');
        }
        // Perform a search using the regex pattern
        // For demonstration purposes, let's assume you have a packages database and a function searchPackagesByRegex
        var searchResults = []; //searchPackagesByRegex(regexPattern);
        if (searchResults.length === 0) {
            // No packages found matching the regex
            throw new server_errors_1.Server_Error(404, 'No package found under this regex.');
        }
        // Successfully retrieved search results
        return res.status(200).json(searchResults);
    };
    // Start the server on the specified port
    PackageManagementAPI.prototype.start = function (port) {
        this.app.listen(port, function () {
            logger_1.default.info("Server is running on port ".concat(port));
        });
    };
    return PackageManagementAPI;
}());
var apiServer = new PackageManagementAPI();
logger_1.default.info("Starting server on port 3000");
apiServer.start(3000); // alternative port for http - https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
