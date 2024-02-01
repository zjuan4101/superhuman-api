const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming your Express app is exported from app.js
const Superhuman = require('../models/superhuman');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Superhuman API endpoints', () => {
    let authToken;
    let createdSuperhumanId;

    // Test creating a superhuman
        test('should create a new superhuman', async () => {
            const response = await request(app)
                .post('/superhumans')
                .send({
                    name: 'Superman',
                    alias: 'Clark Kent',
                    power: 'Flight',
                    weakness: 'Kryptonite',
                    isHero: true,
                    userId: '65b572b9d12e04500b4fe2ce'
                })
                .expect(200);

            expect(response.body.name).toEqual('Superman')
            expect(response.body.alias).toEqual('Clark Kent')
            expect(response.body.power).toEqual('Flight')
            expect(response.body.weakness).toEqual('Kryptonite')
            expect(response.body.isHero).toBeTruthy()
            expect(response.body.userId).toEqual('65b572b9d12e04500b4fe2ce')



            authToken = response.body.token
            createdSuperhumanId = response.body._id
        })

    // Test getting all superhumans
        test('should get all superhumans', async () => {
            const response = await request(app)
                .get('/superhumans')
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.statusCode).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)

            for(let i = 0; i < response.body.length; i++){
                expect(response.body[i]).toHaveProperty('name')
                expect(response.body[i]).toHaveProperty('alias')
                expect(response.body[i]).toHaveProperty('power')
                expect(response.body[i]).toHaveProperty('weakness')
                expect(response.body[i]).toHaveProperty('isHero')
                expect(response.body[i]).toHaveProperty('userId')

            }
        })

    // Test getting a specific superhuman by ID
        test('should get a superhuman by ID', async () => {
            const response = await request(app)
                .get(`/superhumans/${createdSuperhumanId}`)
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.statusCode).toBe(200)
            expect(response.body.name).toEqual('Superman')
            expect(response.body.alias).toEqual('Clark Kent')
            expect(response.body.power).toEqual('Flight')
            expect(response.body.weakness).toEqual('Kryptonite')
            expect(response.body.isHero).toBeTruthy()
            expect(response.body.userId).toEqual('65b572b9d12e04500b4fe2ce')
            expect(response.body._id).toBe(createdSuperhumanId)
            
        })

    // Test updating a superhuman
        test('should update a superhuman', async () => {
            const response = await request(app)
                .put(`/superhumans/${createdSuperhumanId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Superwoman' })
            
            expect(response.statusCode).toBe(200)
            expect(response.body.name).toBe('Superwoman');
        })

    // Test deleting a superhuman
        test('should delete a superhuman', async () => {
            const response = await request(app)
                .delete(`/superhumans/${createdSuperhumanId}`)
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.statusCode).toBe(200)
            expect(response.body.msg).toEqual('Superhuman deleted successfully')
        })
    })