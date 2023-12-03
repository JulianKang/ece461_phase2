/*
This file is part of ECE461Project.

ECE461Projectis free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

ECE461Project is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see https://www.gnu.org/licenses/. 
*/

import simpleGit, { SimpleGit, LogResult, DefaultLogFields } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';

interface Contributor {
  name: string;
  commitCount: number;
}

interface Issue {
  isBug: boolean;
  status: string;
}

//Bus Factor = Total Code Contributions by Top Contributors / Total Code Contributions
export async function calculateBusFactor(repositoryUrl: string, localDirectory: string, topContributorsCount: number = 3): Promise<number> {
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

    return busFactor;
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error; // Re-throw the error if needed
  }
}


export function netScore(ls: number, bf: number, rm: number, cs: number, ru: number) {
  return (ls * .1 + + bf * 0.3 + rm * 0.3 + cs * 0.1 + ru * 0.2); // Adjust the weights as needed
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

export function RampUp(weekly: number) {
  let score: number = weekly / 100;
  if (score < 1) {
    return score;
  }
  return 1;
}

export function licenseCheck(readmeContent: string): number {
  // Use regex to parse the project readme and check for the required license
  const licenseRegex = /GNU Lesser General Public License v2\.1/;
  const hasLicense = licenseRegex.test(readmeContent);

  // Return a score of 1 if the license matches, 0 otherwise
  return hasLicense ? 1 : 0;
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
    //console.log('boom')
    return `https://github.com/${ownerAndRepo}`;
  }
  else if (repositoryUrl.includes('git@github.com')) {
    // Extract the owner and repo from the SSH URL
    const parts = repositoryUrl.split('git@github.com');
    const ownerAndRepo = parts[1]//.replace('.git', '');
    // Construct the HTTPS URL
    //console.log('boom')
    return `https://github.com${ownerAndRepo}`;
  }
  // If it's not an SSH URL, return the original URL
  return repositoryUrl;
}

async function getRepoDependencies(git: SimpleGit): Promise<string[]> {
  const packageJsonPath = path.join(git.cwd(), 'package.json');

  try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      return dependencies;
  } catch (error: Error) {
      console.error(`Error reading package.json: ${error.message}`);
      return [];
  }
}

async function calculatePinnedDependencies(git: SimpleGit, targetVersion: string): Promise<number> {
  try {
      const dependencies = await getRepoDependencies(git);
      
      if (dependencies.length === 0) {
          return 1.0; // If there are no dependencies, return 1.0
      }

      const pinnedDependencies = dependencies.filter(dep => {
          const version = dep.split('@')[1];
          return version && version.startsWith(targetVersion);
      });

      return pinnedDependencies.length / dependencies.length;
  } catch (error) {
      console.error(error);
      return 0;
  }
}

async function calculateCodeReviewFraction(git: SimpleGit): Promise<number> {
  try {
      const response: Response<string> = await git.raw(['log', '--merges', '--grep=^Merge pull request']);
      const pullRequests = response.body;

      const allPullRequests = pullRequests.split('\n');
      const reviewedPullRequests = allPullRequests.filter(pr: any => pr.includes('Reviewed-by:'));

      return reviewedPullRequests.length / allPullRequests.length;
  } catch (error) {
      console.error(error);
      return 0;
  }
}