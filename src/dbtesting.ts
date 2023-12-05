import dbCommunicator from '../src/dbCommunicator';
import * as Schemas from '../src/schemas';

async function main() {
    await new Promise(f => setTimeout(f, 2000));
    let newPackage: Schemas.Package = {
        metadata: {
            Name: "test",
            ID: "test1.0.0",
            Version: "1.0.0"
        },
        data: {
            Content: "test.zip",
            URL: "test.com",
            JSProgram: "test.js"
        }
    }
    let data0 = await dbCommunicator.injestPackage(newPackage, "testing this package");
    console.log(data0);
    let ratings: Schemas.PackageRating = {
        BusFactor: .6,
        RampUp: .3,
        Correctness: .9,
        ResponsiveMaintainer: .7,
        LicenseScore: .5,
        GoodPinningPractice: .2,
        PullRequest: .1,
        NetScore: .4
    }
    let data5 = await dbCommunicator.injestPackageRatings("test1.0.0", ratings);
    console.log(data5);
    let data = await dbCommunicator.getPackageMetadata("test", "1.0.0");
    console.log("getPackageMetadata: " + JSON.stringify(data));
    data = await dbCommunicator.getPackageMetadata("*", "1.0.0");
    console.log("getPackageMetadata: " + JSON.stringify(data));
    data = await dbCommunicator.searchPackagesByRegex(".*?this.*");
    console.log("searchPackagesByRegex: " + JSON.stringify(data));
    let data1 = await dbCommunicator.getPackageById("test1.0.0");
    console.log(data1);
    let data2 = await dbCommunicator.getPackageRatings("test1.0.0");
    console.log(data2);
    newPackage = {
        metadata: {
            Name: "test",
            ID: "test1.0.0",
            Version: "1.0.0"
        },
        data: {
            URL: "https://www.google.com"
        }
    }
    let data3 = await dbCommunicator.updatePackageById(newPackage);
    console.log(data3);
    data1 = await dbCommunicator.getPackageById("test1.0.0");
    console.log(data1);
    newPackage = {
        metadata: {
            Name: "test",
            ID: "test1.0.0sa",
            Version: "1.0.0"
        },
        data: {
            Content: "newContent.zip"
        }
    }
    data3 = await dbCommunicator.updatePackageById(newPackage);
    console.log(data3);
    data1 = await dbCommunicator.getPackageById("test1.0.0");
    console.log(data1);
    data3 = await dbCommunicator.deletePackageById("test1.0.3");
    console.log(data3);
    newPackage = {
        metadata: {
            Name: "test",
            ID: "test1.0.3",
            Version: "1.0.3"
        },
        data: {
            Content: "newContent.zip",
            URL: "tester.com",
            JSProgram: "test.js"
        }
    }
    let data4 = await dbCommunicator.injestPackage(newPackage, "TESTER");
    console.log(data4);
    ratings = {
        BusFactor: .6,
        RampUp: .3,
        Correctness: .9,
        ResponsiveMaintainer: .7,
        LicenseScore: .5,
        GoodPinningPractice: .2,
        PullRequest: .1,
        NetScore: .4
    }
    data3 = await dbCommunicator.injestPackageRatings("test1.0.3", ratings);
    console.log(data3);
    data3 = await dbCommunicator.deletePackageByName("test1");
    console.log(data3);
    data3 = await dbCommunicator.resetRegistry();
    console.log(data3);
}

main();
