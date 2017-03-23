const Customer = require('./customer.js'),
	mongoose = require('mongoose'),
	{ assert } = require('chai'),
	sinon = require('sinon');

require('dotenv').config();

mongoose.Promise = require('bluebird');

describe('Customer Model', function() {
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
});