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

            expect(response.body).toHaveProperty('name', 'Superman')
            expect(response.body).toHaveProperty('alias', 'Clark Kent')

            authToken = response.body.token
            createdSuperhumanId = response.body._id
        })

    // Test getting all superhumans
        test('should get all superhumans', async () => {
            const response = await request(app)
                .get('/superhumans')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            expect(Array.isArray(response.body)).toBe(true)
        });

    // Test getting a specific superhuman by ID
        test('should get a superhuman by ID', async () => {
            const response = await request(app)
                .get(`/superhumans/${createdSuperhumanId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            expect(response.body._id).toBe(createdSuperhumanId)
            
        });

    // Test updating a superhuman
        test('should update a superhuman', async () => {
            const response = await request(app)
                .put(`/superhumans/${createdSuperhumanId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Superwoman' })
                .expect(200)

            expect(response.body.name).toBe('Superwoman');
        })

    // Test deleting a superhuman
        test('should delete a superhuman', async () => {
            await request(app)
                .delete(`/superhumans/${createdSuperhumanId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
    })