const router = require('express').Router(),
	Product = require('../models/product');

router.get('/products', function(req, res) {
	Product.find({}).select('name price vendor productId').then(products => {
		return res.status(200).render('products', {
			products,
		});
	});
});

module.exports = router;