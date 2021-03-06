const router = require('express').Router(),
	Order = require('../models/order'),
	getPaginatedTableContext = require('../lib/paginated-table-context');

function mapOrderRow(order){
	return [
		order.product.name,
		order.quantity,
		order.customer.companyName,
	];
}

router.get('/orders', (req, res) => {
	const query = Order.getOrders();

	const pageNumber = parseInt(req.query.pageNumber) || 1;

	getPaginatedTableContext({
		pageNumber,
		query,
		routeUrl: 'orders',
		columnTitles: [ 'Product', 'Quantity', 'Customer' ],
		rowMappingFunction: mapOrderRow,
	}).then(tableContext => {
		res.status(200).render('orders', { tableData: tableContext });
	}).catch(err => {
		console.log('error = ', err);
		res.status(500).send('error occurred');
	});
});

module.exports = router;