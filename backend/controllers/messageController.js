const CatchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

exports.sendMessage = CatchAsync(async (req, res, next) => {
	const { content, chat } = req.body;
	const sender = req.user._id;
	const query = {
		sender,
		chat,
		content,
	};
	let message = await Message.create(query);
	message = await message.populate('sender', 'name pic');
	message = await message.populate('chat');

	const chatRoom = await Chat.findByIdAndUpdate(chat, {
		lastMessage: message,
	});

	res.status(201).json({
		status: 'success',
		data: {
			data: message,
		},
	});
});

exports.getAllMessages = CatchAsync(async (req, res, next) => {
	// /message/:chatId
	const { chatId } = req.params;
	if (!chatId) {
		return new AppError('Chat ID is required', 400);
	}

	let messages = await Message.find({ chat: chatId }).populate('sender', 'name pic email').sort({ createdAt: -1 });
	// messages = (await messagesfa) - border;
	res.status(200).json({
		status: 'success',
		data: {
			data: messages,
		},
	});
});
