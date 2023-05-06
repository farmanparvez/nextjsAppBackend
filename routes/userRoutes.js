const express = require('express');
const userRouters = express.Router();
const userController = require('../controllers/userController')
const protect = require('../middleware/protect');

userRouters.route('/user').get(protect, userController.user)

module.exports = userRouters;