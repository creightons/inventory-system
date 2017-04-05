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

router.get('/customers/add', (req, res) => {
	res.status(200).render('customers-add');
});

const existingCustomerError = new Error('The customer already exists.');
const missingNameError = new Error('The customer must have a name.');
const missingAddressError = new Error('The customer must have an address.');

router.post('/customers/add', (req, res) => {
	const {	companyName, address } = req.body;

	if (!companyName) {
		return respondWithError({ res, status: 400, err: missingNameError });
	}
	
	if (!address) {
		return respondWithError({ res, status: 400, err: missingAddressError });
	}

	Customer
		.findOne({ companyName })
		.then(customer => {
			if (customer) { throw existingCustomerError; }

			const newCustomer = Customer({ companyName, address });
			return newCustomer.save();
		})
		.then(() => {
			res.status(200).redirect('/customers');
		})
		.catch(existingCustomerError, err => {
			respondWithError({ res, status: 400, err });
		})
		.catch( err => respondWithError({ res, err }) );
});

function respondWithError({ res, status, err }) {
	const responseStatus = status || 500;
	res.status(responseStatus).render('customers-add', {
		error: err.message,
	});
}

module.exports = router;