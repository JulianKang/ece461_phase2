const { Buffer } = require('buffer');
const AdmZip = require('adm-zip');
import * as fs from 'fs';
import { error } from 'console';
import { fetchDataAndCalculateScore } from '../adjusted_main'
import { Server_Error } from './server_errors'
import dbCommunicator from '../dbCommunicator';
import logger from '../logger';
import * as Schemas from '../schemas';
import Evaluate = Schemas.Evaluate;

export async function APIHelpPackageContent(base64: Schemas.PackageContent, JsProgram: Schemas.PackageJSProgram): Promise<Schemas.Package> {
    const zipBuffer: Buffer = Buffer.from(base64, 'base64');
    const unzipDir = './src/cloned_repositories';

    if (!fs.existsSync(unzipDir)) {
        fs.mkdirSync(unzipDir);
    }
    let gitRemoteUrl: Schemas.PackageURL;

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

        if(!Evaluate.isPackageURL(gitRemoteUrl) || !Evaluate.isPackageJSProgram(JsProgram)) {
            throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
        }

        return await APIHelpPackageURL(gitRemoteUrl, JsProgram, base64);
    } catch (error) {
        if(error instanceof Server_Error) {
            throw error;
        }
        throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
    }
}

export async function APIHelpPackageURL(url: Schemas.PackageURL, JsProgram: Schemas.PackageJSProgram, content?: Schemas.PackageContent): Promise<Schemas.Package> {
    try {
        const result: Schemas.PackageRating = await fetchDataAndCalculateScore(url);
        //Check to see if Scores Fulfill the threshold if not return a different return code
        // Believe they all have to be over 0.5
        const keys: string[] = Object.keys(result)
        for (const key of keys) {
            const value = result[key as keyof Schemas.PackageRating];
            if (typeof value === 'number' && value < 0.5) {
                logger.info(`Package is not uploaded due to the disqualified rating. ${key} is ${value} for ${url}`)
                throw new Server_Error(424, "Package is not uploaded due to the disqualified rating.")
            }
        }

        // TODO logic for content
        if(!content) {

        }

        // convert their metrics to PackageRating, and get two new metrics
        let newPackageRating: Schemas.PackageRating;
        let newPackage: Schemas.Package;
        // TODO Put in logic to store package in database and download as zipfile


        // Store in database
        const db_response_package: number = await dbCommunicator.injestPackage(newPackage);
        if(db_response_package == -1) {
            throw new Server_Error(409, "Package already exists")
        } else if(db_response_package == 0) {
            throw new Server_Error(500, "Internal Server Error")
        }

        const db_response_ratings: boolean = await dbCommunicator.injestPackageRatings(newPackageRating, newPackage.metadata.ID);

        if(!db_response_ratings) {
            throw new Server_Error(500, "Internal Server Error")
        }

        return newPackage;
    } catch (error) {
        // propogate error
        throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
    }
}

export async function getUserAPIKey(username: string, password: string): Promise<string | boolean> {
    const admin = username === "ece30861defaultadminuser" && password === "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;";
    if(admin){
        return true
    }

    let authenication = await dbCommunicator.authenticateUser(username, password);
    if (!authenication) {
        return false;
    }

    return authenication;
}

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
            throw new Server_Error(400, "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
        }
    });
    // "1.2.3", "1.2.3-2.1.0", "^1.2.3", "~1.2.0"
    // query DB for package based on name and each requested version
    let foundPackages: Schemas.PackageMetadata[] = [];
    for (const version of versions) {
        const packageData = await dbCommunicator.getPackageMetadata(Input.Name, version);  
        foundPackages.push(...packageData);
        if(foundPackages.length > 100) {
            throw new Server_Error(413, "Too many packages returned");
        }
    }

    // make unique list
    foundPackages = foundPackages.filter((item, index) => {
        return foundPackages.findIndex(obj => obj.Name === item.Name && obj.Version === item.Version) === index;
    });
    
    return foundPackages;
}