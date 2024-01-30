const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
                
            // Check if response body includes the username property
            expect(response.body).toHaveProperty('user')
            expect(response.body.user).toHaveProperty('username', 'testuser')
            expect(response.body.user).toHaveProperty('firstName', 'Test')
            expect(response.body.user).toHaveProperty('lastName', 'User')
            expect(response.body).toHaveProperty('token')
            
            // Store the created user ID and token for later tests
            authToken = response.body.token
            createdUserId = response.body.user._id
        })


    // Test getting all users
        test('should get all users', async () => {
            const response = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            // Verify response body structure and content
            expect(Array.isArray(response.body)).toBe(true)
            for(let i = 0; i < response.body.length; i++){
                expect(response.body[i]).toHaveProperty('username')
                expect(response.body[i]).toHaveProperty('password')
                expect(response.body[i]).toHaveProperty('firstName')
                expect(response.body[i]).toHaveProperty('lastName')
            }
        })
    

    // Test getting a specific user by ID
        test('should get a user by ID', async () => {
            await request(app)
                .get(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                
        })
    

    // Test updating a user
        test('should update a user', async () => {
            // Ensure there's a created user before attempting to update
            expect(createdUserId).toBeTruthy()

            const response = await request(app)
                .put(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ username: 'updatedusername' })
                .expect(200)
            
            // Additional checks for updated user data
            expect(response.body.username).toBe('updatedusername')
        })
    

    // Test deleting a user
        test('should delete a user', async () => {
            // Ensure there's a created user before attempting to delete
            expect(createdUserId).toBeTruthy();

            await request(app)
                .delete(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })

    // Test user login
        test('It should login a user', async () => {
            const user = new User({ username: 'testuser', password: 'password', firstName: 'Test', lastName: 'User' })
            await user.save()
        
            const response = await request(app)
              .post('/users/login')
              .send({ username: 'testuser', password: 'password' })
            
            expect(response.statusCode).toBe(200)
            expect(response.body.user.username).toEqual('testuser')
            expect(response.body.user.firstName).toEqual('Test')
            expect(response.body.user.lastName).toEqual('User')
            expect(response.body).toHaveProperty('token')

            // Verify that the stored hashed password matches the provided password
            const isPasswordMatch = await bcrypt.compare('password', response.body.user.password)
            expect(isPasswordMatch).toBe(true)
          })
        })
