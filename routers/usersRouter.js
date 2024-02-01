const express = require('express')
const router = express.Router()
const userController = require('../controllers/usersController')

// create
router.post('/', userController.create)
// index
router.get('/', userController.index)
// show
router.get('/:id', userController.show)
// update
router.put('/:id', userController.auth, userController.update)
// delete
router.delete('/:id', userController.auth, userController.destroy)

// login 
router.post('/login', userController.loginUser)

module.exports = router