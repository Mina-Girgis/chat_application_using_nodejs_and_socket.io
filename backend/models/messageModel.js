const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			trim: true,
			required: true,
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Chat',
			required: true,
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
