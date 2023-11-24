import { PackageManagementAPI } from '../../src/server/server';
import dbCommunicator from '../../src/dbCommunicator';
import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { beforeEach } from 'node:test';

jest.mock('../../src/dbCommunicator');



const apiServer = new PackageManagementAPI();
const app = apiServer.getApp();
apiServer.start(3000);

describe.skip('Server', () => {
    describe('POST Endpoints', () => {});
    describe('GET Endpoints', () => {});
    describe('GET Endpoints', () => {});
    describe('GET Endpoints', () => {});

    describe('200 level Server Return Codes', () => {
        describe('GET /', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('GET /api', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/api');
                expect(response.statusCode).toBe(200);
            });
        });
    });
});

jest.clearAllMocks();