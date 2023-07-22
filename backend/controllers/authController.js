const { promisify } = require('util');
const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
	return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '5 days' });
};

const createSendToken = (user, status, res) => {
	// gemerate token and add cookies and send res;
	const token = this.generateToken(user._id);

	let cookieOptions = {
		expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		cookieOptions.secure = true;
	}
	// set token in cookies
	res.cookie('token', token, cookieOptions);

	user.password = undefined;
	res.status(status).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.createNewAccount = CatchAsync(async (req, res, next) => {
	// write logic here

	const { name, email, password, pic } = req.body;
	if (!name || !email || !password) {
		return new AppError('Name, Email and Password are required', 400);
	}

	const user = await User.create({ name, email, password, pic });
	const token = this.generateToken(user._id);
	//res
	createSendToken(user, 201, res);
});

exports.login = CatchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return new AppError('Email and Password are required', 400);
	}

	const user = await User.findOne({ email });
	if (!user) {
		return new AppError('Email doest exits', 400);
	}

	if (!(await user.matchPassword(password, user.password))) {
		return new AppError('Email or Password are incorrect', 400);
	}
	//res
	createSendToken(user, 200, res);
});

exports.protect = CatchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(new AppError('You are not logged in', 401));
	}

	// get decoded ddata (uid) from this function
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	console.log('Here');
	const uid = decoded.id;
	const user = await User.findById(uid);
	if (!user) {
		return next(new AppError('user does not exists, logged in again', 401));
	}
	// check if user changed password
	// if (user.changedPasswordAfter(decoded.iat)) {
	// 	return next(new AppError('password changed, logged in again', 401));
	// }
	req.user = user;
	next();
});
