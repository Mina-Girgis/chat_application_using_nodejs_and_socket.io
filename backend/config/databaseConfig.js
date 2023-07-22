const mongoose = require('mongoose');

exports.connectDataBase = () => {
	const dp = process.env.DATABASE;
	mongoose
		.connect(dp, { useNewUrlParser: true })
		.then(() => {
			console.log('Database connection established');
		})
		.catch((err) => {
			console.log(err);
		});
};
