const router = require('express').Router(),
	Order = require('../models/order');

router.get('/dashboard', function dashboard(req, res) {
	Order
		.getOrders()
		.mostRecent()
		.withDate()
		.limit(5)
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

			return res.status(200).render('dashboard', { table: tableContext, products: [] });
		})
		.catch(err => console.log(err));
});

module.exports = router;