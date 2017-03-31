const router = require('express').Router();

router.get('/customers', function dashboard(req, res) {
		return res.status(200).render('customers');
});

module.exports = router;