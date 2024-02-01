const Superhuman = require('../models/superhuman')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Create
exports.create = async (req, res) => {
    const { name, alias, power, weakness, isHero, userId } = req.body

    try {
        const newSuperhuman = new Superhuman({ name, alias, power, weakness, isHero, userId })
        const savedSuperhuman = await newSuperhuman.save()
        res.status(200).json(savedSuperhuman)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Index
exports.index = async (req, res) => {
    try {
        const superhumans = await Superhuman.find()
        res.json(superhumans)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Show
exports.show = async (req, res) => {
    const id = req.params.id
    try {
        const superhuman = await Superhuman.findOne({ _id: id })
        if (!superhuman) {
            res.status(404).json({ message: 'Superhuman not found' })
            return
        }

        res.json(superhuman)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Update
exports.update = async (req, res) => {
    const id = req.params.id
    const updates = req.body

    try {
        const updatedSuperhuman = await Superhuman.findOneAndUpdate({ _id: id }, updates, { new: true })
        if (!updatedSuperhuman) {
            res.status(404).json({ message: 'Superhuman not found' })
            return
        }

        res.json(updatedSuperhuman)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// Delete
exports.destroy = async (req, res) => {
    const id = req.params.id

    try {
        const deletedSuperhuman = await Superhuman.findOneAndDelete({ _id: id })
        if (!deletedSuperhuman) {
            res.status(404).json({ message: 'Superhuman not found' })
            return
        }

        res.status(200).json({msg: 'Superhuman deleted successfully'})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};
