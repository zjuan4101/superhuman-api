const express = require('express')
const app = express()
const usersRouter = require('./routers/usersRouter')
const superhumansRouter = require('./routers/superhumansRouter')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/users', usersRouter)
app.use('/superhumans', superhumansRouter)
module.exports = app
