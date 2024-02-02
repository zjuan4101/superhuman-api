const express = require('express')
const router = express.Router()
const superhumanController = require('../controllers/superhumansController')
const userController = require('../controllers/usersController')
// create
router.post('/', userController.auth, superhumanController.create)
// index
router.get('/', superhumanController.index)
// show
router.get('/:id', superhumanController.show)
// update
router.put('/:id', superhumanController.update)
// delete
router.delete('/:id', superhumanController.destroy)

module.exports = router