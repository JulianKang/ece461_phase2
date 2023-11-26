/*************************************************
 * 
 * Ideas:
 * 1. DataBase Communicator Object?
 * 2. Handle all API Computations. API should only handle responses nothing else.
 * 3. 
 * 
 * ************************************************** */
import * as fs from 'fs';
import path from 'path';
// import DBCommunicator from '../dbCommunicator';
import { fetchDataAndCalculateScore } from '../adjusted_main'
import * as SE from './server_errors'
import logger from '../logger';
import * as Schemas from '../schemas';
import { error } from 'console';
const { Buffer } = require('buffer');
const AdmZip = require('adm-zip');


export function APIHelpPackageContent(base64: Schemas.PackageContent, JsProgram: Schemas.PackageJSProgram) {
    const zipBuffer: Buffer = Buffer.from(base64, 'base64');
    const unzipDir = './src/cloned_repositories';

    if (!fs.existsSync(unzipDir)) {
        fs.mkdirSync(unzipDir);
    }
    let gitRemoteUrl: string = '';
    let githubUrl = null;

    try {
        const zip = new AdmZip(zipBuffer);
        const zipEntries = zip.getEntries();

        let foundURL = false;

        zipEntries.forEach((entry: any) => {
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

        return gitRemoteUrl
    } catch (error) {
        logger.error(`${error}`)
        return gitRemoteUrl
    }
}

export async function APIHelpPackageURL(url: Schemas.PackageURL, JsProgram: Schemas.PackageJSProgram) {
    const error_response: object = { error: 'Package is not uploaded due to the disqualified rating.' }
    console.log(url)
    try {
        const result: Schemas.CLIOutput = await fetchDataAndCalculateScore(url);
        //Check to see if Scores Fulfill the threshold if not return a different return code
        // Believe they all have to be over 0.5
        const keys: string[] = Object.keys(result)
        for (const key of keys) {
            const value = result[key as keyof Schemas.CLIOutput];
            if (typeof value === 'number' && value < 0) {
                //logger.info(value)
                return error_response
            }
        }

        const package_exists = false//DataBase.ScanForPacakge(url)
        if (package_exists) {
            return { error: 'package already exists' }
        }
        else {
            //DataBase.AddPackage(url, metrics, ...)
        }
        // TODO Put in logic to store package in database and download as zipfile
        //Check if already in database too should be something like:
        // upload = DataBaseManager.InsertFromUrl(url, result)
        // upload includes data for success_response or error
        // if error in upload: {return alread_exists_response} else{} do whats below
        const success_response: Schemas.Package = { //temp success_response, would really want to return data base object
            metadata: {
                Name: "Underscore",
                Version: "1.0.0",
                ID: "underscore"
            },
            data: "Base64 of zipfile"
        }

        return success_response
        //res.status(201).json(newPackage);
    } catch (error_out) {
        console.error('Error in fetchDataAndCalculateScore:', error_out);
        const error_response = {
            error: "Invalid package format. Please ensure the package meets the required format."
        }
        return error_response
    }
}

export async function getUserAPIKey(username: string, password: string): Promise<string | boolean> {
    // const admin = username === "ece30861defaultadminuser" && password === "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;";
    // if(admin){
    //     return true
    // }

    let authenication = 'abc123' //await DBCommunicator.authenticateUser(username, password);
    if (!authenication) {
        return false;
    }

    return authenication;
}

// TODO explicitly define the typings and set return once DBCommunicator is implemented for package search
/*   
    example input
    {
        "Version": "Exact (1.2.3)\nBounded range (1.2.3-2.1.0)\nCarat (^1.2.3)\nTilde (~1.2.0)",
        "Name": "string"
    }
 */
export async function queryForPackage(Input: Schemas.PackageQuery): Promise<Schemas.PackageMetadata[]> {
    // process "Version"
    const versionRegex = /\(([^)]+)\)/;
    const lines: string[] = Input.Version.split('\n');
    const versions = lines.map((line) => {
        try {
            const match = line.match(versionRegex);
            if(!match) {
                throw error;
            }
            return match[1];
        } catch (error) {
            throw new SE.Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
        }
    });

    // query DB for package based on name and each requested version
    let foundPackages: Schemas.PackageMetadata[] = [];
    for (const version of versions) {
        // const packageData = await DBCommunicator.getPackage(Input.Name, version); 
        const packageData: Schemas.PackageMetadata = { // SWITCH to  DBCommunicator.getPackage once implemented
            Name: Input.Name,
            Version: version,
            ID: 'id'
        }   
        if (packageData) {
            foundPackages.push(packageData);
        }
    }

    return foundPackages;
}