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

	beforeEach(function(done) {
		Customer.remove({}).then(
			() => done()
		).catch(
			err => done(err)
		);
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

	it('should save without error', function(done) {
		const companyName = 'Test Co, Inc',
			address = '123 Business Blvd.';

		const newCustomer = Customer({
			companyName,
			address,
		});

		newCustomer.save().then(() => {
			return Customer.find({});
		}).then(results => {
			const customer = results[0];
			
			assert.deepEqual(
				{
					companyName,
					address,
				},
				{
					companyName: customer.companyName,
					address: customer.address,
				}
			);

			assert.deepEqual(customer.createdAt instanceof Date, true);
			assert.deepEqual(customer.updatedAt instanceof Date, true);

			done();
		}).catch(
			err => done(err)
		);
	});
});