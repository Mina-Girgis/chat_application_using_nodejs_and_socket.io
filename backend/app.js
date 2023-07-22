const express = require('express');
const app = express();
const userRoutes = require('./routes/usersRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const ErrorController = require('./controllers/errorController');
const AppError = require('./utils/appError');
app.use(express.json());
app.use(express.static('public'));

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.all('*', () => {
	return new AppError('Route not found !!', 404);
});

//global error handler
app.use(ErrorController.globalErrorController);
module.exports = app;
