const router = require('express').Router(),
	User = require('../models/user');

router.get('/profile', (req, res) => {
	const query = User
		.findOne({ _id: req.user._id })
		.select('username firstName lastName')
		.then(user => {
			res.status(200).render('profile', {
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
			});
		}).catch(err => {
			console.log('error = ', err);
			res.status(500).send('error occurred');
		});
});

router.get('/products/add', (req, res) => {
	res.status(200).render('products-add');
});

function respondWithError({ res, status, err }) {
	const responseStatus = status || 500;
	console.log(err);
	res.status(responseStatus).render('profile', {
		error: err.message,
	});
}

module.exports = router;