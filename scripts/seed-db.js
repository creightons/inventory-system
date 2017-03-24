const mongoose = require('mongoose'),
	Promise = require('bluebird'),
	dotenv = require('dotenv'),
	User = require('../models/user');

// Apply ENV variables
dotenv.config();

mongoose.connect(process.env.DB_HOST);
console.log(process.env.DB_HOST);

const newUsers = [{
	username: 'admin',
	password: 'adminPass',
	firstName: 'Mike',
	lastName: 'Marston',
}];

// Populate Database
function populateUsers() {
	return User.remove({}).then(() => {
		return User.create(newUsers);
	}).then(() => {
		console.log('Finished populating Users...');
	}).catch(err => {
		console.log("Error encountered: ", err);
	});
}

Promise.join(
	// Populate Promises
	populateUsers(),
	// Final Handler
	function() {
		console.log('Finished populating database.');
		process.exit();
	}
).catch(err => {
	console.log('The seed process failed because of an error.');
	process.exit();
});