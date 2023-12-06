"use strict";
/*
This file is part of ECE461Project.

ECE461Projectis free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

ECE461Project is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see https://www.gnu.org/licenses/.
*/
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitHubPackageVersion = exports.calculateCodeReviewFraction = exports.calculatePinnedDependencies = exports.calculateCorrectnessScore = exports.licenseCheck = exports.RampUp = exports.responsiveMaintainer = exports.netScore = exports.calculateBusFactor = void 0;
var simple_git_1 = __importDefault(require("simple-git"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var axios_1 = __importDefault(require("axios"));
var logger_1 = __importDefault(require("./logger"));
var logLevel = parseInt(process.env.LOG_LEVEL);
//Bus Factor = Total Code Contributions by Top Contributors / Total Code Contributions
function calculateBusFactor(repositoryUrl, localDirectory, topContributorsCount) {
    if (topContributorsCount === void 0) { topContributorsCount = 3; }
    return __awaiter(this, void 0, void 0, function () {
        var git, httpsRepositoryUrl, log, commitCounts, _i, _a, commit, author, sortedContributors, totalTopContributions, i, totalContributions, busFactor, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    git = (0, simple_git_1.default)({ baseDir: localDirectory });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    httpsRepositoryUrl = convertToHttpsUrl(repositoryUrl);
                    return [4 /*yield*/, git.clone(httpsRepositoryUrl, localDirectory)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, git.log()];
                case 3:
                    log = _b.sent();
                    commitCounts = new Map();
                    // Iterate through the commit log and count contributions
                    for (_i = 0, _a = log.all; _i < _a.length; _i++) {
                        commit = _a[_i];
                        author = commit.author_name;
                        // If the author is already in the map, increment their commit count
                        if (commitCounts.has(author)) {
                            commitCounts.set(author, commitCounts.get(author) + 1);
                        }
                        else {
                            // Otherwise, initialize their commit count to 1
                            commitCounts.set(author, 1);
                        }
                    }
                    sortedContributors = Array.from(commitCounts.entries()).sort(function (a, b) { return b[1] - a[1]; });
                    totalTopContributions = 0;
                    for (i = 0; i < topContributorsCount && i < sortedContributors.length; i++) {
                        totalTopContributions += sortedContributors[i][1];
                    }
                    totalContributions = log.total;
                    busFactor = totalTopContributions / totalContributions;
                    return [2 /*return*/, { busFactor: busFactor, url: httpsRepositoryUrl }];
                case 4:
                    error_1 = _b.sent();
                    logger_1.default.error("Error: ".concat(error_1));
                    throw error_1; // Re-throw the error if needed
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.calculateBusFactor = calculateBusFactor;
function netScore(ls, bf, rm, cs, ru, df, pf) {
    return (ls * .1 + +bf * 0.2 + rm * 0.2 + cs * 0.1 + ru * 0.2 + 0.1 * df + 0.1 * pf); // Adjust the weights as needed
}
exports.netScore = netScore;
function responsiveMaintainer(date) {
    // Calculate the number of days since the last publish
    var currentDate = new Date();
    var lastPublishDate = new Date(date);
    var daysSinceLastPublish = Math.floor((currentDate.getTime() - lastPublishDate.getTime()) / (1000 * 60 * 60 * 24));
    var resp = 1 - (daysSinceLastPublish / 365);
    if (resp > 0) {
        return resp;
    }
    return 0;
}
exports.responsiveMaintainer = responsiveMaintainer;
function queryGithubapi(queryendpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var axiosInstance, response, count, retries, _loop_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    axiosInstance = axios_1.default.create({
                        baseURL: 'https://api.github.com/',
                        headers: {
                            Authorization: "Bearer ".concat(process.env.GITHUB_TOKEN),
                            Accept: 'application/json',
                            'X-GitHub-Api-Version': '2022-11-28', // Add the version header here
                        },
                    });
                    response = void 0;
                    count = 10;
                    retries = 0;
                    _loop_1 = function () {
                        var maxRetryDelay, retryDelay_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, axiosInstance.get(queryendpoint)];
                                case 1:
                                    response = _b.sent();
                                    if (!(response.status === 202)) return [3 /*break*/, 3];
                                    // If the response is 202, it means the request is still processing.
                                    // Wait for a while before retrying, and decrement the count.
                                    count--;
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                case 2:
                                    _b.sent(); // Adjust the polling interval as needed.
                                    return [3 /*break*/, 5];
                                case 3:
                                    if (!(response.status === 403)) return [3 /*break*/, 5];
                                    // Implement exponential backoff for 403 responses.
                                    if (!retries) {
                                        logger_1.default.error("Rate limit exceeded. Applying exponential backoff.");
                                    }
                                    retries++;
                                    maxRetryDelay = 60000;
                                    retryDelay_1 = Math.min(Math.pow(2, retries) * 1000, maxRetryDelay);
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelay_1); })];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1: return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if ((response.status === 202 && count > 0) || response.status === 403) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, response];
                case 5:
                    error_2 = _a.sent();
                    logger_1.default.error("".concat(error_2));
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function RampUp(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var thresholdRampUp, queryendpoint, response, contributors, firstCommitWeeks, sortedWeeks, differences, i, diff, averageSeconds, averageWeeks, rampUp, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thresholdRampUp = 8;
                    queryendpoint = "repos/".concat(owner, "/").concat(repo, "/stats/contributors");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryGithubapi(queryendpoint)];
                case 2:
                    response = _a.sent();
                    if (!response || !Array.isArray(response.data)) {
                        logger_1.default.error("GitHub API failed to return Ramp Up (contributor) information for repository: ".concat(owner, "/").concat(repo));
                        return [2 /*return*/, 0];
                    }
                    contributors = response.data;
                    firstCommitWeeks = contributors.map(function (contributor) {
                        for (var _i = 0, _a = contributor.weeks; _i < _a.length; _i++) {
                            var week = _a[_i];
                            if (week.c > 0) {
                                return week.w;
                            }
                        }
                        return 0;
                    }).filter(Boolean);
                    if (firstCommitWeeks.length === 0) {
                        return [2 /*return*/, 0];
                    }
                    sortedWeeks = firstCommitWeeks.slice().sort(function (a, b) { return a - b; });
                    differences = [];
                    for (i = 1; i < sortedWeeks.length; i++) {
                        diff = sortedWeeks[i] - sortedWeeks[i - 1];
                        differences.push(diff);
                    }
                    averageSeconds = differences.reduce(function (acc, diff) { return acc + diff; }, 0) / differences.length;
                    averageWeeks = averageSeconds / 60 / 60 / 24 / 7;
                    rampUp = averageWeeks ? Math.min(1, thresholdRampUp / averageWeeks) : 0;
                    return [2 /*return*/, parseFloat(rampUp.toFixed(5))];
                case 3:
                    error_3 = _a.sent();
                    logger_1.default.error("Error fetching contributor information from GitHub API: ".concat(error_3.message));
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.RampUp = RampUp;
// checking if there is an upstream license compatible with LGPL-2.1
function licenseCheck(text) {
    // Use regex to parse the project readme and check for the required license
    var hashLicense;
    var compatibleLicenseRegex = [/MIT/, /LGPL 2\.1/, /2-Clause BSD/, /Curl/, /ISC/, /MPL 2\.0/, /NTP/, /UPL 2\.0/, /WTFPL/, /X11/, /zlib/];
    compatibleLicenseRegex.forEach(function (RegEx) {
        hashLicense = RegEx.test(text);
        if (hashLicense && !(/zlib-acknowledgement/.test(text))) { // zlib-acknowledgement is an exception to the zlib license compatibility
            return 1;
        }
    });
    var incompatibleLicenseRegex = [/AGPL/, /4-Clause BSD/, /CDDL/, /EPL/, /EUPL/, /GPL/, /IJG/, /MPL/, /Ms-RL/, /OSL/, /RPL/, /XFree86/, /zlib/];
    incompatibleLicenseRegex.forEach(function (RegEx) {
        hashLicense = RegEx.test(text);
        if (hashLicense) {
            return 0;
        }
    });
    return 0.5; // TODO, since we don't know the license, likely should be return 0, returning 0.5 for now though for testing
}
exports.licenseCheck = licenseCheck;
function calculateCorrectnessScore(issues) {
    // Implement your logic to calculate the "correctness" score based on issues
    // For example, you can count open bugs and calculate a score
    var openBugs = issues.filter(function (issue) { return issue.isBug && issue.status === 'open'; }).length;
    var totalBugs = issues.filter(function (issue) { return issue.isBug; }).length;
    // Calculate the correctness score as the ratio of open bugs to total bugs
    if (totalBugs === 0) {
        return 1; // If there are no bugs, consider it perfect
    }
    return 1 - openBugs / totalBugs;
}
exports.calculateCorrectnessScore = calculateCorrectnessScore;
function convertToHttpsUrl(repositoryUrl) {
    // Check if the repository URL starts with 'git@github.com:'
    if (repositoryUrl.startsWith('git@github.com')) {
        // Extract the owner and repo from the SSH URL
        var parts = repositoryUrl.split(':');
        var ownerAndRepo = parts[1].replace('.git', '');
        // Construct the HTTPS URL
        //logger.info('boom')
        return "https://github.com/".concat(ownerAndRepo);
    }
    else if (repositoryUrl.includes('git@github.com')) {
        // Extract the owner and repo from the SSH URL
        var parts = repositoryUrl.split('git@github.com');
        var ownerAndRepo = parts[1]; //.replace('.git', '');
        // Construct the HTTPS URL
        //logger.info('boom')
        return "https://github.com".concat(ownerAndRepo);
    }
    // If it's not an SSH URL, return the original URL
    return repositoryUrl;
}
function getRepoDependencies() {
    return __awaiter(this, void 0, void 0, function () {
        var packageJsonPath, packageJson, dependencies;
        return __generator(this, function (_a) {
            packageJsonPath = path.join(__dirname, 'cloned_repositories/package.json');
            try {
                packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                dependencies = Object.entries(packageJson.dependencies || {}).map(function (_a) {
                    var dependency = _a[0], version = _a[1];
                    return "".concat(dependency, "@").concat(version);
                });
                return [2 /*return*/, dependencies];
            }
            catch (error) {
                logger_1.default.error("Error reading package.json: ".concat(error.message));
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
function calculatePinnedDependencies() {
    return __awaiter(this, void 0, void 0, function () {
        var dependencies, pinnedDependencies, fraction, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getRepoDependencies()];
                case 1:
                    dependencies = _a.sent();
                    if (dependencies.length === 0) {
                        return [2 /*return*/, 1.0]; // If there are no dependencies, return 1.0
                    }
                    pinnedDependencies = dependencies.filter(function (dep) {
                        var version = dep.split('@')[1];
                        //logger.info(version)
                        //logger.info(version.match(/(\d+)\.(\d+)/))
                        return version && version.match(/(\d+)\.(\d+)/) !== null; // Check if the version follows the major.minor format
                    });
                    fraction = pinnedDependencies.length / dependencies.length;
                    return [2 /*return*/, fraction];
                case 2:
                    error_4 = _a.sent();
                    logger_1.default.error("".concat(error_4));
                    return [2 /*return*/, 1]; // You may want to handle errors more appropriately based on your use case
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.calculatePinnedDependencies = calculatePinnedDependencies;
/*export async function calculateCodeReviewFraction(localDirectory: string): Promise<number> {
  try {
    logger.info(localDirectory);
    const git: SimpleGit = simpleGit({ baseDir: localDirectory });

    // Get the number of merged pull requests
    const mergedPullRequestsResponse: string = await git.raw(['log', '--merges', '--grep=^Merge pull request']);
    const mergedPullRequests = mergedPullRequestsResponse.split('commit ').filter(commit => commit.trim() !== '').length;

    // Get the total number of commits
    const allCommitsResponse: string = await git.raw(['rev-list', '--all', '--count']);
    const totalCommits = parseInt(allCommitsResponse, 10);

    if (totalCommits === 0) {
      // Handle the case where there are no commits
      return 0;
    }

    // Calculate the code review fraction
    logger.info(mergedPullRequests)
    logger.info(totalCommits)
    const codeReviewFraction = mergedPullRequests / totalCommits;

    return codeReviewFraction;
  } catch (error) {
    logger.error(error);
    return 0;
  }
}*/
/*export async function calculateCodeReviewFraction(owner: string, repo: string): Promise<number> {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    };

    // Get the pull requests
    const pullRequestsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=100`, { headers });
    logger.info(pullRequestsResponse)
    // Filter pull requests based on the merged_at property
    const mergedPullRequests = pullRequestsResponse.data.filter(
      (pr: any) => pr.merged_at !== null
    );

    // Filter merged pull requests with the 'approved' label (adjust as needed)
   /* const approvedMergedPullRequests = mergedPullRequests.filter(
      (pr: any) => pr.labels.some((label: any) => label.name === 'approved')
    );

    // Get the total number of commits
    const commitsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, { headers });
    const totalCommits = commitsResponse.data.length;

    if (totalCommits === 0) {
      // Handle the case where there are no commits
      return 0;
    }

    // Calculate the code review fraction
    const codeReviewFraction = mergedPullRequests.length / totalCommits;

    return codeReviewFraction;
  } catch (error) {
    logger.error(error);
    return 0;
  }
}*/
function calculateCodeReviewFraction(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, commitsResponse, commitNodes, commitsFromPRCount, proportionFromPR, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    headers = {
                        Authorization: "Bearer ".concat(process.env.GITHUB_TOKEN),
                    };
                    return [4 /*yield*/, axios_1.default.post('https://api.github.com/graphql', {
                            query: "\n          query {\n            repository(owner: \"".concat(owner, "\", name: \"").concat(repo, "\") {\n              defaultBranchRef {\n                target {\n                  ... on Commit {\n                    history {\n                      nodes {\n                        oid\n                        associatedPullRequests(first: 1) {\n                          totalCount\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        "),
                        }, { headers: headers })];
                case 1:
                    commitsResponse = _a.sent();
                    commitNodes = commitsResponse.data.data.repository.defaultBranchRef.target.history.nodes;
                    if (commitNodes.length === 0) {
                        // Handle the case where there are no commits
                        return [2 /*return*/, 0];
                    }
                    commitsFromPRCount = commitNodes.filter(function (commitNode) { return commitNode.associatedPullRequests.totalCount > 0; }).length;
                    proportionFromPR = commitsFromPRCount / commitNodes.length;
                    //logger.info(`Proportion of commits from pull requests: ${proportionFromPR}`);
                    return [2 /*return*/, proportionFromPR];
                case 2:
                    error_5 = _a.sent();
                    logger_1.default.error("".concat(error_5));
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.calculateCodeReviewFraction = calculateCodeReviewFraction;
function getGitHubPackageVersion(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, tagsResponse, latestTag, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    headers = { Authorization: "Bearer ".concat(process.env.GITHUB_TOKEN) };
                    return [4 /*yield*/, axios_1.default.get("https://api.github.com/repos/".concat(owner, "/").concat(repo, "/tags"), { headers: headers })];
                case 1:
                    tagsResponse = _a.sent();
                    // Check if there are tags available
                    if (tagsResponse.data.length === 0) {
                        logger_1.default.info('No tags found for the repository.');
                        return [2 /*return*/, '1.0'];
                    }
                    latestTag = tagsResponse.data[0].name || '1.0';
                    //logger.info('Latest tag:', latestTag);
                    return [2 /*return*/, latestTag];
                case 2:
                    error_6 = _a.sent();
                    logger_1.default.error("Error fetching GitHub package version: ".concat(error_6.message));
                    //logger.info(owner)
                    //logger.info(repo)
                    return [2 /*return*/, '1.0'];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getGitHubPackageVersion = getGitHubPackageVersion;
