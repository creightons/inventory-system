const router = require('express').Router(),
	Customer = require('../models/customer');

router.get('/customers', function(req, res) {
	Customer.find({}).select('companyName address').then(customers => {
		return res.status(200).render('customers', { customers });
	});
});

module.exports = router;