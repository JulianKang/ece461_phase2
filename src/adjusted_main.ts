/*
This file is part of ECE461Project.

ECE461Projectis free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

ECE461Project is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see https://www.gnu.org/licenses/. 
*/

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { calculateBusFactor, netScore, responsiveMaintainer, licenseCheck, calculateCorrectnessScore, RampUp } from './algo';
import { getInfo, processUrls } from './parser';
import * as dotenv from 'dotenv'
import { json } from 'node:stream/consumers';
import { exit } from 'process';
import * as Schemas from './schemas';
const winston = require('winston'); // Import Winston using CommonJS syntax
winston.remove(winston.transports.Console); // Remove the default console transport
dotenv.config();

// Check if GITHUB_TOKEN is set and provide a default value if not
if (!process.env.GITHUB_TOKEN) {
  process.exit(1);
}

if (!process.env.LOG_FILE) {
  process.exit(1);
}

const logLevel = parseInt(process.env.LOG_LEVEL as string); // logLevel is a defined after line 30


// Configure Winston to use a log file and set log level based on environment variables
winston.configure({
  level: logLevel === 0 ? 'error' : (logLevel === 1 ? 'info' : 'debug'), // Default to 'error' if LOG_LEVEL is not set
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: process.env.LOG_FILE }), // Log to a file
  ],
});

const githubToken = process.env.GITHUB_TOKEN;


// Determine the subdirectory name for storing cloned repositories
const localRepositorySubdirectory = 'cloned_repositories';

// Construct the full path to the local repository directory
const localRepositoryDirectory = path.join(__dirname, localRepositorySubdirectory);

