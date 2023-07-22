const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
	{
		chatName: {
			type: String,
			trim: true,
			// required: [true, 'chat name is required'],
		},
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message',
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

chatSchema.pre(/^find/, function (next) {
	console.log('hello from chat query middleware <3');
	this.populate('users', '-password')
		.populate('groupAdmin', '-password')
		.populate({
			path: 'lastMessage',
			populate: {
				path: 'sender',
				select: 'name email pic',
			},
		});
	next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
