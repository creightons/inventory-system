const User = require('./user.js'),
	mongoose = require('mongoose'),
	{ assert } = require('chai'),
	sinon = require('sinon');

require('dotenv').config();

mongoose.Promise = require('bluebird');

let clock;

const time = new Date('2017-01-01');

describe('User Model', function() {
	before(function() {
		mongoose.connect(process.env.TEST_DB_HOST)
		clock = sinon.useFakeTimers(time);
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
		clock.restore();
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
			assert.deepEqual(
				{
					username: args.username,
					password: args.password,
					firstName: args.firstName,
					lastName: args.lastName,
					created: time,
				},
				{
					username: results[0].username,
					password: results[0].password,
					firstName: results[0].firstName,
					lastName: results[0].lastName,
					created: results[0].created,
				}
			);
		});
	});
});