const passport = require('passport'),
	express = require('express'),
	dashboardController = require('./controllers/dashboard'),
	productsController = require('./controllers/products'),
	customersController = require('./controllers/customers'),
	ordersController = require('./controllers/orders');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).render('index');
});

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	return res.status(401).redirect('/');
}

router.post(
	'/login',
	passport.authenticate(
		'local',
		{
			successRedirect: '/dashboard',
			failureRedirect: '/',
		}
	)
);

router.post('/logout', (req, res) => {
	req.logout();
	res.status(200).redirect('/');
});

router.use(isAuthenticated);
router.use(dashboardController);
router.use(productsController);
router.use(customersController);
router.use(ordersController);

module.exports = router;