import * as Schemas from '../src/schemas';
import Evaluate = Schemas.Evaluate;
import Actions = Schemas.Actions;
import { describe, test, expect, beforeAll } from '@jest/globals';
import exp from 'constants';

const badObjs: any[] = [1, 2, 3, '1', '2', '3', {Name:"name", garbage:"garbage"}, 'UPDATE2', 'DOWNLOAD3', 'RATE4'];

describe('ENUMS Evaluation', () => {
    test('isAction - True', () => {
        ["CREATE", "DOWNLOAD", "RATE", "UPDATE", Actions.CREATE, Actions.DOWNLOAD, Actions.RATE, Actions.UPDATE].forEach(action => {
            expect(Evaluate.isAction(action)).toBeTruthy();
        });
    });

    test('isAction - False', () => {
        ["", "create", "update", "download", "rate", 1, 2, 3, '1', '2', '3', 'CREATE1', 'UPDATE2', 'DOWNLOAD3', 'RATE4']
        .forEach(action => {
            expect(Evaluate.isAction(action)).toBeFalsy();
        });
    });
});

describe('TYPES Evaluation', () => {
    // isPackageName
    test('isPackageName - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(packageName => {
            expect(Evaluate.isPackageName(packageName)).toBeTruthy();
        });
    });
    test('isPackageName - False', () => {
        expect(Evaluate.isPackageName("")).toBeFalsy();
        expect(Evaluate.isPackageName("*")).toBeFalsy();
    });

    // isPackageID
    test('isPackageID - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(packageID => {
            expect(Evaluate.isPackageID(packageID)).toBeTruthy();
        });
    });
    test('isPackageID - False', () => {
        expect(Evaluate.isPackageID("")).toBeFalsy();
    });

    // isPackageVersion
    test('isPackageVersion - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(packageVersion => {
            expect(Evaluate.isPackageVersion(packageVersion)).toBeTruthy();
        });
    });
    test('isPackageVersion - False', () => {
        expect(Evaluate.isPackageVersion("")).toBeFalsy();
    });

    // isPackageContent 
    // TODO - may be changes if we check for binary differently
    test('isPackageContent - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(packageContent => {
            expect(Evaluate.isPackageContent(packageContent)).toBeTruthy();
        });
    });
    test('isPackageContent - False', () => {
        expect(Evaluate.isPackageContent("")).toBeFalsy();
    });

    // isPackageURL
    // TODO - may be changes if we check for url differently (very likley will)
    test('isPackageURL - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(packageURL => {
            expect(Evaluate.isPackageURL(packageURL)).toBeTruthy();
        });
    });
    test('isPackageURL - False', () => {
        expect(Evaluate.isPackageURL("")).toBeFalsy();
    });

    // isPackageJSProgram
    // TODO - may be changes if we check for JS program differently
    test('isPackageJSProgram - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(packageJSProgram => {
            expect(Evaluate.isPackageJSProgram(packageJSProgram)).toBeTruthy();
        });
    });
    test('isPackageJSProgram - False', () => {
        expect(Evaluate.isPackageJSProgram("")).toBeFalsy();
    });

    // isSemverRange
    // TODO - might change checking for this
    test('isSemverRange - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(semverRange => {
            expect(Evaluate.isSemverRange(semverRange)).toBeTruthy();
        });
    });
    test('isSemverRange - False', () => {
        expect(Evaluate.isSemverRange("")).toBeFalsy();
    });

    // isPackageRegEx
    // TODO - might change checking for this
    test('isPackageRegEx - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(packageRegEx => {
            expect(Evaluate.isPackageRegEx(packageRegEx)).toBeTruthy();
        });
    });
    test('isPackageRegEx - False', () => {
        expect(Evaluate.isPackageRegEx("")).toBeFalsy();
    });
});

