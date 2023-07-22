const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

const messageRoutes = express.Router();
messageRoutes.route('/').post(authController.protect, messageController.sendMessage);
messageRoutes.route('/:chatId').get(authController.protect, messageController.getAllMessages);
module.exports = messageRoutes;
