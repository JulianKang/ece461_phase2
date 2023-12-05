// const jwt = require('jsonwebtoken');
import express, { Request, Response, NextFunction } from 'express';
import "express-async-errors"; 
import { Server } from "http";
import bodyParser from 'body-parser';
import { Server_Error, AggregateError } from './server_errors'
import logger from '../logger'
import * as Schemas from '../schemas';
import * as helper from './server_helper';
import dbCommunicator from '../dbCommunicator';
import Evaluate = Schemas.Evaluate;
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

export class PackageManagementAPI {
	private app: express.Express;
	private server: Server | null = null;
	private database = dbCommunicator;
	
	constructor() {
		this.app = express();
		this.app.use(bodyParser.json());
		this.database.connect();

		// authenticate middleware
		this.app.use(this.authenticate);
		
		// Define routes
		this.app.get('/', 						 this.handleDefault.bind(this));
		this.app.post('/packages', 				 this.handleSearchPackages.bind(this));
		this.app.delete('/reset', 				 this.handleReset.bind(this));
		this.app.get('/package/:id', 			 this.handleGetPackageById.bind(this));
		this.app.put('/package/:id', 			 this.handleUpdatePackageById.bind(this));
		this.app.delete('/package/:id', 		 this.handleDeletePackageById.bind(this));
		this.app.post('/package', 				 this.handleCreatePackage.bind(this));
		this.app.get('/package/:id/rate', 		 this.handleRatePackage.bind(this));
		this.app.put('/authenticate', 			 this.handleAuthenticateUser.bind(this));
		this.app.get('/package/byName/:name', 	 this.handleGetPackageByName.bind(this));
		this.app.delete('/package/byName/:name', this.handleDeletePackageByName.bind(this));
		this.app.post('/package/byRegEx', 		 this.handleSearchPackagesByRegex.bind(this));
		
		// error handling after everything else
		this.app.use(this.ErrorHandler);
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
					(err instanceof AggregateError) ? err.num : // TODO replace with more appropriate error code, or add .num to AggregateError
					500; // default to 500
		
		// Log and send the error   
		logger.error(`Code:${statusCode} -> Message: ${err}`); // TODO replace with actual error logging logic
		res.status(statusCode).json({ error: errorMessage });
		next();
	}
	
	
	// Middleware for authentication (placeholder)
	// curently not working???? idk y
	private async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
		// Check the request path to skip authentication for specific routes
		if (req.path === '/authenticate' || req.path === '/') {
			next(); // Skip authentication for the /authenticate route
			return;
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
			return;
		}
		
		throw new Server_Error(401, 'Authentication failed');
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////// ENDPOINTS /////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// endpoint: '/' GET
	private handleDefault(req: Request, res: Response) {
		res.send('Welcome to the package management API!');
		res.status(200)
	}
	
	// endpoint: '/packages' POST
	private async handleSearchPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
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
			if (data.length === 0) {
				throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
			}
			
			// ask database and process
			await Promise.all(data.map(async (query) => {
				// check if query is valid format
				if (!Evaluate.isPackageQuery(query)) {
					throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
				}
			
				// Query the database for the requested packages
				const result = await helper.queryForPackage(query);
				dbResp.push(result);
			}));
		