describe('INTERFACES', () => {
    // isPackageMetadata
    test('isPackageMetadata - True', () => {
        expect(Evaluate.isPackageMetadata({
            Name: "test",
            ID: "test",
            Version: "test"
        })).toBeTruthy();
        expect(Evaluate.isPackageMetadata({
            Name: "test1",
            ID: null,
            Version: "test2"
        })).toBeTruthy();
    });
    test('isPackageMetadata - False', () => {
        expect(Evaluate.isPackageMetadata({
            Name: "",
            ID: "",
            Version: ""
        })).toBeFalsy();
        badObjs.forEach(obj => {
            expect(Evaluate.isPackageMetadata(obj)).toBeFalsy();
        });
    });

    // isPackageData (technically is a union type, not interface)
    test('isPackageData - True', () => {
        ["test", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"].forEach(data => {
            expect(Evaluate.isPackageData(data)).toBeTruthy();
        });
    });
    test('isPackageData - False', () => {
        expect(Evaluate.isPackageData("")).toBeFalsy();
    });

    // isPackage
    test('isPackage - True', () => {
        expect(Evaluate.isPackage({
            data: "test",
            metadata: {
                Name: "test",
                ID: "test",
                Version: "test"
            }
        })).toBeTruthy();
        expect(Evaluate.isPackage({
            data: "test",
            metadata: {
                Name: "test",
                ID: null,
                Version: "test"
            }
        })).toBeTruthy();
    });
    test('isPackage - False', () => {
        expect(Evaluate.isPackage({
            data: "",
            metadata: {
                Name: "",
                ID: "",
                Version: ""
            }
        })).toBeFalsy();
        badObjs.forEach(obj => {
            expect(Evaluate.isPackage(obj)).toBeFalsy();
        });
    });

    // isUser
    test('isUser - True', () => {
        expect(Evaluate.isUser({
            name: "test",
            isAdmin: true
        })).toBeTruthy();
        expect(Evaluate.isUser({
            name: "test",
            isAdmin: false
        })).toBeTruthy();
    });
    test('isUser - False', () => {
        expect(Evaluate.isUser({
            name: "",
            isAdmin: true
        })).toBeFalsy();
        expect(Evaluate.isUser({
            name: "",
            isAdmin: false
        })).toBeFalsy();
        badObjs.forEach(obj => {
            expect(Evaluate.isUser(obj)).toBeFalsy();
        });
    });

    // isUserAuthetificationInfo
    test('isUserAuthetificationInfo - True', () => {
        expect(Evaluate.isUserAuthetificationInfo({
            password: "test"
        })).toBeTruthy();
    });
    test('isUserAuthetificationInfo - False', () => {
        expect(Evaluate.isUserAuthetificationInfo({
            password: ""
        })).toBeFalsy();
        badObjs.forEach(obj => {
            expect(Evaluate.isUserAuthetificationInfo(obj)).toBeFalsy();
        });
    });

    // isPackageRating
    test('isPackageRating - True', () => {
        const truethyRatings: Schemas.PackageRating[] = [{
            BusFactor: 1,
            Correctness: 1,
            RampUp: 1,
            ResponsiveMaintainer: 1,
            LicenseScore: 1,
            GoodPinningPractice: 1,
            PullRequest: 1,
            NetScore: 1,
        }, 
        {
            BusFactor: 0,
            Correctness: 0,
            RampUp: 0,
            ResponsiveMaintainer: 0,
            LicenseScore: 0,
            GoodPinningPractice: 0,
            PullRequest: 0,
            NetScore: 0,
        },
        {
            BusFactor: 0.5,
            Correctness: 0.5,
            RampUp: 0.5,
            ResponsiveMaintainer: 0.5,
            LicenseScore: 0.5,
            GoodPinningPractice: 0.5,
            PullRequest: 0.5,
            NetScore: 0.5,
        }];
        truethyRatings.forEach(rating => {
            expect(Evaluate.isPackageRating(rating)).toBeTruthy();
        });
    });
    test('isPackageRating - False', () => {
        const falsyRatings: any[] = [{
            BusFactor: -1,
            Correctness: 1,
            RampUp: 1,
            ResponsiveMaintainer: 1,
            LicenseScore: 1,
            GoodPinningPractice: 1,
            PullRequest: 1,
            NetScore: 1,
        }, 
        {
            BusFactor: 2,
            Correctness: 0,
            RampUp: 0,
            ResponsiveMaintainer: 0,
            LicenseScore: 0,
            GoodPinningPractice: 0,
            PullRequest: 0,
            NetScore: 0,
        },
        {
            BusFactor: 0.5,
            Correctness: 0.5,
            RampUp: 0.5,
            ResponsiveMaintainer: 0.5,
            LicenseScore: 0.5,
            GoodPinningPractice: 0.5,
            PullRequest: 0.5,
            NetScore: 1.5,
        }];
        falsyRatings.forEach(rating => {
            expect(Evaluate.isPackageRating(rating)).toBeFalsy();
        });
        badObjs.forEach(obj => {
            expect(Evaluate.isPackageRating(obj)).toBeFalsy();
        });
    });

    // isPackageHistoryEntry
    // TODO - may change date checking
    test('isPackageHistoryEntry - True', () => {
        expect(Evaluate.isPackageHistoryEntry({
            Date: "test",
            Action: Actions.CREATE,
            User: {
                name: "test",
                isAdmin: true
            },
            PackageMetadata: {
                Name: "test",
                ID: "test",
                Version: "test"
            }
        })).toBeTruthy();
        expect(Evaluate.isPackageHistoryEntry({
            Date: "test",
            Action: Actions.UPDATE,
            User: {
                name: "test",
                isAdmin: false
            },
            PackageMetadata: {
                Name: "test",
                ID: null,
                Version: "test"
            }
        })).toBeTruthy();
    });
    test('isPackageHistoryEntry - False', () => {
        expect(Evaluate.isPackageHistoryEntry({
            Date: "",
            Action: Actions.CREATE,
            User: {
                name: "",
                isAdmin: true
            },
            PackageMetadata: {
                Name: "",
                ID: "",
                Version: ""
            }
        })).toBeFalsy();
        badObjs.forEach(obj => {
            expect(Evaluate.isPackageHistoryEntry(obj)).toBeFalsy();
        });
    });

    // isPackageQuery
    // TODO - may change version checking
    test('isPackageQuery - True', () => {
        expect(Evaluate.isPackageQuery({
            Version: "test",
            Name: "test"
        })).toBeTruthy();
    });
    test('isPackageQuery - False', () => {
        expect(Evaluate.isPackageQuery({
            Version: "",
            Name: ""
        })).toBeFalsy();
        badObjs.forEach(obj => {
            expect(Evaluate.isPackageQuery(obj)).toBeFalsy();
        });
    });
});