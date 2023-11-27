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
const fs = __importStar(require("fs"));
// import DBCommunicator from '../dbCommunicator';
const adjusted_main_1 = require("../adjusted_main");
const SE = __importStar(require("./server_errors"));
const logger_1 = __importDefault(require("../logger"));
const console_1 = require("console");
const { Buffer } = require('buffer');
const AdmZip = require('adm-zip');
function APIHelpPackageContent(base64, JsProgram) {
    const zipBuffer = Buffer.from(base64, 'base64');
    const unzipDir = './src/cloned_repositories';
    if (!fs.existsSync(unzipDir)) {
        fs.mkdirSync(unzipDir);
    }
    let gitRemoteUrl = '';
    let githubUrl = null;
    try {
        const zip = new AdmZip(zipBuffer);
        const zipEntries = zip.getEntries();
        let foundURL = false;
        zipEntries.forEach((entry) => {
            if (!entry.isDirectory && !foundURL) {
                const entryName = entry.entryName;
                const entryData = entry.getData();
                const outputPath = `${unzipDir}/${entryName}`;
                // Create subdirectories if they don't exist
                const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                // Write the entry data to the corresponding file
                fs.writeFileSync(outputPath, entryData);
                //logger.info(`Extracted: ${entryName}`);
                // Check for package.json with GitHub URL
                if (entryName.includes('package.json')) {
                    //logger.info('here');
                    const packageJson = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
                    if (packageJson.repository && packageJson.repository.url) {
                        gitRemoteUrl = packageJson.repository.url.split('+')[1].replace('.git', '');
                        foundURL = true; // Set the flag to true when the URL is found
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
        logger_1.default.error(`${error}`);
        return gitRemoteUrl;
    }
}
exports.APIHelpPackageContent = APIHelpPackageContent;
function APIHelpPackageURL(url, JsProgram) {
    return __awaiter(this, void 0, void 0, function* () {
        const error_response = { error: 'Package is not uploaded due to the disqualified rating.' };
        try {
            const result = yield (0, adjusted_main_1.fetchDataAndCalculateScore)(url);
            //Check to see if Scores Fulfill the threshold if not return a different return code
            // Believe they all have to be over 0.5
            const keys = Object.keys(result);
            for (const key of keys) {
                const value = result[key];
                if (typeof value === 'number' && value < 0) {
                    //logger.info(value)
                    return error_response;
                }
            }
            const package_exists = false; //DataBase.ScanForPacakge(url)
            if (package_exists) {
                return { error: 'package already exists' };
            }
            else {
                //DataBase.AddPackage(url, metrics, ...)
            }
            // TODO Put in logic to store package in database and download as zipfile
            //Check if already in database too should be something like:
            // upload = DataBaseManager.InsertFromUrl(url, result)
            // upload includes data for success_response or error
            // if error in upload: {return alread_exists_response} else{} do whats below
            const success_response = {
                metadata: {
                    Name: "Underscore",
                    Version: "1.0.0",
                    ID: "underscore"
                },
                data: "Base64 of zipfile"
            };
            return success_response;
            //res.status(201).json(newPackage);
        }
        catch (error_out) {
            console.error('Error in fetchDataAndCalculateScore:', error_out);
            const error_response = {
                error: "Invalid package format. Please ensure the package meets the required format."
            };
            return error_response;
        }
    });
}
exports.APIHelpPackageURL = APIHelpPackageURL;
function getUserAPIKey(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // const admin = username === "ece30861defaultadminuser" && password === "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;";
        // if(admin){
        //     return true
        // }
        let authenication = 'abc123'; //await DBCommunicator.authenticateUser(username, password);
        if (!authenication) {
            return false;
        }
        return authenication;
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
    return __awaiter(this, void 0, void 0, function* () {
        // process "Version"
        const versionRegex = /\(([^)]+)\)/;
        const lines = Input.Version.split('\n');
        const versions = lines.map((line) => {
            try {
                const match = line.match(versionRegex);
                if (!match) {
                    throw console_1.error;
                }
                return match[1];
            }
            catch (error) {
                throw new SE.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
            }
        });
        // query DB for package based on name and each requested version
        let foundPackages = [];
        for (const version of versions) {
            // const packageData = await DBCommunicator.getPackage(Input.Name, version); 
            const packageData = {
                Name: Input.Name,
                Version: version,
                ID: 'id'
            };
            if (packageData) {
                foundPackages.push(packageData);
            }
        }
        return foundPackages;
    });
}
exports.queryForPackage = queryForPackage;
