const express = require('express')
const {registerUser, authUser, allUsers} = require('../controllers/userController')
const {authentication} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(authUser)

router.route('/').get(authentication, allUsers)


module.exports = router
