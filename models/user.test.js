const User = require('./user.js'),
	mongoose = require('mongoose'),
	{ assert } = require('chai');

require('dotenv').config();

mongoose.Promise = require('bluebird');

describe('User Model', function() {
	before(function() {
		mongoose.connect(process.env.TEST_DB_HOST)
	});

	beforeEach(function(done) {
		User.remove({}).then(() => {
			return done();
		}).catch(err => {
			return done(err);
		});
	});

	after(function() {
		mongoose.connection.close();
	});

	it('should create a new instance without issue', function() {
		const args = {
			username: 'superuser',
			password: 'superhuman',
			firstName: 'Clark',
			lastName: 'Kent',
		};

		const NewUser = User(args);

		assert.deepEqual(args, {
			username: NewUser.username,
			password: NewUser.password,
			firstName: NewUser.firstName,
			lastName: NewUser.lastName,
		});
	});

	it('should save without error', function() {
		const args = {
			username: 'superuser',
			password: 'superhuman',
			firstName: 'Clark',
			lastName: 'Kent',
		};

		const newUser = User(args);
		return newUser.save().then(() => {
			return User.find({});
		}).then(results => {
			const user = results[0];

			assert.deepEqual(
				{
					username: args.username,
					password: args.password,
					firstName: args.firstName,
					lastName: args.lastName,
				},
				{
					username: user.username,
					password: user.password,
					firstName: user.firstName,
					lastName: user.lastName,
				}
			);

			assert.strictEqual(user.createdAt instanceof Date, true);
			assert.strictEqual(user.updatedAt instanceof Date, true);
		});
	});
});