// Function to create or clear a directory
function createOrClearDirectory(directoryPath: string) {
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        // Recursively remove directories
        createOrClearDirectory(filePath);
        fs.rmdirSync(filePath);
      } else {
        // Delete files
        fs.unlinkSync(filePath);
      }
    }
  } else {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

// Function to fetch the number of weekly commits and other required data
export async function fetchDataAndCalculateScore(inputUrl: string): Promise<Schemas.PackageRating> {
  let repoUrl = inputUrl;

  // Check if the input URL is an npm package link and try to get the corresponding GitHub repo
  if (inputUrl.startsWith('https://www.npmjs.com/package/')) {
    const packageName = extractPackageNameFromNpmLink(inputUrl);

    if (packageName) {
      const githubRepo = await getGitHubRepoFromNpm(packageName);

      if (githubRepo) {
        repoUrl = githubRepo;
      } else {
        winston.error(`Unable to find GitHub repository for npm package "${packageName}"`);
     //   process.exit(1); // Exit with a failure status code (1) on error
      }
    } else {
      winston.error(`Invalid npm package link: "${inputUrl}"`);
      throw new Error(`Invalid npm package link: "${inputUrl}"`);
     // process.exit(1); // Exit with a failure status code (1) on error
    }
  }
  // Define your GitHub Personal Access Token
  const githubToken = process.env.GITHUB_TOKEN; // Replace with your GitHub token

  // Define headers with the authorization token
  const headers = {
    Authorization: `Bearer ${githubToken}`,
  };
  // Define the GraphQL endpoint URL
  const graphqlEndpoint = 'https://api.github.com/graphql';

  // Create or clear the local repository directory
  createOrClearDirectory(localRepositoryDirectory);
  winston.info(`Processing URL: ${repoUrl}`);

  const parsedURL = parseGitHubUrl(repoUrl);
  if(parsedURL == null) {
    winston.error(`Invalid GitHub URL: ${repoUrl}`);
    throw new Error(`Invalid GitHub URL: ${repoUrl}`);
  //  process.exit(1);
  }
  

  // Read GraphQL queries from queries.txt
  const queries =
    `query {
    repository(owner: "${parsedURL.owner}", name: "${parsedURL.repoName}") {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1) {
              edges {
                node {
                  committedDate
                }
              }
            }
          }
        }
      }
      ObjectReadme: object(expression: "HEAD:Readme.md") {
        ... on Blob {
          text
        }
      }
      ObjectREADME: object(expression: "HEAD:README.md") {
        ... on Blob {
          text
        }
      }
    }
  }`;

  try {
    const response = await axios.post(
      graphqlEndpoint,
      { query: queries },
      { headers }
    );
    if (response.data.errors) {
      // Log GraphQL query errors
      winston.error(`GraphQL query errors: ${JSON.stringify(response.data.errors)}`);
      //process.exit(1); // Exit with a failure status code (1) on error
      throw new Error(`GraphQL query errors: ${JSON.stringify(response.data.errors)}`);
      
    }
    const data = response.data.data;
    winston.info(data);
    if (!data || !data.repository || !data.repository.defaultBranchRef || !data.repository.defaultBranchRef.target || !data.repository.defaultBranchRef.target.history || !data.repository.defaultBranchRef.target.history.edges || !data.repository.defaultBranchRef.target.history.edges[0] || !data.repository.defaultBranchRef.target.history.edges[0].node || !data.repository.defaultBranchRef.target.history.edges[0].node.committedDate) {
      winston.error(`Error: GraphQL response does not contain the expected data for URL ${repoUrl}`);
      //process.exit(1); // Exit with a failure status code (1) on error
      throw new Error(`Error: GraphQL response does not contain the expected data for URL ${repoUrl}`);
    }

    // Extract the necessary data from the GraphQL response
    const lastCommitDate = new Date(data.repository.defaultBranchRef.target.history.edges[0].node.committedDate);
    const readmeText = data.repository.ObjectReadme ? data.repository.ObjectReadme.text : (data.repository.ObjectREADME ? data.repository.ObjectREADME.text : '');
    // Calculate the date one week ago from the current date
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Count the number of commits within the past week
    let weeklyCommitCount = 0;
    for (const commit of data.repository.defaultBranchRef.target.history.edges) {
      const commitDate = new Date(commit.node.committedDate);
      if (commitDate >= oneWeekAgo && commitDate <= lastCommitDate) {
        weeklyCommitCount++;
      } else {
        // Break the loop as soon as a commit is older than one week
        break;
      }
    }

    const rampUpResult = RampUp(weeklyCommitCount);
    // Fetch and process issues data
    const issues = await fetchAndProcessIssues(repoUrl);

    // Calculate the "correctness" score
    const correctnessScore = calculateCorrectnessScore(issues);
    // Process the data using your algo functions
    const busFactorResult = await calculateBusFactor(
      repoUrl, // Replace with the actual repository URL
      localRepositoryDirectory // Replace with the local directory path
    );

    const responsiveMaintainerResult = responsiveMaintainer(
      lastCommitDate.getTime()
    );

    const licenseCheckResult = licenseCheck(readmeText);
    
    winston.debug(`Weekly Commit Count: ${weeklyCommitCount}`);
    winston.debug(`Ramp Up Score: ${rampUpResult}`);
    winston.debug(`Correctness Score: ${correctnessScore}`);
    winston.debug(`Bus Factor Score: ${busFactorResult}`);
    winston.debug(`Responsive Maintainer Score: ${responsiveMaintainerResult}`);
    winston.debug(`License Score: ${licenseCheckResult}`);

    // Calculate the net score using your netScore function
    const netScoreResult = netScore(
      licenseCheckResult,
      busFactorResult,
      responsiveMaintainerResult,
      correctnessScore, // Include the correctness score
      rampUpResult // Use the retrieved weeklyCommits value
    );
    winston.info(`NET_SCORE: ${netScoreResult}`);

    // Return the result for NDJSON formatting
    const output: {ratings: Schemas.PackageURL, url: Schemas.PackageURL} = {
      ratings: {
        BusFactor: parseFloat(busFactorResult.toFixed(5)),
        Correctness: parseFloat(correctnessScore.toFixed(5)),
        RamUp: parseFloat(rampUpResult.toFixed(5)),
        ResponsiveMaintainer: parseFloat(responsiveMaintainerResult.toFixed(5)),
        LicenseScore: parseFloat(licenseCheckResult.toFixed(5)),
        GoodPinningPractice: 0.5, // TODO
        PullRequest: 0.5, // TODO
        NetScore: parseFloat(netScoreResult.toFixed(5)), 
      }, 
      url: repoUrl
  };
    
    // Serialize the output to JSON
    const jsonOutput = JSON.stringify(output);
    
    // Log the JSON output
    console.log(jsonOutput);
    return output
  } catch (error) {
    winston.error(`Error processing URL ${repoUrl}: ${error}`);
    //process.exit(1); // Exit with a failure status code (1) on error
    throw new Error(`Error processing URL ${repoUrl}: ${error}`);
    
  }
}

async function processAndCalculateScoresForUrls(filePath: string, outputStream: NodeJS.WritableStream) {
  
  try {
    const urls = await processUrls(filePath);

    // Process URLs sequentially using async/await
    for (const repoUrl of urls) {
      const result = await fetchDataAndCalculateScore(repoUrl);

      // Format the result as NDJSON and write it to the output stream
      outputStream.write(JSON.stringify(result) + '\n');
    }

    // All URLs processed successfully, exit with a success status code (0)
    process.exit(0);
  } catch (error) {
    console.error('Error processing URLs or calculating scores:', error);
    //process.exit(1); // Exit with a failure status code (1) on error
    throw new Error(`Error processing URLs or calculating scores: ${error}`);
  }
}


// Define a function to parse GitHub repository URL
function parseGitHubUrl(url : string) : { owner: string, repoName: string } | null {
  const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(githubRegex);

  if (match && match.length === 3) {
    const owner = match[1];
    const repoName = match[2];
    return { owner, repoName };
  } else {
    return null;
  }
}

// Define a function to fetch and process issues data from the repository
async function fetchAndProcessIssues(repositoryUrl: string) {
  try {
    // Assuming your GitHub repository URL is in the format "https://github.com/owner/repo"
    const parts = repositoryUrl.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    // Fetch issues from the GitHub REST API
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`);

    // Process the issues and return an array of Issue objects
    const issues = response.data.map((issue: any) => ({
      isBug: issue.labels.some((label: any) => label.name === 'bug'),
      status: issue.state,
    }));

    return issues;
  } catch (error) {
    return []; // Return an empty array in case of an error
  }
}


// Function to extract the npm package name from an npm link
function extractPackageNameFromNpmLink(npmLink: string): string | null {
  const npmLinkRegex = /www\.npmjs\.com\/package\/([^/]+)/;
  const match = npmLink.match(npmLinkRegex);

  if (match && match.length === 2) {
    return match[1];
  } else {
    return null;
  }
}

// Function to fetch GitHub repository information from an npm package name
async function getGitHubRepoFromNpm(packageName: string): Promise<string | null> {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const packageData = response.data;

    if (packageData.repository && packageData.repository.url) {
      // Extract the GitHub repository URL from the npm package data
      const repositoryUrl = packageData.repository.url;
      // Convert the npm-specific URL to a GitHub URL
      const githubUrl = repositoryUrl.replace(/^git\+/, '').replace(/\.git$/, '');
      return githubUrl;
    }
    return null;
  } catch (error) {
    return null;
  }
}
