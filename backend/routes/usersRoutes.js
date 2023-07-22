const express = require('express');
const userController = require('./../controllers/userController');
const AuthController = require('../controllers/authController');

const usersRoute = express.Router();
usersRoute.route('/').post(AuthController.createNewAccount).get(AuthController.protect, userController.getUsersBySearch);
usersRoute.route('/login').post(AuthController.login);

module.exports = usersRoute;
