const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//create
const create = async (req, res) => {
    const { username, password, firstName, lastName } = req.body
  const newUser = new User({ username, password, firstName, lastName })

  try {
    const savedUser = await newUser.save();
    const token = await savedUser.generateAuthToken()
    res.status(200).json({ user: savedUser, token })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// index
const index = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// show
const show = async (req, res) => {
    const id = req.params._id

    try {
        const user = await User.findOne(id)
        if(!user) {
            res.status(404).send('User not found')
        }
        res.json(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

//update
const update = async (req, res) => {
    try {
        // Verify JWT token to authenticate the user
        const token = req.header('Authorization').replace('Bearer ', '')
        const secretKey = process.env.JWT_SECRET || 'fallbackSecretKey';
        const data = jwt.verify(token, secretKey)

        const user = await User.findOne({ _id: req.params._id})
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
            // Check if the user ID from the token matches the user being updated
        if (user._id.toString() !== data._id) {
            return res.status(400).json({ message: 'Unauthorized action'})
            const updates = Object.keys(req.body)
            const allowed = ['username', 'password', 'firstName', 'lastName']
            const isValidAction = updates.every( update => allowed.includes(update))
        }
            if (!isValidAction) {
                return res.status(400).json({ message: 'Invalid updates' })
            }
            update.forEach(update => (user[update] = req.body[update]))
            await user.save()
            res.json(user)
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// delete 
const destroy = async (req, res) => {
    const id = req.params._id
    try {
        const deletedUser = await User.findOneAndDelete({_id: id })
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' })
        }
        res.json(deletedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid username or password' })
        }
        const token = await user.generateAuthToken()
        res.json({ user, token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
module.exports = { create, index, show, update, destroy, loginUser }