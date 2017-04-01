const Order  = require('./order'),
	Customer = require('./customer'),
	Product = require('./product'),
	mongoose = require('mongoose'),
	{ assert } = require('chai');

describe('Order Model', function() {
	it('should initialize the model properly', function() {
		const customer = new Customer({
			companyName: 'Test Customer',
			address: '123 ABC St',
		});

		const product = new Product({
			name: 'Sample Product',
			description: 'The best something or other in the world',
			productId: 25,
			price: 234.29,
			vendor: 'Vendor Guy',
		});

		const quantity = 5;

		const order = new Order({
			product: product._id,
			customer: customer._id,
			quantity,
		});

		assert.deepEqual(
			{
				productId: order.product,
				customerId: order.customer,
				quantity: order.quantity,
			},
			{
				productId: product._id,
				customerId: customer._id,
				quantity,
			}
		);
	});
});