const router = require('express').Router(),
	Product = require('../models/product'),
	{ paginationLimit } = require('../constants');

router.get('/products', function(req, res) {
	const pageNumber = parseInt(req.query.pageNumber) || 1;

	const skipCount = (pageNumber - 1) * paginationLimit;

	// Grab an extra document (1 more than limit) to check whether there are 
	// any more documents to grab after this page of results
	const limitCount = paginationLimit + 1;

	Product
		.find({})
		.select('name price vendor productId')
		.skip(skipCount)
		.limit(limitCount)
		.exec()
		.then(products => {

			let nextButtonUrl,
				previousButtonUrl;
			
			const nextButtonEnabled = products.length === limitCount;
			const previousButtonEnabled = pageNumber !== 1;

			if (nextButtonEnabled) {
				const nextPage = pageNumber + 1;
				nextButtonUrl = `/products?pageNumber=${nextPage}`;
			}

			if (previousButtonEnabled) {
				const prevPage = pageNumber - 1;
				previousButtonUrl = `/products?pageNumber=${prevPage}`;
			}

			const columnTitles = [ 'Name', 'Price', 'Vendor', 'Product Id' ];

			const rows = products.map(product => {
				return [
					product.name,
					'$' + product.price,
					product.vendor,
					product.productId,
				];
			});

			return res.status(200).render('products', {
				table: {
					nextButtonEnabled,
					previousButtonEnabled,
					nextButtonUrl,
					previousButtonUrl,
					columnTitles,
					rows,
				},
			});
		});
});

module.exports = router;