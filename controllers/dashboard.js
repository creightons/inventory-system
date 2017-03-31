const router = require('express').Router(),
	Product = require('../models/product');

router.get('/dashboard', function dashboard(req, res) {
	Product.find({}).select('name price vendor productId').then(products => {
		return res.status(200).render('dashboard', {
			products,
		});
	});
});

module.exports = router;