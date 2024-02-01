require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
})

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8)
    }
    next()
  })
  
  // Generate authentication token for the user
  userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
    return token
  }

const User = mongoose.model('User', userSchema)

module.exports = User