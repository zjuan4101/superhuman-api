const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const app = require('../app')
const Superhuman = require('../models/superhuman')

let mongoServer
let authToken
let createdSuperhumanId

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })


    // Create a user and obtain an auth token
    const userResponse = await request(app)
        .post('/users')
        .send({
            username: 'testuser',
            password: 'password',
            firstName: 'Test',
            lastName: 'User'
        })

    authToken = userResponse.body.token
})

afterAll(async () => {
    // Disconnect from the test database and stop the MongoDB memory server
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('Superhuman Controller Tests', () => {
    // Test create function
    test('should create a new superhuman', async () => {
        const response = await request(app)
            .post('/superhumans')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Superman',
                alias: 'Clark Kent',
                power: 'Flight',
                weakness: 'Kryptonite',
                isHero: true,
            })
            .expect(200)
        
        // Save the created superhuman ID for later tests
        createdSuperhumanId = response.body._id;

        // Assertions
        expect(response.body.name).toEqual('Superman')
        expect(response.body.alias).toEqual('Clark Kent')
        expect(response.body.power).toEqual('Flight')
        expect(response.body.weakness).toEqual('Kryptonite')
        expect(response.body.isHero).toBeTruthy()
    })

    // Test index function
    test('should get all superhumans', async () => {
        const response = await request(app)
            .get('/superhumans')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)

        // Assertions
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

    // Test show function
    test('should get a superhuman by ID', async () => {
        const response = await request(app)
            .get(`/superhumans/${createdSuperhumanId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)

        // Assertions
        expect(response.body._id).toBe(createdSuperhumanId)
        expect(response.body.name).toEqual('Superman')
        expect(response.body.alias).toEqual('Clark Kent')
        expect(response.body.power).toEqual('Flight')
        expect(response.body.weakness).toEqual('Kryptonite')
        expect(response.body.isHero).toBeTruthy()
        expect(response.body._id).toBe(createdSuperhumanId)
    })

    // Test update function
    test('should update a superhuman', async () => {
        const response = await request(app)
            .put(`/superhumans/${createdSuperhumanId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: 'Superwoman' })
            .expect(200)

        // Assertions
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toBe('Superwoman')
    })

    // Test destroy function
    test('should delete a superhuman', async () => {
        const response = await request(app)
            .delete(`/superhumans/${createdSuperhumanId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)

        // Assertions
        expect(response.body.msg).toEqual('Superhuman deleted successfully')
    })
})
