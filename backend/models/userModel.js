const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, 'name is required'],
			trim: true,
		},
		email: {
			type: String,
			require: [true, 'email is required'],
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			require: [true, 'password is required'],
		},
		pic: {
			type: String,
			require: [true, 'photo is required'],
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.matchPassword = async function (input, password) {
	return await bcrypt.compare(input, password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