			res.status(200).json(dbResp);
		} catch(e) {
			let err: Server_Error;
			if (!(e instanceof Server_Error)) {
				err = new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
			} else {
				err = e;
			}
			next(err);
		}
	}
	
	// zendpoint: '/package' POST
	private async handleCreatePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
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
			if(!req.body || !Evaluate.isPackageData(req.body)) {
				throw new Server_Error(400, "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.");
			}

			// PackageData is valid format
			const newPackage: Schemas.PackageData = req.body // url or base64
			let result: Schemas.Package;

			if ((newPackage.URL && newPackage.Content) || !Evaluate.isPackageJSProgram(newPackage.JSProgram)) {
				throw new Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
			} else if (newPackage.URL) {
				result = await helper.APIHelpPackageURL(newPackage.URL, newPackage.JSProgram);
			} else if (newPackage.Content) {
				result = await helper.APIHelpPackageContent(newPackage.Content, newPackage.JSProgram);
			} else {
				throw new Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
			}
			res.status(201).json(result);
		} catch (e) {
			let err: Server_Error;
			if (e instanceof Server_Error) {
				err = e;
			} else { // might never reach this branch, is likely caught in helper functions, but just in case
				err = new Server_Error(400, 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.');
			}
			next(err);
		}
	}
	
	// endpoint: '/reset' DELETE
	private async handleReset(req: Request, res: Response, next: NextFunction): Promise<void> {
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
			if (!Evaluate.isUser(req.body.user)) {
				throw new Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}

			// User is valid format
			const data: Schemas.User = req.body.user;
			
			// TODO we currently do are not supporting this feature
			// if (!data.isAdmin) {
			// 	throw new Server_Error(401, 'You do not have permission to reset the registry.');
			// }
			
			// Pass user to Database to authenticate token and reset if valid
			const result = await this.database.resetRegistry();//data);
			
			if (!result) {
				throw new Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}

			res.json('System reset successfully');
		} catch (e) {
			let err: Server_Error;
			if (e instanceof Server_Error) {
				err = e;
			} else { // req.body does not conform to Schemas.User
				err = new Server_Error(400, 'There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}
			next(err);
		}
	}
	
	// endpoint: '/package/:id' GET
	private async handleGetPackageById(req: Request, res: Response, next: NextFunction): Promise<void> {
		/**
		  * 200	
		  Return the package. Content is required.
		  
		  * 400	
		  There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		  
		  * 404	
		  Package does not exist.
		  */
		if (!req.params.id) {
			next(new Server_Error(400, 'Package ID is missing or invalid.'));
		}
		if (!Evaluate.isPackageID(req.params.id)) {
			next(new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
		}

		// ID is valid format
		const packageId: Schemas.PackageID = req.params.id;
		
		
		// Perform database query or other actions to get the package by ID
		// For demonstration purposes, let's assume you have a packages database and a function getPackageById
		const package_result: Schemas.Package | null = await this.database.getPackageById(packageId);
		
		if (!package_result) {
			// Package not found
			next(new Server_Error(404, 'Package not found.'));
		}
		
		// Successfully retrieved the package
		res.status(200).json(package_result);
	}
	
	// endpoint: '/package/:id' PUT
	private async handleUpdatePackageById(req: Request, res: Response, next: NextFunction): Promise<void> {
		/**
		  * 200	
		  Version is updated.
		  
		  * 400	
		  There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
		  
		  * 404	
		  Package does not exist.
		  */
		 try {
			if (!req.params.id) {
				throw new Server_Error(400, 'Package ID is missing or invalid.');
			}
			if (!Evaluate.isPackageID(req.params.id)) {
				throw new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}
			if (!Evaluate.isPackage(req.body)) {
				throw new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}

			// ID and Package are valid format
			const packageId: Schemas.PackageID = req.params.id;
			const updatedPackage: Schemas.Package = req.body;
			
			if(packageId !== updatedPackage.metadata.ID) {
				throw new Server_Error(400, 'Package ID does not match.');
			}
			
			// Update the package (replace this with your actual update logic)
			// For demonstration purposes, let's assume you have a packages database and a function updatePackageById
			const updatedPackageBool: boolean = await this.database.updatePackageById(updatedPackage);
			
			if (!updatedPackageBool) {
				// Package does not exist
				throw new Server_Error(404, 'Package not found.');
			}
			// Successfully updated package
			res.status(200).json('Version is updated.');
		} catch(e) {
			let err: Server_Error;
			if (e instanceof Server_Error) {
				err = e;
			} else { // req.body does not conform to Schemas.Package
				err = new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
			}
			next(err);
		}
	}
	
	// endpoint: '/package/:id' DELETE
	// TODO test
	// not baseline
	private async handleDeletePackageById(req: Request, res: Response, next: NextFunction): Promise<void> {
		next(new Server_Error(501, 'This system does not support Delete by ID.'));
		return;
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
				next(new Server_Error(400, 'Package ID is missing or invalid.'));
			} else {
				next(new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
			}
		}

		// ID is valid format
		const packageId: Schemas.PackageID = req.params.id;
		
		// Check if the package ID is provided
		if (!packageId) {
			next(new Server_Error(400, 'Package ID is missing or invalid.'));
		}
		
		// Perform database delete or other actions to delete the package
		// For demonstration purposes, let's assume you have a packages database and a function deletePackageById
		const deletedPackage: boolean = await this.database.deletePackageById(packageId);
		
		if (!deletedPackage) {
			// Package does not exist
			next(new Server_Error(404, 'Package not found.'));
		}
		
		// Successfully deleted package
		res.status(200).json({
			message: 'Package is deleted successfully.'
		});
	}
	
	// endpoint: '/package/:id/rate' GET
	private async handleRatePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
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
			next(new Server_Error(400, 'Package ID is missing or invalid.'));
		}
		if (!Evaluate.isPackageID(req.params.id)) {
			next(new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
		}

		// ID is valid format
		const packageId: Schemas.PackageID = req.params.id;
		
		// Perform rating logic or database updates here
		// For demonstration purposes, let's assume you have a package ratings database and a function ratePackage
		const ratedPackage: Schemas.PackageRating | null = await this.database.getPackageRatings(packageId);
		
		if (!ratedPackage) {
			// Package does not exist
			next(new Server_Error(404, 'Package not found.'));
		}
		
		// Successfully rated package
		res.status(200).json(ratedPackage);
	}
	
	// endpoint: '/authenticate' PUT
	// TODO currently out of scope, will implement if we have time
	// not baseline
	private async handleAuthenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		next(new Server_Error(501, 'This system does not support authentication.'));
		return;
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
	// not baseline
	private async handleGetPackageByName(req: Request, res: Response, next: NextFunction): Promise<void> {
		next(new Server_Error(501, 'This system does not support package history.'));
		return
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
		res.status(200).json(packageHistory);
	}

	// endpoint: '/package/byName/:name' DELETE
	// TODO test
	// not baseline
	private async handleDeletePackageByName(req: Request, res: Response, next: NextFunction): Promise<void> {
		next(new Server_Error(501, 'This system does not support Delete by Name.'));
		return;
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
				next(new Server_Error(400, 'Package name is missing or invalid.'));
			} else {
				next(new Server_Error(400, 'There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
			}
		}

		// Name is valid format
		const packageName: Schemas.PackageName = req.params.name;
		
		// Check if the package name is provided
		if (!packageName) {
			next(new Server_Error(400, 'Package name is missing or invalid.'));
		}
		
		// Perform database delete or other actions to delete the package by name
		// For demonstration purposes, let's assume you have a packages database and a function deletePackageByName
		const deletedPackage: boolean = await this.database.deletePackageByName(packageName);
		
		if (!deletedPackage) {
			// Package does not exist
			next(new Server_Error(404, 'Package not found.'));
		}
		
		// Successfully deleted package
		res.status(200).json('Package is deleted successfully.');
	}

	// endpoint: '/package/byRegEx' POST
	private async handleSearchPackagesByRegex(req: Request, res: Response, next: NextFunction): Promise<void> {
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
				next(new Server_Error(400, 'Regular expression pattern is missing.'));
			} else {
				next(new Server_Error(400, 'There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.'));
			}
		}

		// RegEx is valid format
		const regexPattern: Schemas.PackageRegEx = req.body.RegEx; // The property should match the name in the request body
		
		// Perform a search using the regex pattern
		// For demonstration purposes, let's assume you have a packages database and a function searchPackagesByRegex
		const searchResults: Schemas.PackageMetadata[] = await this.database.searchPackagesByRegex(regexPattern);
		
		if (searchResults.length === 0) {
			// No packages found matching the regex
			next(new Server_Error(404, 'No package found under this regex.'));
		}
		
		// Successfully retrieved search results
		res.status(200).json(searchResults);
	}

	// Start the server on the specified port
	start(port: number) {
		this.server = this.app.listen(port, () => {
			logger.info(`Server is running on port ${port}`);
		});
	}

	async close() {
		if (!this.server) {
			return;
		}
		this.server.close(()=>{
			logger.info(`Server is closed`)
		});

	}
}