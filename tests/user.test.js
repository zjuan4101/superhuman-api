const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const User = require('../models/user')
const mongoose = require('mongoose')

let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
});

describe('User API endpoints', () => {
    let authToken
    let createdUserId

    // Test creating a user
    describe('Create a new user', () => {
        test('should create a new user', async () => {
            const response = await request(app)
                .post('/users')
                .send({
                    username: 'testuser',
                    password: 'password',
                    firstName: 'Test',
                    lastName: 'User'
                })
                .expect(200)

            expect(response.body).toHaveProperty('token')
            authToken = response.body.token
            createdUserId = response.body.user._id
        });
    });

    // Test getting all users
    describe('Get all users', () => {
        test('should get all users', async () => {
            const response = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            // Verify response body structure and content
            expect(Array.isArray(response.body)).toBe(true)
            // Additional checks for content and structure of user data
        });
    });

    // Test getting a specific user by ID
    describe('Get user by ID', () => {
        test('should get a user by ID', async () => {
            await request(app)
                .get(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        });
    });

    // Test updating a user
    describe('Update user', () => {
        test('should update a user', async () => {
            const response = await request(app)
                .put(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ username: 'updatedusername' })
                .expect(200)
            
            // Additional checks for updated user data
        });
    });

    // Test deleting a user
    describe('Delete user', () => {
        test('should delete a user', async () => {
            await request(app)
                .delete(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        });
    });

    // Test user login
    describe('User login', () => {
        test('should log in a user', async () => {
            await request(app)
                .post('/users/login')
                .send({ username: 'testuser', password: 'password' })
                .expect(200)
        });
    });
})
