"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const server_errors_1 = require("./server_errors");
const dbCommunicator_1 = __importDefault(require("../dbCommunicator"));
const logger_1 = __importDefault(require("../logger"));
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
class PackageManagementAPI {
    constructor() {
        this.database = dbCommunicator_1.default;
        this.app = (0, express_1.default)();
        this.app.use(body_parser_1.default.json());
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
    getApp() {
        return this.app;
    }
    // Middleware for error handling
    ErrorHandler(err, req, res, next) {
        let errorMessage;
        let statusCode;
        // Collect multiple errors in an array
        const errors = Array.isArray(err) ? err : [err];
        if (errors.length > 1) {
            err = new server_errors_1.AggregateError(errors);
        }
        errorMessage = err.message;
        statusCode = (err instanceof server_errors_1.Server_Error) ? err.num :
            (err instanceof server_errors_1.AggregateError) ? 500 : // TODO replace with more appropriate error code, or add .num to AggregateError
                500; // default to 500
        // Log and send the error          
        logger_1.default.error(`${err}`); // TODO replace with actual error logging logic
        res.status(statusCode).json({ error: errorMessage });
    }
    // Middleware for authentication (placeholder)
    // curently not working???? idk y
    authenticate(req, res, next) {
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
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////// ENDPOINTS /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // endpoint: '/' GET
    handleDefault(req, res) {
        res.send('Welcome to the package management API!');
    }
    // endpoint: '/packages' POST
    // TODO test
    handleSearchPackages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
              * 200
              List of packages
              
              * 400
              There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
              
              * 413
              Too many packages returned.
              */
            try {
                const data = req.body;
                let dbResp = [];
                if (!Array.isArray(data)) {
                    throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                }
                if (data.length > 100) {
                    throw new server_errors_1.Server_Error(413, "Too many packages returned."); // don't actually know what to do for this error
                }
                // ask database and process
                data.forEach((query) => __awaiter(this, void 0, void 0, function* () {
                    // Query the database for the requested packages
                    const result = yield helper.queryForPackage(query);
                    dbResp.push(result);
                }));
                res.status(200).json(dbResp);
            }
            catch (e) {
                if (e instanceof server_errors_1.Server_Error) {
                    throw e;
                }
                else { // req.body does not conform to Schemas.PackageQuery
                    throw new server_errors_1.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
                }
            }
        });
    }
    // zendpoint: '/package' POST
    // TODO validate helpers and test
    handleCreatePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
              * 201
              Success. Check the ID in the returned metadata for the official ID
              
              * 400
              There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.
              
              * 409
              Package exists already.
              
              * 424
              Package is not uploaded due to the disqualified rating.
              */
            try {
                const newPackage = req.body; // url or base64
                let result;
                if (!newPackage) {
                    throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
                }
                else if ( /* is a url, TODO insert logic to check */true) {
                    result = yield helper.APIHelpPackageURL(newPackage, 'no js program?');
                }
                else { // how to handle base64????
                    result = /* await  */ helper.APIHelpPackageContent(newPackage, 'no js program');
                }
            }
            catch (e) {
                if (e instanceof server_errors_1.Server_Error) {
                    throw e;
                }
                else { // might never reach this branch, is likely caught in helper functions, but just in case
                    throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
                }
            }
            res.status(201).json(result);
        });
    }
    // endpoint: '/reset' DELETE
    // TODO test
    handleReset(req, res) {
        /**
          * 200
          Registry is reset.
          
          * 400
          There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
          
          * 401
          You do not have permission to reset the registry.
          */
        // Check if the user is an admin
        try {
            const data = req.body.User;
            if (!data.isAdmin) {
                throw new server_errors_1.Server_Error(401, 'You do not have permission to reset the registry.');
            }
            // Pass user to Database to authenticate token and reset if valid
            const result = this.database.resetRegistry(data);
            if (!result) {
                throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
            }
        }
        catch (e) {
            if (e instanceof server_errors_1.Server_Error) {
                throw e;
            }
            else { // req.body does not conform to Schemas.User
                throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
            }
        }
        res.json({ message: 'System reset successfully' });
    }
    // endpoint: '/package/:id' GET
    // TODO test
    handleGetPackageById(req, res) {
        /**
          * 200
          Return the package. Content is required.
          
          * 400
          There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
          
          * 404
          Package does not exist.
          */
        const packageId = req.params.id;
        // Check if packageId is provided and is not empty
        if (!packageId) {
            throw new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.');
        }
        // Perform database query or other actions to get the package by ID
        // For demonstration purposes, let's assume you have a packages database and a function getPackageById
        const package_result = this.database.getPackageById(packageId);
        if (!package_result) {
            // Package not found
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully retrieved the package
        return res.status(200).json(package_result);
    }
    // endpoint: '/package/:id' PUT
    // TODO test
    handleUpdatePackageById(req, res) {
        /**
          * 200
          Version is updated.
          
          * 400
          There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
          
          * 404
          Package does not exist.
          */
        try {
            const packageId = req.params.id;
            const updatedPackageData = req.body;
            // Update the package (replace this with your actual update logic)
            // For demonstration purposes, let's assume you have a packages database and a function updatePackageById
            const updatedPackage = this.database.updatePackageById(packageId, updatedPackageData);
            if (!updatedPackage) {
                // Package does not exist
                throw new server_errors_1.Server_Error(404, 'Package not found.');
            }
        }
        catch (e) {
            if (e instanceof server_errors_1.Server_Error) {
                throw e;
            }
            else { // req.body does not conform to Schemas.Package
                throw new server_errors_1.Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
            }
        }
        // Successfully updated package
        return res.status(200).json('Version is updated.');
    }
    // endpoint: '/package/:id' DELETE
    // TODO test
    handleDeletePackageById(req, res) {
        /**
          * 200
          Version is deleted.
          
          * 400
          There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
          
          * 404
          Package does not exist.
          */
        const packageId = req.params.id;
        // Check if the package ID is provided
        if (!packageId) {
            throw new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.');
        }
        // Perform database delete or other actions to delete the package
        // For demonstration purposes, let's assume you have a packages database and a function deletePackageById
        const deletedPackage = this.database.deletePackageById(packageId);
        if (!deletedPackage) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully deleted package
        return res.status(200).json({
            message: 'Package is deleted successfully.'
        });
    }
    // endpoint: '/package/:id/rate' GET
    // TODO test
    handleRatePackage(req, res) {
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
        const packageId = req.params.id;
        // Check if the package ID is provided
        if (!packageId) {
            throw new server_errors_1.Server_Error(400, 'Package ID is missing or invalid.');
        }
        // Perform rating logic or database updates here
        // For demonstration purposes, let's assume you have a package ratings database and a function ratePackage
        const ratedPackage = this.database.getPackageRatings(packageId);
        if (!ratedPackage) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully rated package
        return res.status(200).json(ratedPackage);
    }
    // endpoint: '/authenticate' PUT
    // TODO currently out of scope, will implement if we have time
    handleAuthenticateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new server_errors_1.Server_Error(501, 'This system does not support authentication.');
            /**
            *
            * 200
            Return an AuthenticationToken.
            
            * 400
            There is missing field(s) in the AuthenticationRequest or it is formed improperly.
            
            401
            The user or password is invalid.
            
            501
            This system does not support authentication.
            */
            const secretKey = 'ECE461';
            try {
                const username = req.body.User.name;
                const isAdmin = req.body.User.isAdmin;
                const password = req.body.Secret.password;
                if (!username || !password || req.body.User.isAdmin == null) {
                    res.status(400).json({ error: 'Missing Fields' });
                    return;
                }
                // Implement your actual user authentication logic here
                const isValidUser = yield helper.getUserAPIKey(username, password);
                //Temporary 'Base Case' Authentication
                if (!isValidUser) {
                    throw new server_errors_1.Server_Error(401, 'User or Password is invalid');
                }
                // Create the user object to include in the JWT token
                const userObj = req.body.User;
                /**
                *  {
                username: username,
                isAdmin: isAdmin,
            };
            */
                // Sign the JWT token
                // const token = jwt.sign(userObj, secretKey, { expiresIn: '10h' });
                // Return the token in the "Bearer" format
                // res.status(200).send(`"bearer ${token}"`);
            }
            catch (error) {
                res.status(400).json({ error: 'Missing Fields' });
            }
        });
    }
    // endpoint: '/package/byName/:name' GET
    // TODO currently out of scope, will implement if we have time
    handleGetPackageByName(req, res) {
        throw new server_errors_1.Server_Error(501, 'This system does not support package history.');
        /**
        *
        * 200
        Return the package history.
        
        * 400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        404
        Package does not exist.
        */
        const packageName = req.params.name;
        // Check if the package name is provided
        if (!packageName) {
            throw new server_errors_1.Server_Error(400, 'Package name is missing or invalid.');
        }
        // Perform a database query or other actions to retrieve the package history by name
        // For demonstration purposes, let's assume you have a packages database and a function getPackageByName
        const packageHistory = {}; //getPackageByName(packageName);
        if (!packageHistory) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully retrieved package history
        return res.status(200).json(packageHistory);
    }
    // endpoint: '/package/byName/:name' DELETE
    // TODO test
    handleDeletePackageByName(req, res) {
        /**
         * 200
         Package is deleted.
        
        * 400
        There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        * 404
        Package does not exist.
        */
        const packageName = req.params.name;
        // Check if the package name is provided
        if (!packageName) {
            throw new server_errors_1.Server_Error(400, 'Package name is missing or invalid.');
        }
        // Perform database delete or other actions to delete the package by name
        // For demonstration purposes, let's assume you have a packages database and a function deletePackageByName
        const deletedPackage = this.database.deletePackageByName(packageName);
        if (!deletedPackage) {
            // Package does not exist
            throw new server_errors_1.Server_Error(404, 'Package not found.');
        }
        // Successfully deleted package
        return res.status(200).json('Package is deleted successfully.');
    }
    // endpoint: '/package/byRegEx' POST
    // TODO test
    handleSearchPackagesByRegex(req, res) {
        /**
         * 200
         Return a list of packages.
        
        * 400
        There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
        
        * 404
        No package found under this regex.
        */
        const regexPattern = req.body.RegEx; // The property should match the name in the request body
        // Check if the regex pattern is provided
        if (!regexPattern) {
            throw new server_errors_1.Server_Error(400, 'Regular expression pattern is missing.');
        }
        // Perform a search using the regex pattern
        // For demonstration purposes, let's assume you have a packages database and a function searchPackagesByRegex
        const searchResults = this.database.searchPackagesByRegex(regexPattern);
        if (searchResults.length === 0) {
            // No packages found matching the regex
            throw new server_errors_1.Server_Error(404, 'No package found under this regex.');
        }
        // Successfully retrieved search results
        return res.status(200).json(searchResults);
    }
    // Start the server on the specified port
    start(port) {
        this.app.listen(port, () => {
            logger_1.default.info(`Server is running on port ${port}`);
        });
    }
}
const port = 3000;
const apiServer = new PackageManagementAPI();
logger_1.default.info(`Starting server on port ${port}`);
apiServer.start(port);
