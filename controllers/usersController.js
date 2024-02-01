const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Authentication middleware
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: data._id })
    if (!user) {
      throw new Error('User not found')
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).send('Not authorized')
  }
}

// Create a new user
exports.create = async (req, res) => {
  try{
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(200).json({ user, token })
  } catch(error){
    res.status(400).json({message: error.message})
  }
}

// Get all users
exports.index = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

// Get a user by ID
exports.show = async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findOne({ _id: id })
    if (!user) {
      res.status(404).send('User not found')
    }
    res.json(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

// Update a user
exports.update = async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const user = await User.findOne({ _id: req.params.id })
    updates.forEach(update => user[update] = req.body[update])
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a user
exports.destroy = async (req, res) => {
  try{
    await req.user.deleteOne()
    res.json({ message: 'User deleted' })
  }catch(error){
    res.status(400).json({message: error.message})
  }
}

// Login user
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: 'Invalid login credentials' })
    } else{
      const token = await user.generateAuthToken()
    res.json({ user, token })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
