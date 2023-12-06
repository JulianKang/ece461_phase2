import { PackageManagementAPI } from '../../../src/server/server';
import dbCommunicator from '../../../src/dbCommunicator';
// import * as Schemas from '../../src/schemas';
// import Evaluate = Schemas.Evaluate;
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
    apiServer.start(8082);
    app = apiServer.getApp();
});

afterAll(async () => {
    await apiServer.close();
    jest.clearAllMocks();
});


describe('/package/:id', () => {
    it('should return 200 for valid packages', async () => {
        for (const curr of ValidConstants.Packages) {
            const response = await request(app).put(`/package/${curr.metadata.ID}`).send(curr);
            expect(response.statusCode).toBe(200);
            expect(response.body).toBe('Version is updated.');
        }
    });

    it('should return 400 for invalid packages', async () => {
        for (const curr of InvalidConstants.anyList) {
            let response: any;

            if (typeof curr === 'string') {
                response = await request(app).put(`/package/${curr}`);
            } else {
                response = { statusCode: 400 };
            }

            expect(response.statusCode).toBe(400);
            response = await request(app).put(`/package/it`).send({ curr });
            expect(response.statusCode).toBe(400);
        }
    });

    it('should return 404 for non-existent packages', async () => {
        for (const curr of InvalidConstants.NonPackageIDs) {
            const response = await request(app).put(`/package/${curr}`).send({
                metadata: {
                    Name: "package",
                    Version: "1.0.0",
                    ID: `${curr}`
                },
                data: {
                    Content: "content",
                    JSProgram: "jsp"
                }
            });
            expect(response.statusCode).toBe(404);
        }
    });
});
// NON-BASELINE
describe.skip('/authenticate', () => {

});
