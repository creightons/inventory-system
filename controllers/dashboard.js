const router = require('express').Router(),
	Order = require('../models/order'),
	Product = require('../models/product'),
	Customer = require('../models/customer'),
	Promise = require('bluebird');

router.get('/dashboard', function dashboard(req, res) {
		Promise.join(
			getMostRecentOrdersContext(),
			getMostRecentPrductsContext(),
			getMostRecentCustomersContext(),
			function(
				orderTableData,
				productTableData,
				customerTableData
			) {
				return res.status(200).render('dashboard', {
					orderTable: orderTableData,
					productTable: productTableData,
					customerTable: customerTableData,
				});
			}
		)
		.catch(err => console.log(err));
});

const MOST_RECENT_LIST_SIZE = 5;

function getMostRecentOrdersContext() {
	return Order
		.getOrders()
		.mostRecent()
		.withDate()
		.limit(MOST_RECENT_LIST_SIZE)
		.then(orderData => {
			var orders = orderData.map(data => {
				return [
					data.product.name,
					data.quantity,
					data.customer.companyName,
					data.lastUpdated,
				];
			});

			const tableContext = {
				columnTitles: [
					'Product',
					'Quantity',
					'Customer',
					'Last Updated',
				],
				rows: orders,
			};

			return tableContext;
		});
}

function getMostRecentPrductsContext() {
	return Product
		.find({})
		.select('name price vendor productId updatedAt')
		.mostRecent()
		.limit(MOST_RECENT_LIST_SIZE)
		.then(productData => {
			var products = productData.map(data => {
				return [
					data.name,
					data.productId,
					data.vendor,
					data.price,
					data.lastUpdated,
				];
			});

			const tableContext = {
				columnTitles: [
					'Product',
					'Id',
					'Vendor',
					'Price',
					'Last Updated',
				],
				rows: products,
			};

			return tableContext;
		});
}

function getMostRecentCustomersContext() {
	return Customer
		.find({})
		.mostRecent()
		.limit(MOST_RECENT_LIST_SIZE)
		.then(customerData => {
			var customers = customerData.map(data => {
				return [
					data.companyName,
					data.address,
					data.lastUpdated,
				];
			});

			const tableContext = {
				columnTitles: [ 'Name', 'Address', 'Last Updated' ],
				rows: customers,
			};

			return tableContext;
		});
}

module.exports = router;