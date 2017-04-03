const router = require('express').Router(),
	Customer = require('../models/customer'),
	getPaginatedTableContext = require('../lib/paginated-table-context');

function mapCustomerRow(customer){
	return [
		customer.companyName,
		customer.address,
	];
}

router.get('/customers', (req, res) => {
	const query = Customer
		.find({})
		.select('companyName address');

	const pageNumber = parseInt(req.query.pageNumber) || 1;

	getPaginatedTableContext({
		pageNumber,
		query,
		routeUrl: 'customers',
		columnTitles: [ 'Name', 'Address' ],
		rowMappingFunction: mapCustomerRow,
	}).then(tableContext => {
		res.status(200).render('customers', { table: tableContext });
	}).catch(err => {
		console.log('error = ', err);
		res.status(500).send('error occurred');
	});
});

module.exports = router;