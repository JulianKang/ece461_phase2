/*
This file is part of ECE461Project.

ECE461Projectis free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

ECE461Project is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see https://www.gnu.org/licenses/. 
*/

import simpleGit, { SimpleGit, LogResult, DefaultLogFields } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import logger from './logger'
const logLevel = parseInt(process.env.LOG_LEVEL as string); 
interface Contributor {
  name: string;
  commitCount: number;
}

interface Issue {
  isBug: boolean;
  status: string;
}

//Bus Factor = Total Code Contributions by Top Contributors / Total Code Contributions
export async function calculateBusFactor(repositoryUrl: string, localDirectory: string, topContributorsCount: number = 3): Promise<object> {
  // Initialize SimpleGit
  const git: SimpleGit = simpleGit({ baseDir: localDirectory });

  try {
    // Clone the Git repository
    const httpsRepositoryUrl = convertToHttpsUrl(repositoryUrl);
    
    await git.clone(httpsRepositoryUrl, localDirectory);
    // Get the list of commit log lines
    const log: LogResult<DefaultLogFields> = await git.log();

    // Create a map to store commit counts per contributor
    const commitCounts = new Map<string, number>();

    // Iterate through the commit log and count contributions
    for (const commit of log.all) {
      const author = commit.author_name;

      // If the author is already in the map, increment their commit count
      if (commitCounts.has(author)) {
        commitCounts.set(author, commitCounts.get(author)! + 1);
      } else {
        // Otherwise, initialize their commit count to 1
        commitCounts.set(author, 1);
      }
    }

    // Sort contributors by commit count in descending order
    const sortedContributors = Array.from(commitCounts.entries()).sort((a, b) => b[1] - a[1]);

    // Calculate the total code contributions by top contributors
    let totalTopContributions = 0;
    for (let i = 0; i < topContributorsCount && i < sortedContributors.length; i++) {
      totalTopContributions += sortedContributors[i][1];
    }

    // Calculate the total code contributions for the entire project
    const totalContributions = log.total;

    // Calculate the Bus Factor
    const busFactor = totalTopContributions / totalContributions;

    return {busFactor:busFactor, url:httpsRepositoryUrl};
  } catch (error) {
    logger.error(`Error: ${error}`);
    throw error; // Re-throw the error if needed
  }
}


export function netScore(ls: number, bf: number, rm: number, cs: number, ru: number, df: number, pf: number) {
  return (ls * .1 + + bf * 0.2 + rm * 0.2 + cs * 0.1 + ru * 0.2 + 0.1*df + 0.1*pf); // Adjust the weights as needed
}

