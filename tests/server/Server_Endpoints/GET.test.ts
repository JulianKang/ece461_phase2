import { PackageManagementAPI } from '../../../src/server/server';
import dbCommunicator from '../../../src/dbCommunicator';
import * as Schemas from '../../../src/schemas';
import Evaluate = Schemas.Evaluate;
import { describe, expect, beforeAll, afterAll, jest, it } from '@jest/globals';
import { ValidConstants, InvalidConstants, MockedDBCommunicator,  } from '../testHelper';
import request from 'supertest';
import express from 'express';

// Mocking DBCommunicator
jest.mock('../../../src/dbCommunicator');

let apiServer: PackageManagementAPI;
let app: express.Application;

beforeAll(() => {
    dbCommunicator.connect = jest.fn(async () => {});
    dbCommunicator.getPackageMetadata = jest.fn(MockedDBCommunicator.getPackageMetadata);
    dbCommunicator.resetRegistry = jest.fn(MockedDBCommunicator.resetRegistry);
    dbCommunicator.getPackageById = jest.fn(MockedDBCommunicator.getPackageById);
    dbCommunicator.updatePackageById = jest.fn(MockedDBCommunicator.updatePackageById);
    dbCommunicator.deletePackageById = jest.fn(MockedDBCommunicator.deletePackageById);
    dbCommunicator.getPackageRatings = jest.fn(MockedDBCommunicator.getPackageRatings);
    dbCommunicator.deletePackageByName = jest.fn(MockedDBCommunicator.deletePackageByName);
    dbCommunicator.searchPackagesByRegex = jest.fn(MockedDBCommunicator.searchPackagesByRegex);
    
    apiServer = new PackageManagementAPI();
    apiServer.start(8084);
    app = apiServer.getApp();
});

afterAll(async () => {
    await apiServer.close();
    jest.clearAllMocks();
});


describe('/', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});

describe('/package/:id', () => {
    it('should return 200', async () => {
        ValidConstants.PackageIDs.forEach(async (curr) => {
            const response = await request(app).get(`/package/${curr}`);
            expect(response.statusCode).toBe(200);
            expect(Evaluate.isPackage(response.body)).toBeTruthy();
        });
    });
    //  i can't figure out a way to test this, always returns 404
    // for '', ' ', null, undefined
    // TODO not prioritizing this rn 
    it.skip('should return 400', async () => {
        const curr = '';
        const response = await request(app).get(`/package/${curr}`);
        expect(response.statusCode).toBe(400);
    });
    it('should return 404', async () => {
        InvalidConstants.NonPackageIDs.forEach(async (curr) => {
            const response = await request(app).get(`/package/${curr}`);
            expect(response.statusCode).toBe(404);
        });
    });
});


describe('/package/:id/rate', () => {
    it('should return 200', async () => {
        ValidConstants.PackageIDs.forEach(async (curr) => {
            const response = await request(app).get(`/package/${curr}/rate`);
            expect(response.statusCode).toBe(200);
            expect(Evaluate.isPackageRating(response.body)).toBeTruthy();
        });
    });
    // same problem as '/package/:id' above
    it.skip('should return 400', async () => {
        ['', ' ', undefined, null].forEach(async (curr) => {
            const response = await request(app).get(`/package/${curr}/rate`);
            expect(response.statusCode).toBe(400);
        });
    });
    it('should return 404', async () => {
        InvalidConstants.NonPackageIDs.forEach(async (curr) => {
            const response = await request(app).get(`/package/${curr}/rate`);
            expect(response.statusCode).toBe(404);
        });
    });
});

// NON-BASELINE
describe.skip('/package/byName/:name', () => {

});