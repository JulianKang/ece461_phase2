import * as Schemas from "../../src/schemas";

// the goal of this file is not to give comprehensive tests of the whole system, 
// but to give a starting point for testing the server isolated with some
// simple mocked data and functions from the dbCommunicator

// NOT COMPREHENSIVE LIST, JUST WHAT WE ARE TESTING
export namespace ValidConstants {
    export const Update: {id: Schemas.PackageID, data: Schemas.PackageData}[] = [
        {
            id: "p1-100",
            data: {
                Content: 'package1_ZIP1',
                JSProgram: 'jsp1100'
            }
        },
        {
            id: "p1-110",
            data: {
                Content: 'package1_ZIP2',
                JSProgram: 'jsp1110'
            }
        },
        {
            id: "p2-100",
            data: {
                Content: 'package2_ZIP1',
                JSProgram: 'jsp2100'
            }
        },
        {
            id: "p3-200",
            data: {
                Content: 'package3_ZIP1',
                JSProgram: 'jsp3200'
            }
        }
    ];
    export const RegEx: Schemas.PackageRegEx[] = ["regex1", "regex2", "regex3"];
    export const Create: Schemas.PackageData[] = [
        {
            Content: 'package1_ZIP1',
            JSProgram: 'jsp1100'
        },
        {
            Content: 'package1_ZIP2',
            JSProgram: 'jsp1110'
        },
        {
            URL: 'package2_URL1',
            JSProgram: 'jsp2100'
        },
        {
            URL: 'package3_URL1',
            JSProgram: 'jsp3200'
        }
    ];
    export const Packages: Schemas.Package[] = [
        {
            metadata: {
                Name: "package1",
                Version: "1.0.0",
                ID: 'p1-100'
            },
            data: {
                Content: 'package1_ZIP1',
                URL: 'package1_URL1',
                JSProgram: 'jsp1100'
            }
        },
        {
            metadata: {
                Name: "package1",
                Version: "1.1.0",
                ID: 'p1-110'
            },
            data: {
                Content: 'package1_ZIP2',
                URL: 'package1_URL2',
                JSProgram: 'jsp1110'
            }
        },
        {
            metadata: {
                Name: "package2",
                Version: "1.0.0",
                ID: 'p2-100'
            },
            data: {
                Content: 'package2_ZIP1',
                URL: 'package2_URL1',
                JSProgram: 'jsp2100'
            }
        },
        {
            metadata: {
                Name: "package3",
                Version: "2.0.0",
                ID: 'p3-200'
            },
            data: {
                Content: 'package3_ZIP1',
                URL: 'package3_URL1',
                JSProgram: 'jsp3200'
            }
        },
    ]
    export const PackageNames: Schemas.PackageName[] = ["package1", "package2", "package3"];
    export const PackageIDs: Schemas.PackageID[] = ["p1-100", "p1-110", "p2-100", "p3-200"];
    export const PackageQuerys: Schemas.PackageQuery[] = [
        { Name: "package1", Version: "(1.0.0)\n(1.1.0)\n(~1.0)\n(^1.0.0)\n(1.0.0-1.2.0)" },
        { Name: "package2", Version: "junk(1.0.0)" },
        { Name: "package3", Version: "text(2.0.0)" },
    ];
}
    
// NOT COMPREHENSIVE LIST, JUST WHAT WE ARE TESTING
export namespace InvalidConstants {
    export const NonPackageIDs: Schemas.PackageID[] = ["-1", "p1-101", "p1-111", "p2-101", "p3-201"];
    export const UnsuccessfulRegEx: Schemas.PackageRegEx[] = ["regex4", "regex5", "regex6"];
    export const anyList: any[] = [1, 2, {}, {Name: "name", Garbage: "garbage"}, {Name: "name", Version: "1.0.0)\n"}, [], null, undefined, true, false, "string", "package11", "package12", "package13", "package4"];
    export const UnsuccessfulPackageQuerys: Schemas.PackageQuery[] = [
        { Name: "package1", Version: "(1.0.1)\n(1.5.0)\n(~4.0)\n(^3.0.0)\n(1.3.0-1.4.4)" },
        { Name: "package2", Version: "junk(1.0.2)" },
        { Name: "package3", Version: "text(2.0.1)" },
        { Name: "package4", Version: "text(1.0.0)" },
    ];
}

export namespace MockedDBCommunicator {
    const validVersionQueries: { [key: string]: string[] } = {
        "package1": ["1.0.0", "1.1.0", "^1.0.0", "~1.0", "1.0.0-1.2.0"],
        "package2": ["1.0.0"],
        "package3": ["2.0.0"],
    }
    export async function getPackageMetadata(name: Schemas.PackageName, version: Schemas.PackageVersion): Promise<Schemas.PackageMetadata[]> {
        if(!(ValidConstants.PackageNames.some(x => x===name))) {
            return [];
        }
        
        if(!(validVersionQueries[name].some(x => x===version))) {
            return [];
        }

        if(name === "package2") {
            return [ValidConstants.Packages[2].metadata];
        } else if(name === "package3") {
            return [ValidConstants.Packages[3].metadata];
        }

        if(version === "1.0.0") {
            return [ValidConstants.Packages[0].metadata];
        } else if(version === "1.1.0") {
            return [ValidConstants.Packages[1].metadata];
        }

        return [ValidConstants.Packages[0].metadata, ValidConstants.Packages[1].metadata];
    }

    export async function resetRegistry(): Promise<boolean> {
        return true;
    }

    export async function getPackageById(id: Schemas.PackageID): Promise<Schemas.Package | null> {
        if(!(ValidConstants.PackageIDs.some(x => x===id))) {
            return null;
        }

        if(id === ValidConstants.PackageIDs[0]) {
            return ValidConstants.Packages[0];
        } else if(id === ValidConstants.PackageIDs[1]) {
            return ValidConstants.Packages[1];
        } else if(id === ValidConstants.PackageIDs[2]) {
            return ValidConstants.Packages[2];
        } else if(id === ValidConstants.PackageIDs[3]) {
            return ValidConstants.Packages[3];
        }
        
        return null;
    }

    export async function updatePackageById(updatedPackage: Schemas.Package): Promise<boolean> {
        if(!(ValidConstants.PackageIDs.some(x => x===updatedPackage.metadata.ID))) {
            return false;
        }

        return true;
    }

    export async function deletePackageById(id: Schemas.PackageID): Promise<boolean> {
        return false;
    }

    export async function getPackageRatings(id: Schemas.PackageID): Promise<Schemas.PackageRating | null> {
        if(!(ValidConstants.PackageIDs.some(x => x===id))) {
            return null;
        }

        return {
            BusFactor: 0.5,
            Correctness: 0.5,
            RampUp: 0.5,
            ResponsiveMaintainer: 0.5,
            LicenseScore: 0.5,
            GoodPinningPractice: 0.5,
            PullRequest: 0.5,
            NetScore: 0.5,            
        }
    }

    export async function deletePackageByName(name: Schemas.PackageName): Promise<boolean> {
        return false;
    }

    export async function searchPackagesByRegex(regex: Schemas.PackageRegEx): Promise<Schemas.PackageMetadata[]> {
        if(!(ValidConstants.RegEx.some(x => x===regex))) {
            return [];
        }
        return ValidConstants.Packages.map((x) => x.metadata);
    }
}
