const passport = require('passport'),
	express = require('express');

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
			successRedirect: '/main',
			failureRedirect: '/',
		}
	)
);

router.post('/logout', (req, res) => {
	req.logout();
	res.status(200).redirect('/');
});

router.get('/main', isAuthenticated, (req, res) => {
	res.status(200).render('main');
});

module.exports = router;