const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const server = app.listen(8080, () => console.log('Testing on Port 8080'))
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    await mongoose.connection.close()// shut off mongoose connection with mongodb
    mongoServer.stop()
    server.close()
})

describe('User API endpoints', () => {
    

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
            expect(response.body.user.username).toEqual('testuser')
            expect(response.body.user.firstName).toEqual('Test')
            expect(response.body.user.lastName).toEqual('User')
            expect(response.body).toHaveProperty('token')
        })


    // Test getting all users
        test('should get all users', async () => {
            const response = await request(app)
                .get('/users')
            
            expect(response.statusCode).toBe(200)
            // Verify response body structure and content
            expect(Array.isArray(response.body)).toBe(true)
            for(let i = 0; i < response.body.length; i++){
                expect(response.body[i]).toHaveProperty('username')
                expect(response.body[i]).toHaveProperty('password')
                expect(response.body[i]).toHaveProperty('firstName')
                expect(response.body[i]).toHaveProperty('lastName')
            }
        })
    

    // Test showing user
        test('should get a user by ID to show', async () => {
            const user = new User({ username: 'testuser2', password: 'password', firstName: 'Test', lastName: 'User' })
            await user.save()
            const response = await request(app)
                .get(`/users/${user._id}`)
            
            expect(response.statusCode).toBe(200)
            expect(response.body.username).toEqual('testuser2')
            expect(response.body.firstName).toEqual('Test')
            expect(response.body.lastName).toEqual('User')    
        })
    

    // Test updating a user
        test('should update a user', async () => {
            const user = new User({ username: 'testuser3', password: 'password', firstName: 'Test', lastName: 'User' })
            await user.save()
            const token = await user.generateAuthToken()

            const response = await request(app)
                .put(`/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'updatedusername' })
            
            
            expect(response.statusCode).toBe(200)
            expect(response.body.username).toEqual('updatedusername')
        })
    

    // Test deleting a user
        test('should delete a user', async () => {
            const user = new User({ username: 'testuser4', password: 'password', firstName: 'Test', lastName: 'User' })
            await user.save()
            const token = await user.generateAuthToken()

            const response = await request(app)
                .delete(`/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`)
                
                expect(response.statusCode).toBe(200)
        })

    // Test user login
        test('It should login a user', async () => {
            const user = new User({ username: 'testuser5', password: 'password', firstName: 'Test', lastName: 'User' })
            await user.save()
        
            const response = await request(app)
              .post('/users/login')
              .send({ username: 'testuser5', password: 'password' })
            
            expect(response.statusCode).toBe(200)
            expect(response.body.user.username).toEqual('testuser5')
            expect(response.body.user.firstName).toEqual('Test')
            expect(response.body.user.lastName).toEqual('User')
            expect(response.body).toHaveProperty('token')

            // Verify that the stored hashed password matches the provided password
            const isPasswordMatch = await bcrypt.compare('password', response.body.user.password)
            expect(isPasswordMatch).toBe(true)
          })
        })