export function responsiveMaintainer(date: number) {
  // Calculate the number of days since the last publish
  const currentDate = new Date();
  const lastPublishDate = new Date(date);
  const daysSinceLastPublish = Math.floor((currentDate.getTime() - lastPublishDate.getTime()) / (1000 * 60 * 60 * 24));
  let resp: number = 1 - (daysSinceLastPublish / 365);
  if (resp > 0) {
    return resp;
  }
  return 0;
}
async function queryGithubapi(queryendpoint: string): Promise<AxiosResponse<any[]> | null> {
  try {
    const axiosInstance = axios.create({
      baseURL: 'https://api.github.com/',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/json',
        'X-GitHub-Api-Version': '2022-11-28', // Add the version header here
      },
    });

    let response: AxiosResponse<any[]>;
    let count = 10; // Maximum retry count for 202 responses
    let retries = 0;
    do {
      response = await axiosInstance.get(queryendpoint);

      if (response.status === 202) {
        // If the response is 202, it means the request is still processing.
        // Wait for a while before retrying, and decrement the count.
        count--;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the polling interval as needed.
      } else if (response.status === 403) {
        // Implement exponential backoff for 403 responses.
        if (!retries) {
          logger.error(`Rate limit exceeded. Applying exponential backoff.`);
        }
        retries++;
        const maxRetryDelay = 60000; // Maximum delay between retries (in milliseconds).
        const retryDelay = Math.min(Math.pow(2, retries) * 1000, maxRetryDelay); // Exponential backoff formula.
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    } while ((response.status === 202 && count > 0) || response.status === 403);

    return response;
  } catch (error) {
    logger.error(`${error}`);
    return null;
  }
}
export async function RampUp(owner: string, repo:string): Promise<number>{//weekly: number) {
/*  let score: number = weekly / 100;
  if (score < 1) {
    return score;
  }
  return 1;*/
  const thresholdRampUp: number = 8;
  const queryendpoint: string = `repos/${owner}/${repo}/stats/contributors`;

  try {
    const response = await queryGithubapi(queryendpoint);

    if (!response || !Array.isArray(response.data)) {
      logger.error(`GitHub API failed to return Ramp Up (contributor) information for repository: ${owner}/${repo}`);
      return 0;
    }

    const contributors = response.data;

    const firstCommitWeeks = contributors.map((contributor: any) => {
      for (const week of contributor.weeks) {
        if (week.c > 0) {
          return week.w;
        }
      }
      return 0;
    }).filter(Boolean);

    if (firstCommitWeeks.length === 0) {
      return 0;
    }

    const sortedWeeks = firstCommitWeeks.slice().sort((a, b) => a - b);
    let differences = [];
    for (let i = 1; i < sortedWeeks.length; i++) {
      const diff = sortedWeeks[i] - sortedWeeks[i - 1];
      differences.push(diff);
    }

    const averageSeconds = differences.reduce((acc, diff) => acc + diff, 0) / differences.length;
    const averageWeeks = averageSeconds / 60 / 60 / 24 / 7;

    const rampUp = averageWeeks ? Math.min(1, thresholdRampUp / averageWeeks) : 0;
    return parseFloat(rampUp.toFixed(5));
  } catch (error: any) {
    logger.error(`Error fetching contributor information from GitHub API: ${error.message}`);
    return 0;
  }
}

// checking if there is an upstream license compatible with LGPL-2.1
export function licenseCheck(text: string): number {
  // Use regex to parse the project readme and check for the required license
  let hashLicense: boolean;
  const compatibleLicenseRegex = [/MIT/, /LGPL 2\.1/, /2-Clause BSD/, /Curl/, /ISC/, /MPL 2\.0/, /NTP/, /UPL 2\.0/, /WTFPL/, /X11/, /zlib/];
  compatibleLicenseRegex.forEach((RegEx) => {
    hashLicense = RegEx.test(text);
    if(hashLicense && !(/zlib-acknowledgement/.test(text))) { // zlib-acknowledgement is an exception to the zlib license compatibility
      return 1;
    }
  });

  const incompatibleLicenseRegex = [/AGPL/, /4-Clause BSD/, /CDDL/, /EPL/, /EUPL/, /GPL/, /IJG/, /MPL/, /Ms-RL/, /OSL/, /RPL/, /XFree86/, /zlib/];
  incompatibleLicenseRegex.forEach((RegEx) => {
    hashLicense = RegEx.test(text);
    if(hashLicense) {
      return 0;
    }
  });


  return 0.5; // TODO, since we don't know the license, likely should be return 0, returning 0.5 for now though for testing
}

export function calculateCorrectnessScore(issues: Issue[]): number {
  // Implement your logic to calculate the "correctness" score based on issues
  // For example, you can count open bugs and calculate a score
  const openBugs = issues.filter((issue) => issue.isBug && issue.status === 'open').length;
  const totalBugs = issues.filter((issue) => issue.isBug).length;

  // Calculate the correctness score as the ratio of open bugs to total bugs
  if (totalBugs === 0) {
    return 1; // If there are no bugs, consider it perfect
  }
  return 1 - openBugs / totalBugs;
}

