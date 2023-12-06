import { PackageManagementAPI } from '../../../src/server/server';
import dbCommunicator from '../../../src/dbCommunicator';
// import * as Helper from '../../../src/server/server_helper';
// import * as Schemas from '../../../src/schemas';
// import Evaluate = Schemas.Evaluate;
import { describe, expect, beforeAll, afterAll, jest, it } from '@jest/globals';
import { MockedDBCommunicator,  } from '../testHelper';
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
    apiServer.start(8081);
    app = apiServer.getApp();
});

afterAll(async () => {
    await apiServer.close();
    jest.clearAllMocks();
});

describe('/reset', () => {
    it('should return 200', async () => {
        const response = await request(app).delete('/reset');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe('System reset successfully');
    });
    // currently not supported, anyone can reset the system
    it.skip('should return 400', async () => {
        const response = await request(app).delete('/reset');
        expect(response.statusCode).toBe(400);
    });
});

// NON-BASELINE
describe.skip('/package/:id', () => {

});

// NON-BASELINE
describe.skip('/package/byName/:name', () => {

});