const express = require('express'),
	Promise = require('bluebird'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	connectRedis = require('connect-redis'),
	passport = require('passport'),
	router = require('./router'),
	startPassport = require('./passport.config');

if (process.env.NODE_ENV !== 'production') {
	// Apply ENV variables
	require('dotenv').config();
}

// Setup and Promisify mongoose
mongoose.Promise = Promise;
mongoose.connect(process.env.DB_HOST);

// Instantiate App
const app = express();

// Use morgan for simple logging
app.use(morgan('dev'));

// Parse FORM data messages
app.use( bodyParser.urlencoded({ extended: false }) );

// Parse JSON data
app.use(bodyParser.json());

// Parse cookies from message
app.use(cookieParser())

// Setup session store
const RedisStore = connectRedis(session);
app.use(
	session({
		store: new RedisStore({
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
		}),
		secret: process.env.REDIS_SECRET,
		saveUninitialized: false,
		resave: false,
	})
);

// Apply passport configurations
startPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Apply template engine
app.set('view engine', 'pug');

// Set view directory	
app.set('views', 'views');

// Declare static directory
app.use('/dist', express.static('dist'));

// Attach routes
app.use(router);

// Print Uncaught Errors
app.use((err, req, res, next) => {
	console.log("Server Error", err);
	next();
});

// Start server
const port = process.env.SERVER_PORT;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
});
