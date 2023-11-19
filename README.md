# ECE 461 Software Engineering Project - A Trustworthy Module Registry

This repository contains the code for the Phase 2 project for ECE 461 Software Engineering - Fall 2023 Team 14.

AUTHORS: Hunter Gruler, Ben Boardley, Julian Kang, Nathaniel Bielanski

This repository is under construction and no guarantees are made on the accuracy of the contents of this repository.

## Usage

This project streamlines common development tasks with a Bash script, `your-script.sh`. Ensure Node.js and npm are installed for the following commands:

- **Installation**: Run `./run install` to install dependencies, including TypeScript and testing tools.

- **Fetching GitHub Repository Info**: Use `./run fetchGitHubInfo filename-to-parse` to fetch GitHub repository information from a TypeScript file (place before "test" in the script).

- **Testing**: Execute TypeScript tests with `./run test`. Place your tests in a "tests" folder or use filenames ending in ".test.ts".

## Algorithm Implementation (algo.ts)

This file contains TypeScript functions to assess GitHub repositories:

- **`calculateBusFactor`**: Calculates the Bus Factor, identifying top contributors based on commit history.

- **`netScore`**: Computes a net score considering various factors.

- **`responsiveMaintainer`**: Measures the responsiveness of maintainers.

- **`RampUp`**: Evaluates the repository's activity ramp-up.

- **`licenseCheck`**: Checks for a specific license in the README.

## GitHub Repository Information Checker (checkrepo.ts)

A TypeScript script (`checkrepo.ts`) fetches and analyzes GitHub repository info. Customize GraphQL queries in `queries.txt`.

## Jest Configuration (jest.config.js)

This Jest configuration file (`jtest.config.js`) simplifies TypeScript testing setup.

## GitHub Repository Information Integration (main.ts)

This TypeScript script (`main.ts`) integrates GitHub API queries, data processing, and custom algorithms.

## URL Parsing and Processing (parser.js / parser.ts)

These modules handle and process URLs from a file, with JavaScript (`parser.js`) and TypeScript (`parser.ts`) options.

### Usage

- Import `getInfo` function for custom URL processing.

- Run as a script with `node parser.js filePath` (JavaScript) or `ts-node parser.ts filePath` (TypeScript).

## Testing the Parser Module: `parser_test.test.ts`

This test file is designed to evaluate the functionality and robustness of the parser module. The tests leverage several libraries including `chai` for assertions, `sinon` for spies, stubs, and mocks, and `proxyquire` to intercept module dependencies.

### Mocking Dependencies

To isolate the functionality of the parser from external dependencies, we're using `proxyquire`. In this test suite, the `fs.readFile` function is mocked to prevent actual file I/O operations:

```javascript
const { getInfo, processUrls } = proxyquire('./parser', {
  fs: {
    readFile: (filePath: string, encoding: string, callback: (err: NodeJS.ErrnoException | null, data: string) => void) => {
      callback(null, 'dummy file content');
    },
  },
});
