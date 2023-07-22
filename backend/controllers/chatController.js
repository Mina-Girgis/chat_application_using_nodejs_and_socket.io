const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

exports.accessChat = CatchAsync(async (req, res, next) => {
	// if chat between two users exists return it
	// else create it;
	const { userId } = req.body;
	if (!userId) {
		return new AppError('userId is required', 400);
	}

	let isChat = await Chat.find({
		isGroupChat: false,
		$and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
	});

	// res.send(isChat);
	if (isChat.length > 0) {
		res.status(200).json({
			status: 'success',
			data: { data: isChat[0] },
		});
	} else {
		// create
		const chatData = {
			chatName: '',
			isGroupChat: false,
			users: [userId, req.user._id],
		};

		const createChat = await Chat.create(chatData);
		const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', '-password');
		res.status(200).json({
			status: 'success',
			data: { data: fullChat },
		});
	}
});

exports.fetchChats = CatchAsync(async (req, res, next) => {
	// get all chats
	const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).sort({ updatedAt: -1 });

	res.status(200).json({
		status: 'success',
		data: { data: chats },
	});
});

exports.createGroupChat = CatchAsync(async (req, res, next) => {
	// it takse array of users and name of the group
	const { name, users } = req.body;
	console.log(users);
	if (!name || !users) {
		return new AppError('Name of the group and users are required', 400);
	}
	if (users.length < 2) {
		return new AppError('group users must be greater than 1', 400);
	}
	users.push(req.user);
	const chatData = {
		chatName: name,
		users,
		isGroupChat: true,
		groupAdmin: req.user,
	};
	const chat = await Chat.create(chatData);
	const chatGroup = await Chat.find({ _id: chat._id });

	res.status(201).json({
		status: 'success',
		data: {
			data: chatGroup,
		},
	});
});

exports.renameGroupName = CatchAsync(async (req, res, next) => {
	const { chatId, chatName } = req.body;
	const chat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true });
	if (!chat) {
		return new AppError('Chat does not exist', 400);
	}
	res.status(203).json({
		status: 'success',
		data: {
			data: chat,
		},
	});
});

exports.addToGroup = CatchAsync(async (req, res, next) => {
	const { chatId, users } = req.body;

	const chat = await Chat.findByIdAndUpdate(chatId, { $addToSet: { users: { $each: users } } }, { new: true });

	res.status(203).json({
		status: 'success',
		data: {
			data: chat,
		},
	});
});

exports.removeFromGroup = CatchAsync(async (req, res, next) => {
	const { chatId, userId } = req.body;

	const chat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true });

	res.status(203).json({
		status: 'success',
		data: {
			data: chat,
		},
	});
});
