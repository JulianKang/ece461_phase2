const { Buffer } = require('buffer');
const AdmZip = require('adm-zip');
import * as fs from 'fs';
import { error } from 'console';
import { fetchDataAndCalculateScore } from '../adjusted_main'
import { Server_Error } from './server_errors'
import * as Schemas from '../schemas';
import dbCommunicator from '../dbCommunicator';
import logger from '../logger';

export function APIHelpPackageContent(base64: Schemas.PackageContent, JsProgram: Schemas.PackageJSProgram): Schemas.Package {
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

        // TODO
        return {
            metadata: {
                Name: "Underscore",
                Version: "1.0.0",
                ID: "underscore"
            },
            data: "Base64 of zipfile"
        }

        // return gitRemoteUrl
    } catch (error) {
        logger.error(`${error}`)
        
        // TODO
        return {
            metadata: {
                Name: "Underscore",
                Version: "1.0.0",
                ID: "underscore"
            },
            data: "Base64 of zipfile"
        }
        // return gitRemoteUrl
    }
}

export async function APIHelpPackageURL(url: Schemas.PackageURL, JsProgram: Schemas.PackageJSProgram): Promise<Schemas.Package> {
    try {
        const result: Schemas.CLIOutput = await fetchDataAndCalculateScore(url);
        //Check to see if Scores Fulfill the threshold if not return a different return code
        // Believe they all have to be over 0.5
        const keys: string[] = Object.keys(result)
        for (const key of keys) {
            const value = result[key as keyof Schemas.CLIOutput];
            if (typeof value === 'number' && value < 0) {
                //logger.info(value)
                throw new Server_Error(424, "Package is not uploaded due to the disqualified rating.")
            }
        }

        const package_exists = false//DataBase.ScanForPacakge(url)
        if (package_exists) {
            throw new Server_Error(409, "Package already exists")
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
    
    // query DB for package based on name and each requested version
    let foundPackages: Schemas.PackageMetadata[] = [];
    for (const version of versions) {
        const packageData = await dbCommunicator.getPackageMetadata(Input.Name, version);  
        foundPackages.push(...packageData);
    }

    // make unique list
    foundPackages = foundPackages.filter((item, index) => {
        return foundPackages.findIndex(obj => obj.Name === item.Name && obj.Version === item.Version) === index;
    });
    
    return foundPackages;
}