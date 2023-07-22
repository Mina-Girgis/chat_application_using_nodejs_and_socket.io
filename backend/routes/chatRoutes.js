const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

const chatRoutes = express.Router();

chatRoutes.route('/').post(authController.protect, chatController.accessChat);
chatRoutes.route('/').get(authController.protect, chatController.fetchChats);
chatRoutes.route('/group').post(authController.protect, chatController.createGroupChat);
chatRoutes.route('/rename').put(authController.protect, chatController.renameGroupName);
chatRoutes.route('/groupadd').put(authController.protect, chatController.addToGroup);
chatRoutes.route('/groupremove').put(authController.protect, chatController.removeFromGroup);
module.exports = chatRoutes;
