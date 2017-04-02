const router = require('express').Router(),
	Customer = require('../models/customer'),
	{ paginationLimit } = require('../constants');

router.get('/customers', function(req, res) {
	const pageNumber = parseInt(req.query.pageNumber) || 1;

	const skipCount = (pageNumber - 1) * paginationLimit;

	// Grab an extra document (1 more than limit) to check whether there are 
	// any more documents to grab after this page of results
	const limitCount = paginationLimit + 1;

	Customer
		.find({})
		.select('companyName address')
		.skip(skipCount)
		.limit(limitCount)
		.exec()
		.then(customers => {
			let nextButtonUrl,
				previousButtonUrl;
			
			const nextButtonEnabled = customers.length === limitCount;
			const previousButtonEnabled = pageNumber !== 1;

			if (nextButtonEnabled) {
				const nextPage = pageNumber + 1;
				nextButtonUrl = `/customers?pageNumber=${nextPage}`;
			}

			if (previousButtonEnabled) {
				const prevPage = pageNumber - 1;
				previousButtonUrl = `/customers?pageNumber=${prevPage}`;
			}

			const columnTitles = [ 'Name', 'Address' ];

			const rows = customers.map(customer => {
				return [
					customer.companyName,
					customer.address
				];
			});

			return res.status(200).render('customers', {
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