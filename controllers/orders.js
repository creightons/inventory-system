const router = require('express').Router(),
	Order = require('../models/order');

router.get('/orders', function(req, res) {
	Order.find({})
		.select('quantity customer product')
		.populate('customer', 'companyName')
		.populate('product', 'name')
		.limit(30)
		.exec()
		.then(orders => {
			return res.status(200).render('orders', { orders });
		})
		.catch(err => {
			console.log('err', err);
			res.status(500).send('bad stuff happened');
		});
});

module.exports = router;