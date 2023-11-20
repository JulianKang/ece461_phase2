// for consistency: 
// import * as Schemas from './schemas';


// from inherited code
export interface CLIOutput {
    'BUS_FACTOR_SCORE': number;
    'CORRECTNESS_SCORE': number;
    'RAMP_UP_SCORE': number;
    'RESPONSIVE_MAINTAINER_SCORE': number;
    'LICENSE_SCORE': number;
    'URL': string;
    'NET_SCORE': number;
    [key: string]: number | string;
}


////////////////////////////////////
//////////ENDPOINT SCHEMAS//////////
////////////////////////////////////
// Name of a package.
//     Names should only use typical "keyboard" characters.
//     The name "*" is reserved. See the /packages API for its meaning.
export type PackageName = string;

// Unique identifier for a package.
export type PackageID = string;

// Package content as a binary zip
export type PackageContent = string;

// URL to a package.
export type PackageURL = string;

// Package content as a JS program
export type PackageJSProgram = string;

// Offset in pagination.
export type EnumerateOffset = string;

// A regular expression over package names and READMEs that is used for searching for a package
export type PackageRegEx = string;

// example: Exact (1.2.3) Bounded range (1.2.3-2.1.0) Carat (^1.2.3) Tilde (~1.2.0)
export type SemverRange = string;

// This is a "union" type.
//     On package upload, either Content or URL should be set (should this be handled on frontend? --nate). If both are set, returns 400.
//     On package update, exactly one field should be set.
//     On download, the Content field should be set.
export type PackageData = PackageContent | PackageURL | PackageJSProgram;

// The "Name" and "Version" are used as a unique identifier pair when uploading a package.
// The "ID" is used as an internal identifier for interacting with existing packages.
export interface PackageMetadata {
    Name: PackageName;
    Version: string;
    ID: PackageID | null; // null opt since endpoint /package/byRegEx does not return id, allowing reuse of this interface
}

// Format of Packages
export interface Package {
    metadata: PackageMetadata;
    data: PackageData;
}

// format for a user
export interface User {
    name: string;
    isAdmin: boolean;
}

// inteface to allow for expansion of user authentication info
export interface UserAuthenticationInfo {
    password: string;
}

// necessary ratings schema
export interface PackageRating {
    BusFactor: number;
    Correctness: number;
    RampUp: number;
    ResponsiveMaintainer: number;
    LicenseScore: number;
    GoodPinningPractice: number;
    PullRequest: number;
    NetScore: number;
}


// used in package history, currently out of scope
export enum Actions {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DOWNLOAD = "DOWNLOAD",
    RATE = "RATE"
}

// currently out of scope, but would be used for package history additional requirement
// if we have time to implement this it is here
export interface PackageHistoryEntry {
    User: User;
    Date: string; // Date-time - Date of activity using ISO-8601 Datetime standard in UTC format.
    PackageMetadata: PackageMetadata;
    Action: Actions;
}

// TODO - export type AuthentificationToken = {jsonwebtoken type};
// npm install --save @types/jsonwebtoken
// if we find we have time to implement this, currently out of scope

// Query for a package by name and version.
export interface PackageQuery {
    Version: SemverRange;
    Name: PackageName;
}