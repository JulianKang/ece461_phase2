import * as fs from 'fs';
import { error } from 'console';
import { fetchDataAndCalculateScore } from '../adjusted_main'
import { Server_Error } from './server_errors'
import dbCommunicator from '../dbCommunicator';
import logger from '../logger';
import * as Schemas from '../schemas';
import Evaluate = Schemas.Evaluate;
const { Buffer } = require('buffer');
const AdmZip = require('adm-zip');

function remove_periods(version: string): string {
    return version.replace(/\./g, '');
}

function getPackageMetadataFromURL(url: Schemas.PackageURL, version: Schemas.PackageVersion): Schemas.PackageMetadata {
    let packageMetadata: Schemas.PackageMetadata = {
        Name: url.split('/')[url.split('/').length - 1],
        Version: version,
        ID: null,
    };

    packageMetadata.ID = packageMetadata.Name.toLowerCase() + '_' + remove_periods(packageMetadata.Version);

    return packageMetadata;
}

export async function APIHelpPackageContent(base64: Schemas.PackageContent, JsProgram: Schemas.PackageJSProgram): Promise<Schemas.Package> {
    const zipBuffer: Buffer = Buffer.from(base64, 'base64');
    const unzipDir = './src/cloned_repositories';

    if (!fs.existsSync(unzipDir)) {
        fs.mkdirSync(unzipDir);
    }
    let gitRemoteUrl: Schemas.PackageURL = '';

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
        if(!gitRemoteUrl) {
            throw new Server_Error(400, 5, 'POST "/package"', "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
        }
        if(!Evaluate.isPackageURL(gitRemoteUrl) || !Evaluate.isPackageJSProgram(JsProgram)) {
            throw new Server_Error(400, 6, 'POST "/package"', "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
        }

        return await APIHelpPackageURL(gitRemoteUrl, JsProgram, base64);
    } catch (error) {
        if(error instanceof Server_Error) {
            throw error;
        }
        logger.error(`unkown error: {${error}}`);
        throw new Server_Error(400, 7, 'POST "/package"', "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
    }
}

export async function APIHelpPackageURL(url: Schemas.PackageURL, JsProgram: Schemas.PackageJSProgram, content?: Schemas.PackageContent): Promise<Schemas.Package> {
    try {
        const result: Schemas.DataFetchedFromURL = await fetchDataAndCalculateScore(url, content);
        const newPackageRating = result.ratings;
        //Check to see if Scores Fulfill the threshold if not return a different return code
        // Believe they all have to be over 0.5
        content = result.content
        const keys: string[] = Object.keys(newPackageRating)
        for (const key of keys) {
            const value = newPackageRating[key as keyof Schemas.PackageRating];
            if (typeof value === 'number' && value < 0.5) {
                logger.info(`Package is not uploaded due to the disqualified rating. ${key} is ${value} for ${url}`)
                throw new Server_Error(424, 8, 'POST "/package"', "Package is not uploaded due to the disqualified rating.")
            }
        }

        // TODO logic for content to be updated
        let newPackageData: Schemas.PackageData= {
            Content: content,
            URL: result.url,
            JSProgram: JsProgram
        
        };
        // Prep the Package

        const newPackageMetadata: Schemas.PackageMetadata = getPackageMetadataFromURL(result.url, result.version);
        const newPackage: Schemas.Package = {
            metadata: newPackageMetadata,
            data: newPackageData,
        };

        // Store in database
        const db_response_package: number = await dbCommunicator.injestPackage(newPackage, result.reademe);
        if(db_response_package === -1) {
            throw new Server_Error(409, 9, 'POST "/package"', "Package already exists")
        } else if(db_response_package === 0) {
            throw new Server_Error(500, 10, 'POST "/package"', "Internal Server Error")
        }

        if(!newPackage.metadata.ID) { 
            throw new Server_Error(500, 11, 'POST "/package"', "Internal Server Error")
        }
        const db_response_ratings: boolean = await dbCommunicator.injestPackageRatings(newPackage.metadata.ID, newPackageRating);

        if(!db_response_ratings) {
            throw new Server_Error(500, 12, 'POST "/package"', "Internal Server Error")
        }
        logger.info(`Package uploaded successfully: Name{${newPackage.metadata.Name}} Version{${newPackage.metadata.Version}} ID{${newPackage.metadata.ID}}`);
        return newPackage;
    } catch (error) {
        // propogate error
        if(error instanceof Server_Error) {
            throw error;
        }
        throw new Server_Error(400, 13, 'POST "/package"', "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
    }
}

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
export async function queryForPackage(Input: Schemas.PackageQuery): Promise<Schemas.PackageMetadata[]> {
    // return all packages
    if(Input.Name==="*" && Input.Version==="*") { 
        let foundPackages: Schemas.PackageMetadata[] = [];
        const packageData = await dbCommunicator.getPackageMetadata(Input.Name, Input.Version);  
        foundPackages.push(...packageData);
        foundPackages = foundPackages.filter((item, index) => {
            return foundPackages.findIndex(obj => obj.Name === item.Name && obj.Version === item.Version) === index;
        });
        
        return foundPackages;
    }


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
            throw new Server_Error(400, 6, 'POST "/packages"', "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.")
        }
    });
    // "1.2.3", "1.2.3-2.1.0", "^1.2.3", "~1.2.0"
    // query DB for package based on name and each requested version
    let foundPackages: Schemas.PackageMetadata[] = [];
    for (const version of versions) {
        const packageData = await dbCommunicator.getPackageMetadata(Input.Name, version);  
        foundPackages.push(...packageData);
        if(foundPackages.length > 100) {
            throw new Server_Error(413, 7, 'POST "/packages"', "Too many packages returned");
        }
    }

    // make unique list
    foundPackages = foundPackages.filter((item, index) => {
        return foundPackages.findIndex(obj => obj.Name === item.Name && obj.Version === item.Version) === index;
    });
    
    return foundPackages;
}