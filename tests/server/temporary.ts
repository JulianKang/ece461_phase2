import { PackageManagementAPI } from '../../src/server/server';
import dbCommunicator from '../../src/dbCommunicator';
import * as Schemas from '../../src/schemas';
import Evaluate = Schemas.Evaluate;
import { describe, test, expect, beforeAll, jest, it } from '@jest/globals';
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
    const apiServer = new PackageManagementAPI();
    const app = apiServer.getApp();
    apiServer.start(3000);
    
    describe('POST Endpoints', () => {
        describe('/packages', () => {
            // list of packages
            ValidConstants.PackageQuerys.forEach((packageQuery) => {
            it('should return 200 and not be empty', async () => {
                const response = await request(app).post('/packages').send(packageQuery);
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBeGreaterThan(0);
                response.body.forEach((packageMetadata: Schemas.PackageMetadata) => {
                    expect(Evaluate.isPackageMetadata(packageMetadata)).toBeTruthy();
                });
            });});
            InvalidConstants.UnsuccessfulPackageQuerys.forEach((packageQuery) => {
            it('should return 200 and be empty', async () => {
                const response = await request(app).post('/packages').send(packageQuery);
                expect(response.statusCode).toBe(200);
                response.body.forEach((dataList: Schemas.PackageMetadata) => {
                    expect(dataList).toBe(0);
                });
            });});
            // There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.
            InvalidConstants.anyList.forEach((packageQuery) => {
            it('should return 400', async () => {
                const response = await request(app).post('/packages').send(packageQuery);
                expect(response.statusCode).toBe(400);
            });});
            // too many packages (returned?) TODO may have to change this
            it.skip('should return 413', async () => {
                
            });
        });

    //     describe.skip('/package', () => {

    //     });


    //     describe.skip('/package/byRegEx', () => {

    //     });
    // });

    // describe.skip('GET Endpoints', () => {
    //     describe('/', () => {
    //         it('should return 200', async () => {
    //             const response = await request(app).get('/');
    //             expect(response.statusCode).toBe(200);
    //         });
    //     });
        
    //     describe.skip('/package/:id', () => {

    //     });

        
    //     describe.skip('/package/:id/rate', () => {

    //     });

        
    //     describe.skip('/package/byName/:name', () => {

    //     });
    // });

    // describe.skip('PUT Endpoints', () => {
    //     describe('/package/:id', () => {

    //     });


    //     describe('/authenticate', () => {

    //     });
    // });

    // describe.skip('DELETE Endpoints', () => {
    //     describe('/reset', () => {

    //     });


    //     describe('/package/:id', () => {

    //     });


    //     describe('/package/byName/:name', () => {

    //     });
    // });
});
});

jest.clearAllMocks();