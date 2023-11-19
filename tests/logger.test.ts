import logger from '../src/logger';
import * as fs from 'fs';
import * as path from 'path';
import { describe, test, expect, beforeAll } from '@jest/globals';
import 'dotenv/config';

describe('Logger', () => {
    beforeAll(() => {
        // Ensure that the LOG_FILE environment variable is set
        if (!process.env.LOG_FILE) {
            throw new Error('LOG_FILE environment variable is not defined.');
        }
    });

    test('logs info messages correctly', async () => {
        // Set the log level to INFO
        process.env.LOG_LEVEL = '1';

        // Log an info message
        logger.info('This is an info message');

        // Construct the path to the combined.log file using the environment variable
        const logFilePath = path.join(__dirname, ('../' + process.env.LOG_FILE) || '');

        // Wait for a short time to allow Winston to create and write to the log file
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Read the contents of the log file
        const logFileContents = fs.readFileSync(logFilePath, 'utf8');

        // Expect that the log file contains the info message
        expect(logFileContents).toContain('This is an info message');
    });

    test('logs warn messages correctly', async () => {
        // Set the log level to INFO
        process.env.LOG_LEVEL = '1';

        // Log a warn message
        logger.warn('This is a warning message');

        // Construct the path to the combined.log file using the environment variable
        const logFilePath = path.join(__dirname, ('../' + process.env.LOG_FILE) || '');

        // Wait for a short time to allow Winston to create and write to the log file
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Read the contents of the log file
        const logFileContents = fs.readFileSync(logFilePath, 'utf8');

        // Expect that the log file contains the warn message
        expect(logFileContents).toContain('This is a warning message');
    });

    test('logs error messages correctly', async () => {
        // Set the log level to INFO
        process.env.LOG_LEVEL = '1';

        // Log an error message
        logger.error('This is an error message');

        // Construct the path to the combined.log file using the environment variable
        const combinedLogFilePath = path.join(__dirname, ('../' + process.env.LOG_FILE) || '');

        // Wait for a short time to allow Winston to create and write to the log file
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Read the contents of the combined.log file
        const combinedLogFileContents = fs.readFileSync(combinedLogFilePath, 'utf8');

        // Expect that the combined.log file contains the error message
        expect(combinedLogFileContents).toContain('This is an error message');
    });

    test('logs debug messages correctly', async () => {
        // Set the log level to DEBUG
        process.env.LOG_LEVEL = '2';

        // Log a debug message
        logger.debug('This is a debug message');

        // Construct the path to the combined.log file using the environment variable
        const logFilePath = path.join(__dirname, ('../' + process.env.LOG_FILE) || '');

        // Wait for a short time to allow Winston to create and write to the log file
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Read the contents of the log file
        const logFileContents = fs.readFileSync(logFilePath, 'utf8');

        // Expect that the log file contains the debug message
        expect(logFileContents).toContain('This is a debug message');
    });
});
