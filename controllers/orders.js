const router = require('express').Router(),
	Order = require('../models/order'),
	{ paginationLimit } = require('../constants');

router.get('/orders', function(req, res) {
	const pageNumber = parseInt(req.query.pageNumber) || 1;

	const skipCount = (pageNumber - 1) * paginationLimit;

	// Grab an extra document (1 more than limit) to check whether there are 
	// any more documents to grab after this page of results
	const limitCount = paginationLimit + 1;

	Order.find({})
		.select('quantity customer product')
		.populate('customer', 'companyName')
		.populate('product', 'name')
		.skip(skipCount)
		.limit(limitCount)
		.exec()
		.then(orders => {
			let nextButtonUrl,
				previousButtonUrl;
			
			const nextButtonEnabled = orders.length === limitCount;
			const previousButtonEnabled = pageNumber !== 1;

			if (nextButtonEnabled) {
				const nextPage = pageNumber + 1;
				nextButtonUrl = `/orders?pageNumber=${nextPage}`;
			}

			if (previousButtonEnabled) {
				const prevPage = pageNumber - 1;
				previousButtonUrl = `/orders?pageNumber=${prevPage}`;
			}

			const columnTitles = [ 'Product', 'Quantity', 'Customer' ];
			const rows = orders.map(order => {
				return [
					order.product.name,
					order.quantity,
					order.customer.companyName,
				];
			});


			return res.status(200).render('orders', {
				nextButtonEnabled,
				previousButtonEnabled,
				nextButtonUrl,
				previousButtonUrl,
				columnTitles,
				rows,
			});
		})
		.catch(err => {
			console.log('err', err);
			res.status(500).send('bad stuff happened');
		});
});

module.exports = router;