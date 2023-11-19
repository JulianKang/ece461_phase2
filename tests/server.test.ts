import { PackageManagementAPI, functionMinPermissions } from '../src/server';
import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const apiServer = new PackageManagementAPI();
const app = apiServer.getApp();
apiServer.start(3000);

describe.skip('Server', () => {
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

        describe('GET /api/health', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/api/health');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('GET /api/health', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/api/health');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('GET /api/health', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/api/health');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('GET /api/health', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/api/health');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('GET /api/health', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/api/health');
                expect(response.statusCode).toBe(200);
            });
        });

        describe('GET /api/health', () => {
            test('should return 200 OK', async () => {
                const response = await request(app).get('/api/health');
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('400 level Server Return Codes', () => {
    });

    describe('500 level Server Return Codes', () => {
    });
});