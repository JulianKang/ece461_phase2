"use strict";
// for consistency: 
// import * as Schemas from '../src/schemas';
// import Evaluate = Schemas.Evaluate; // if you need to use the type guards
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluate = exports.Actions = void 0;
// used in package history, currently out of scope
var Actions;
(function (Actions) {
    Actions["CREATE"] = "CREATE";
    Actions["UPDATE"] = "UPDATE";
    Actions["DOWNLOAD"] = "DOWNLOAD";
    Actions["RATE"] = "RATE";
})(Actions || (exports.Actions = Actions = {}));
// Evaluation of the various schemas
// Type Guards
var Evaluate;
(function (Evaluate) {
    // ENUMS
    function isAction(obj) {
        return obj && typeof obj === 'string' &&
            (obj === Actions.CREATE ||
                obj === Actions.UPDATE ||
                obj === Actions.DOWNLOAD ||
                obj === Actions.RATE);
    }
    Evaluate.isAction = isAction;
    // TYPES
    function isPackageName(obj) {
        return obj && typeof obj === 'string' && obj !== '*';
    }
    Evaluate.isPackageName = isPackageName;
    function isPackageID(obj) {
        return obj && typeof obj === 'string';
    }
    Evaluate.isPackageID = isPackageID;
    function isPackageVersion(obj) {
        return obj && typeof obj === 'string';
    }
    Evaluate.isPackageVersion = isPackageVersion;
    // TODO - how to check if binary zip?
    function isPackageContent(obj) {
        return obj && typeof obj === 'string';
    }
    Evaluate.isPackageContent = isPackageContent;
    // TODO - what urls are valid?
    function isPackageURL(obj) {
        return obj && typeof obj === 'string';
    }
    Evaluate.isPackageURL = isPackageURL;
    // TODO - how to check if JS program?
    function isPackageJSProgram(obj) {
        return obj && typeof obj === 'string';
    }
    Evaluate.isPackageJSProgram = isPackageJSProgram;
    function isSemverRange(obj) {
        return obj && typeof obj === 'string';
    }
    Evaluate.isSemverRange = isSemverRange;
    function isPackageRegEx(obj) {
        return obj && typeof obj === 'string';
    }
    Evaluate.isPackageRegEx = isPackageRegEx;
    // INTERFACES
    function isPackageMetadata(obj) {
        return obj && isPackageName(obj.Name) && (isPackageID(obj.ID) || obj.ID === null) && isPackageVersion(obj.Version);
    }
    Evaluate.isPackageMetadata = isPackageMetadata;
    function isPackageData(obj) {
        return obj && (isPackageContent(obj) || isPackageURL(obj) || isPackageJSProgram(obj));
    }
    Evaluate.isPackageData = isPackageData;
    function isPackage(obj) {
        return obj && isPackageData(obj.data) && isPackageMetadata(obj.metadata);
    }
    Evaluate.isPackage = isPackage;
    function isUser(obj) {
        return obj && obj.name && typeof obj.name === 'string' && typeof obj.isAdmin === 'boolean';
    }
    Evaluate.isUser = isUser;
    function isUserAuthetificationInfo(obj) {
        return obj && obj.password && typeof obj.password === 'string';
    }
    Evaluate.isUserAuthetificationInfo = isUserAuthetificationInfo;
    function isPackageRating(obj) {
        return (obj &&
            typeof obj.BusFactor === 'number' && obj.BusFactor >= 0 && obj.BusFactor <= 1 &&
            typeof obj.Correctness === 'number' && obj.Correctness >= 0 && obj.Correctness <= 1 &&
            typeof obj.RampUp === 'number' && obj.RampUp >= 0 && obj.RampUp <= 1 &&
            typeof obj.ResponsiveMaintainer === 'number' && obj.ResponsiveMaintainer >= 0 && obj.ResponsiveMaintainer <= 1 &&
            typeof obj.LicenseScore === 'number' && obj.LicenseScore >= 0 && obj.LicenseScore <= 1 &&
            typeof obj.GoodPinningPractice === 'number' && obj.GoodPinningPractice >= 0 && obj.GoodPinningPractice <= 1 &&
            typeof obj.PullRequest === 'number' && obj.PullRequest >= 0 && obj.PullRequest <= 1 &&
            typeof obj.NetScore === 'number' && obj.NetScore >= 0 && obj.NetScore <= 1);
    }
    Evaluate.isPackageRating = isPackageRating;
    function isPackageHistoryEntry(obj) {
        return (obj &&
            typeof obj.Date === 'string' &&
            isAction(obj.Action) &&
            isUser(obj.User) &&
            isPackageMetadata(obj.PackageMetadata));
    }
    Evaluate.isPackageHistoryEntry = isPackageHistoryEntry;
    function isPackageQuery(obj) {
        return obj && isSemverRange(obj.Version) && isPackageName(obj.Name);
    }
    Evaluate.isPackageQuery = isPackageQuery;
})(Evaluate || (exports.Evaluate = Evaluate = {}));
