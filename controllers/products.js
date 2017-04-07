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

module.exports = router;