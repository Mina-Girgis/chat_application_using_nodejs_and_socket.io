const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const config = require('./config/databaseConfig');
const mongoose = require('mongoose');

config.connectDataBase();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
	console.log('User Connected : ' + socket.id);

	socket.on('setup', (userData) => {
		socket.join(userData._id);
		socket.emit('connected');
	});

	socket.on('join chat', (roomId) => {
		socket.join(roomId);
	});

	socket.on('new message', (newMessage) => {
		var chat = newMessage.chat;
		if (!chat.users) return console.log('users not definded');

		chat.chat.forEach((user) => {
			if (user._id == newMessage.sender._id) return;
			socket.in(user._id).emit('message recived', newMessage);
		});
	});

	socket.on('typing', (roomId) => {
		socket.in(roomId).emit('typing');
	});

	socket.on('stop typing', (roomId) => {
		socket.in(roomId).emit('stop typing');
	});
});
