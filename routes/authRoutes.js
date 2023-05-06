const express = require('express')
const authRouter = express.Router()
const authController = require('../controllers/authController')

authRouter.route('/signup').post(authController.signUp)
authRouter.route('/signin').post(authController.signIn)
authRouter.route('/accessToken').get(authController.generateRefreshToken)


module.exports = authRouter