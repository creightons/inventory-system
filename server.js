const express = require('express'),
	mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.DB_HOST);
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const port = process.env.SERVER_PORT;

app.get('/', (req, res) => {
	res.status(200).render('index');
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
});
