const CatchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const authController = require('./authController');

exports.getUsersBySearch = CatchAsync(async (req, res, next) => {
	let { search } = req.query;
	if (!search) {
		search = '';
	}
	const uid = req.user._id;
	const users = await User.find({
		name: { $regex: search, $options: 'i' },
		_id: { $ne: uid },
	});

	res.status(200).json({
		status: 'success',
		data: {
			data: users,
		},
	});
});
