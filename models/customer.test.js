const Customer = require('./customer.js'),
	mongoose = require('mongoose'),
	{ assert } = require('chai'),
	sinon = require('sinon');

require('dotenv').config();

mongoose.Promise = require('bluebird');

describe('Customer Model', function() {
	before(function() {
		mongoose.connect(process.env.TEST_DB_HOST);
	});

	beforeEach(function() {

	});

	after(function() {
		mongoose.connection.close();
	});

	it('should create a model properly', function() {
		const companyName = 'Test Co, Inc',
			address = '123 Business Blvd.';

		const newCustomer = Customer({
			companyName,
			address,
		 });

		assert.strictEqual(newCustomer.companyName, companyName);
		assert.strictEqual(newCustomer.address, address);
	});

	it('should save without error', function() {
		const companyName = 'Test Co, Inc',
			address = '123 Business Blvd.';

		const newCompany = Customer({
			companyName,
			address,
		});

		newCompany.save().then(() => {
			return Company.find({});
		}).then(results => {
			assert.deepEqual(
				{
					companyName,
					address,
				},
				{
					companyName: results[0].companyName,
					address: results[0].address,
				}
			);
		});
	});
});