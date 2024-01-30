const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// authorize
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, 'secret')
    const user = await User.findOne({ _id: data._id })
    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).send('Not authorized')
  }
}
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
    try{
        const updates = Object.keys(req.body)
        const user = await User.findOne({ _id: req.params.id })
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.json(user)
      }catch(error){
        res.status(400).json({message: error.message})
      }
}

// delete 
const destroy = async (req, res) => {
    const id = req.params.id
    try {
        const deletedUser = await User.findOneAndDelete({ _id: id })
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.json(deletedUser)
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
};


// login
const loginUser = async (req, res) => {
    try{
        const user = await User.findOne({ username: req.body.username })
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
          res.status(400).send('Invalid login credentials')
        } else {
          const token = await user.generateAuthToken()
          res.json({ user, token })
        }
      } catch(error){
        res.status(400).json({message: error.message})
      }
};
module.exports = { create, index, show, update, destroy, loginUser }