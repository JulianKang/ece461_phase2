import { PackageManagementAPI } from '../../src/server/server';
import dbCommunicator from '../../src/dbCommunicator';
import * as Schemas from '../../src/schemas';
import Evaluate = Schemas.Evaluate;
import { describe, test, expect, beforeAll, afterAll, jest, it } from '@jest/globals';
import { ValidConstants, InvalidConstants, MockedDBCommunicator } from './testHelper';
import request from 'supertest';
import express from 'express';

// Mocking DBCommunicator
jest.mock('../../src/dbCommunicator');
dbCommunicator.connect = jest.fn(async () => {});
dbCommunicator.getPackageMetadata = jest.fn(MockedDBCommunicator.getPackageMetadata);
dbCommunicator.resetRegistry = jest.fn(MockedDBCommunicator.resetRegistry);
dbCommunicator.getPackageById = jest.fn(MockedDBCommunicator.getPackageById);
dbCommunicator.updatePackageById = jest.fn(MockedDBCommunicator.updatePackageById);
dbCommunicator.deletePackageById = jest.fn(MockedDBCommunicator.deletePackageById);
dbCommunicator.getPackageRatings = jest.fn(MockedDBCommunicator.getPackageRatings);
dbCommunicator.deletePackageByName = jest.fn(MockedDBCommunicator.deletePackageByName);
dbCommunicator.searchPackagesByRegex = jest.fn(MockedDBCommunicator.searchPackagesByRegex);

// Starting Server with Mocked DBCommunicator

describe('Server', () => {
    let apiServer: PackageManagementAPI;
    let app: express.Application;

    beforeAll(() => {
        apiServer = new PackageManagementAPI();
        apiServer.start(3000);
        app = apiServer.getApp();
    });

    afterAll(async () => {
        await apiServer.close();
        jest.clearAllMocks();
    });
    
    describe('POST Endpoints', () => {
        describe('/packages', () => {
            // list of packages
            it('should return 200 and not be empty', async () => {
                const response = await request(app).post('/packages').send(ValidConstants.PackageQuerys);
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBeGreaterThan(0);
                response.body.forEach((dataList: Schemas.PackageMetadata[]) => {
                    dataList.forEach((packageMetadata: Schemas.PackageMetadata) => {
                        expect(Evaluate.isPackageMetadata(packageMetadata)).toBeTruthy();
                    });
                });
            });
            it('should return 200 and be empty', async () => {
                const response = await request(app).post('/packages').send(InvalidConstants.UnsuccessfulPackageQuerys);
                expect(response.statusCode).toBe(200);
                response.body.forEach((dataList: Schemas.PackageMetadata[]) => {
                    expect(dataList.length).toBe(0);
                });
            });
            // There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
            // sending individually since entire list is invalid
            it('should return 400', async () => {
                InvalidConstants.anyList.forEach(async (badPackageQuery) => {
                    const response = await request(app).post('/packages').send([badPackageQuery]);
                    expect(response.statusCode).toBe(400);
                });
            });
        });
    });
});