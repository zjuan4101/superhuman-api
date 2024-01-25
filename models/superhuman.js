const mongoose = require('mongoose')

const superhumanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    alias: { type: String, required: true },
    power: { type: String, required: true },
    weakness: { type: String, required: true },
    isHero: { type: Boolean, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const Superhuman = mongoose.model('Superhuman', superhumanSchema)

module.exports = Superhuman