function convertToHttpsUrl(repositoryUrl: string): string {
  // Check if the repository URL starts with 'git@github.com:'
  if (repositoryUrl.startsWith('git@github.com')) {
    // Extract the owner and repo from the SSH URL
    const parts = repositoryUrl.split(':');
    const ownerAndRepo = parts[1].replace('.git', '');
    // Construct the HTTPS URL
    //logger.info('boom')
    return `https://github.com/${ownerAndRepo}`;
  }
  else if (repositoryUrl.includes('git@github.com')) {
    // Extract the owner and repo from the SSH URL
    const parts = repositoryUrl.split('git@github.com');
    const ownerAndRepo = parts[1]//.replace('.git', '');
    // Construct the HTTPS URL
    //logger.info('boom')
    return `https://github.com${ownerAndRepo}`;
  }
  // If it's not an SSH URL, return the original URL
  return repositoryUrl;
}

async function getRepoDependencies(): Promise<string[]> {
  const packageJsonPath = path.join(__dirname, 'cloned_repositories/package.json');
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    const dependencies = Object.entries(packageJson.dependencies || {}).map(([dependency, version]) => {
      return `${dependency}@${version}`;
    });
    return dependencies;
  } catch (error: any) {
    logger.error(`Error reading package.json: ${error.message}`);
    return [];
  }
}

export async function calculatePinnedDependencies(): Promise<number> {
  try {
    const dependencies = await getRepoDependencies();

    if (dependencies.length === 0) {
      return 1.0; // If there are no dependencies, return 1.0
    }
    //logger.info(dependencies)
    const pinnedDependencies = dependencies.filter(dep => {
      const version = dep.split('@')[1];
      //logger.info(version)
      //logger.info(version.match(/(\d+)\.(\d+)/))
      return version && version.match(/(\d+)\.(\d+)/) !== null; // Check if the version follows the major.minor format
    });
    //logger.info(pinnedDependencies)
    // Calculate the fraction of dependencies with major+minor version versus total dependencies
    const fraction = pinnedDependencies.length / dependencies.length;

    return fraction;
  } catch (error) {
    logger.error(`${error}`);
    return 1; // You may want to handle errors more appropriately based on your use case
  }
}


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
export async function calculateCodeReviewFraction(owner: string, repo: string): Promise<number> {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    };

    // Get all commits
    const commitsResponse = await axios.post(
      'https://api.github.com/graphql',
      {
        query: `
          query {
            repository(owner: "${owner}", name: "${repo}") {
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      nodes {
                        oid
                        associatedPullRequests(first: 1) {
                          totalCount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      },
      { headers }
    );

    const commitNodes = commitsResponse.data.data.repository.defaultBranchRef.target.history.nodes;

    if (commitNodes.length === 0) {
      // Handle the case where there are no commits
      return 0;
    }
    
    // Count the number of commits associated with pull requests
    const commitsFromPRCount = commitNodes.filter((commitNode: any) => commitNode.associatedPullRequests.totalCount > 0).length;
    //logger.info(commitsFromPRCount)
    // Calculate the proportion of commits from pull requests
    const proportionFromPR = commitsFromPRCount / commitNodes.length;

    //logger.info(`Proportion of commits from pull requests: ${proportionFromPR}`);
    
    return proportionFromPR;
  } catch (error) {
    logger.error(`${error}`);
    return 0;
  }
}

export async function getGitHubPackageVersion(owner: string, repo: string): Promise<string> {
  try {
    // Get the tags for the repository
    const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` };

    // Get the tags for the repository
    const tagsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/tags`, { headers });

    // Check if there are tags available
    if (tagsResponse.data.length === 0) {
      logger.info('No tags found for the repository.');
      return '1.0';
    }

    // Get the latest tag
    const latestTag = tagsResponse.data[0].name || '1.0';

    //logger.info('Latest tag:', latestTag);

    return latestTag;
  } catch (error: any) {
    logger.error(`Error fetching GitHub package version: ${error.message}`);
    //logger.info(owner)
    //logger.info(repo)
    return '1.0';
  }
}