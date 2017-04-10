const router = require('express').Router(),
	Product = require('../models/product'),
	getPaginatedTableContext = require('../lib/paginated-table-context');

function mapProductRow(product) {
	return [
		product.name,
		'$' + product.price,
		product.vendor,
		product.productId,
	];
}

router.get('/products', (req, res) => {
	const query = Product
		.find({})
		.select('name price vendor productId');

	const pageNumber = parseInt(req.query.pageNumber) || 1;

	getPaginatedTableContext({
		pageNumber,
		query,
		routeUrl: 'products',
		columnTitles: [ 'Name', 'Price', 'Vendor', 'Product Id' ],
		rowMappingFunction: mapProductRow,
	}).then(tableContext => {
		res.status(200).render('products', { tableData: tableContext });
	}).catch(err => {
		console.log('error = ', err);
		res.status(500).send('error occurred');
	});
});

router.get('/products/add', (req, res) => {
	res.status(200).render('products-add');
});

const missingNameError = new Error('The product must have a name.');
const missingPriceError = new Error('The product must have a price.');
const missingVendorError = new Error('The product must have a vendor.');
const missingDescriptionError = new Error('The product must have a description.');
const missingProductIdError = new Error('The product must have an ID number.');
const existingProductError = new Error('The product already exists.');

router.post('/products/add', (req, res) => {
	const { name, price, vendor, productId, description } = req.body;

	if (!name) { return respondWithError({ res, status: 400, err: missingNameError }); }
	if (!price) { return respondWithError({ res, status: 400, err: missingPriceError }); }
	if (!vendor) { return respondWithError({ res, status: 400, err: missingVendorError }); }
	if (!productId) { return respondWithError({ res, status: 400, err: missingProductIdError }); }
	if (!description) { return respondWithError({ res, status: 400, err: missingDescriptionError }); }

	Product
		.findOne({ name })
		.then(product => {
			if(product) { throw existingProductError; }

			const newProduct = Product({ name, price, vendor, productId, description });
			return newProduct.save();
		})
		.then(() => {
			res.status(200).redirect('/products');
		})
		.catch(existingProductError, err => {
			respondWithError({ res, status: 400, err });
		})
		.catch(
			err => respondWithError({ res, err })
		);
});

function respondWithError({ res, status, err }) {
	const responseStatus = status || 500;
	console.log(err);
	res.status(responseStatus).render('products-add', {
		error: err.message,
	});
}

module.exports = router;