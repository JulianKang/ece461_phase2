import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import * as helper from './server_helper'
import dbCommunicator from '../dbCommunicator';
import { Server_Error, AggregateError } from './server_errors'
import logger from '../logger'
import * as Schemas from '../schemas';
const jwt = require('jsonwebtoken');
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
	private app: express.Express;
	private database = dbCommunicator;
	
	constructor() {
		this.app = express();
		this.app.use(bodyParser.json());
		
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
	public getApp(): express.Express {
		return this.app;
	}
	
	// Middleware for error handling
	private ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
		let errorMessage: string;
		let statusCode: number;
		
		// Collect multiple errors in an array
		const errors: Error[] = Array.isArray(err) ? err : [err];
		if (errors.length > 1) {
			err = new AggregateError(errors);
		}
		
		errorMessage = err.message;
		statusCode = (err instanceof Server_Error) ? err.num :
					(err instanceof AggregateError) ? 500 : // TODO replace with more appropriate error code, or add .num to AggregateError
					500; // default to 500
		
		// Log and send the error          
		logger.error(`${err}`); // TODO replace with actual error logging logic
		res.status(statusCode).json({ error: errorMessage });
	}
	
	
	// Middleware for authentication (placeholder)
	// curently not working???? idk y
	private authenticate(req: Request, res: Response, next: NextFunction) {
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
		
		throw new Server_Error(401, 'Authentication failed');
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////// ENDPOINTS /////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// endpoint: '/' GET
	private handleDefault(req: Request, res: Response) {
		res.send('Welcome to the package management API!');
	}
	
	// endpoint: '/packages' POST
	// TODO test
	private async handleSearchPackages(req: Request, res: Response): Promise<void> {
		/**
		  * 200	
		  List of packages
		  
		  * 400	
		  There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		  
		  * 413	
		  Too many packages returned.
		  */
		try {
			const data: Schemas.PackageQuery[] = req.body;
			let dbResp: Schemas.PackageMetadata[][] = [];

			if (!Array.isArray(data)) {
				throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
			}
			if (data.length > 100) {
				throw new Server_Error(413, "Too many packages returned."); // don't actually know what to do for this error
			}
			
			// ask database and process
			data.forEach(async (query) => {
				// Query the database for the requested packages
				const result = await helper.queryForPackage(query);
				dbResp.push(result);
			});
		
			res.status(200).json(dbResp);
		} catch(e) {
			if (e instanceof Server_Error) {
				throw e;
			} else { // req.body does not conform to Schemas.PackageQuery
				throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
			}
		}
	}
	
	// zendpoint: '/package' POST
	// TODO validate helpers and test
	private async handleCreatePackage(req: Request, res: Response) {
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
			const newPackage: Schemas.PackageData = req.body // url or base64
			let result: Schemas.Package;

			if (!newPackage) {
				throw new Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
			} else if (/* is a url, TODO insert logic to check */ true) {
				result = await helper.APIHelpPackageURL(newPackage, 'no js program?')
			} else { // how to handle base64????
				result = /* await  */helper.APIHelpPackageContent(newPackage, 'no js program')
			}
		} catch (e) {
			if (e instanceof Server_Error) {
				throw e;
			} else { // might never reach this branch, is likely caught in helper functions, but just in case
				throw new Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
			}
		}

		res.status(201).json(result);
	}
	
	// endpoint: '/reset' DELETE
	// TODO test
	private handleReset(req: Request, res: Response) {
		/**
		  * 200	
		  Registry is reset.
		  
		  * 400	
		  There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		  
		  * 401	
		  You do not have permission to reset the registry.
		  */
		// Check if the user is an admin
		try{
			const data: Schemas.User = req.body.User;
			
			if (!data.isAdmin) {
				throw new Server_Error(401, 'You do not have permission to reset the registry.');
			}
			
			// Pass user to Database to authenticate token and reset if valid
			const result = this.database.resetRegistry(data);
			
			if (!result) {
				throw new Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}
		} catch (e) {
			if (e instanceof Server_Error) {
				throw e;
			} else { // req.body does not conform to Schemas.User
				throw new Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}
		}
		res.json({ message: 'System reset successfully' });
	}
	
	// endpoint: '/package/:id' GET
	// TODO test
	private handleGetPackageById(req: Request, res: Response) {
		/**
		  * 200	
		  Return the package. Content is required.
		  
		  * 400	
		  There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		  
		  * 404	
		  Package does not exist.
		  */
		const packageId: Schemas.PackageID = req.params.id;
		
		// Check if packageId is provided and is not empty
		if (!packageId) {
			throw new Server_Error(400, 'Package ID is missing or invalid.');
		}
		
		// Perform database query or other actions to get the package by ID
		// For demonstration purposes, let's assume you have a packages database and a function getPackageById
		const package_result: Schemas.Package = this.database.getPackageById(packageId);
		
		if (!package_result) {
			// Package not found
			throw new Server_Error(404, 'Package not found.');
		}
		
		// Successfully retrieved the package
		return res.status(200).json(package_result);
	}
	
	// endpoint: '/package/:id' PUT
	// TODO test
	private handleUpdatePackageById(req: Request, res: Response) {
		/**
		  * 200	
		  Version is updated.
		  
		  * 400	
		  There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		  
		  * 404	
		  Package does not exist.
		  */
		try {
			const packageId: Schemas.PackageID = req.params.id;
			const updatedPackageData: Schemas.Package = req.body;
			
			
			// Update the package (replace this with your actual update logic)
			// For demonstration purposes, let's assume you have a packages database and a function updatePackageById
			const updatedPackage: boolean = this.database.updatePackageById(packageId, updatedPackageData);
			
			if (!updatedPackage) {
				// Package does not exist
				throw new Server_Error(404, 'Package not found.');
			}
		} catch(e) {
			if (e instanceof Server_Error) {
				throw e;
			} else { // req.body does not conform to Schemas.Package
				throw new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}
		}

		// Successfully updated package
		return res.status(200).json('Version is updated.');
	}
	
	// endpoint: '/package/:id' DELETE
	// TODO test
	private handleDeletePackageById(req: Request, res: Response) {
		/**
		  * 200	
		  Version is deleted.
		  
		  * 400	
		  There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		  
		  * 404	
		  Package does not exist.
		  */
		
		const packageId: Schemas.PackageID = req.params.id;
		
		// Check if the package ID is provided
		if (!packageId) {
			throw new Server_Error(400, 'Package ID is missing or invalid.');
		}
		
		// Perform database delete or other actions to delete the package
		// For demonstration purposes, let's assume you have a packages database and a function deletePackageById
		const deletedPackage: boolean = this.database.deletePackageById(packageId);
		
		if (!deletedPackage) {
			// Package does not exist
			throw new Server_Error(404, 'Package not found.');
		}
		
		// Successfully deleted package
		return res.status(200).json({
			message: 'Package is deleted successfully.'
		});
	}
	
	// endpoint: '/package/:id/rate' GET
	// TODO test
	private handleRatePackage(req: Request, res: Response) {
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
		const packageId: Schemas.PackageID = req.params.id;
		
		// Check if the package ID is provided
		if (!packageId) {
			throw new Server_Error(400, 'Package ID is missing or invalid.');
		}
		
		// Perform rating logic or database updates here
		// For demonstration purposes, let's assume you have a package ratings database and a function ratePackage
		const ratedPackage: Schemas.PackageRating = this.database.getPackageRatings(packageId);
		
		if (!ratedPackage) {
			// Package does not exist
			throw new Server_Error(404, 'Package not found.');
		}
		
		// Successfully rated package
		return res.status(200).json(ratedPackage);
	}
	
	// endpoint: '/authenticate' PUT
	// TODO currently out of scope, will implement if we have time
	private async handleAuthenticateUser(req: Request, res: Response) {
		throw new Server_Error(501, 'This system does not support authentication.');
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
		
		const secretKey: string = 'ECE461'
		try {
			const username: string = req.body.User.name;
			const isAdmin: boolean = req.body.User.isAdmin;
			const password: string = req.body.Secret.password;
			if (!username || !password || req.body.User.isAdmin == null) {
				res.status(400).json({ error: 'Missing Fields' });
				return;
			}
			// Implement your actual user authentication logic here
			const isValidUser = await helper.getUserAPIKey(username, password);
			
			//Temporary 'Base Case' Authentication
			if (!isValidUser) {
				throw new Server_Error(401, 'User or Password is invalid');
			}
			// Create the user object to include in the JWT token
			const userObj = req.body.User
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
	} catch (error) {
		res.status(400).json({ error: 'Missing Fields' });
	}
	}

	// endpoint: '/package/byName/:name' GET
	// TODO currently out of scope, will implement if we have time
	private handleGetPackageByName(req: Request, res: Response) {
		throw new Server_Error(501, 'This system does not support package history.');
		/**
		* 
		* 200	
		Return the package history.
		
		* 400	
		There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		
		404	
		Package does not exist.
		*/
		
		const packageName: Schemas.PackageName = req.params.name;
		
		// Check if the package name is provided
		if (!packageName) {
			throw new Server_Error(400, 'Package name is missing or invalid.');
		}
		
		// Perform a database query or other actions to retrieve the package history by name
		// For demonstration purposes, let's assume you have a packages database and a function getPackageByName
		const packageHistory: object = {}//getPackageByName(packageName);
		
		if (!packageHistory) {
			// Package does not exist
			throw new Server_Error(404, 'Package not found.');
		}
		
		// Successfully retrieved package history
		return res.status(200).json(packageHistory);
	}

	// endpoint: '/package/byName/:name' DELETE
	// TODO test
	private handleDeletePackageByName(req: Request, res: Response) {
		/**
		 * 200	
		 Package is deleted.
		
		* 400	
		There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		
		* 404	
		Package does not exist.
		*/
		const packageName: Schemas.PackageName = req.params.name;
		
		// Check if the package name is provided
		if (!packageName) {
			throw new Server_Error(400, 'Package name is missing or invalid.');
		}
		
		// Perform database delete or other actions to delete the package by name
		// For demonstration purposes, let's assume you have a packages database and a function deletePackageByName
		const deletedPackage: boolean = this.database.deletePackageByName(packageName);
		
		if (!deletedPackage) {
			// Package does not exist
			throw new Server_Error(404, 'Package not found.');
		}
		
		// Successfully deleted package
		return res.status(200).json('Package is deleted successfully.');
	}

	// endpoint: '/package/byRegEx' POST
	// TODO test
	private handleSearchPackagesByRegex(req: Request, res: Response) {
		/**
		 * 200	
		 Return a list of packages.
		
		* 400	
		There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		
		* 404	
		No package found under this regex.
		*/
		
		const regexPattern: Schemas.PackageRegEx = req.body.RegEx; // The property should match the name in the request body
		
		// Check if the regex pattern is provided
		if (!regexPattern) {
			throw new Server_Error(400, 'Regular expression pattern is missing.');
		}
		
		// Perform a search using the regex pattern
		// For demonstration purposes, let's assume you have a packages database and a function searchPackagesByRegex
		const searchResults: Schemas.PackageMetadata[] = this.database.searchPackagesByRegex(regexPattern);
		
		if (searchResults.length === 0) {
			// No packages found matching the regex
			throw new Server_Error(404, 'No package found under this regex.');
		}
		
		// Successfully retrieved search results
		return res.status(200).json(searchResults);
	}

	// Start the server on the specified port
	start(port: number) {
		this.app.listen(port, () => {
			logger.info(`Server is running on port ${port}`);
		});
	}
}

const port = 3000
const apiServer = new PackageManagementAPI();
logger.info(`Starting server on port ${port}`);
apiServer.start(port);