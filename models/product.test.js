const Product = require('./product.js'),
	mongoose = require('mongoose'),
	{ assert } = require('chai');

require('dotenv').config();

mongoose.Promise = require('bluebird');

describe('Product Model', function() {
	before(function() {
		mongoose.connect(process.env.TEST_DB_HOST)
	});

	beforeEach(function(done) {
		Product.remove({}).then(() => {
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
			name: 'Laptop A',
			description: 'A new laptop with lots of power',
			productId: 1,
			price: 599,
			vendor: 'Asus'
		};

		const newProduct = Product(args);

		assert.deepEqual(args, {
			name: newProduct.name,
			description: newProduct.description,
			productId: newProduct.productId,
			price: newProduct.price,
			vendor: newProduct.vendor,
		});
	});

	it('should save without error', function() {
		const args = {
			name: 'Laptop A',
			description: 'A new laptop with lots of power',
			productId: 1,
			price: 599,
			vendor: 'Asus'
		};

		const newProduct = Product(args);

		return newProduct.save().then(() => {
			return Product.find({});
		}).then( ( [ product ] ) => {
			assert.deepEqual(args, {
				name: product.name,
				description: product.description,
				productId: product.productId,
				price: product.price,
				vendor: product.vendor,
			});

			assert.strictEqual(product.createdAt instanceof Date, true);
			assert.strictEqual(product.updatedAt instanceof Date, true);
		});
	});
});