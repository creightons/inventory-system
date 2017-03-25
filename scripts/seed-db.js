const mongoose = require('mongoose'),
	Promise = require('bluebird'),
	dotenv = require('dotenv'),
	User = require('../models/user'),
	Product = require('../models/product');

// Apply ENV variables
dotenv.config();

mongoose.connect(process.env.DB_HOST);
console.log(process.env.DB_HOST);

function handleErr(err) { console.log('Error encountered:', err.stack); }

const newUsers = [{
	username: 'admin',
	password: 'adminPass',
	firstName: 'Mike',
	lastName: 'Marston',
}];

const newProducts = [{
	name: 'Zendesk',
	description: 'A high-brand laptop for the power user',
	productId: 1,
	price: 734.99,
	vendor: 'Asus',
}, {
	name: 'VivoBook',
	description: 'A medium level brand laptop for the average consumer',
	productId: 2,
	price: 399.99,
	vendor: 'Asus',
}, {
	name: 'Macbook Pro',
	description: 'The best-selling, definitive product from Apple',
	productId: 3,
	price: 1500.00,
	vendor: 'Apple',
}, {
	name: 'Macbook Air',
	description: 'A sleek, lightweight laptop for the customer on the go',
	productId: 4,
	price: 799.99,
	vendor: 'Apple',
}, {
	name: 'Surface Pro',
	description: 'The distinct power tablet from Microsoft',
	productId: 5,
	price: 1299.99,
	vendor: 'Microsoft',
}, {
	name: 'Inspiron 15',
	description: 'A reliable laptop designed for engineers',
	productId: 6,
	price: 449.99,
	vendor: 'Dell',
}, {
	name: 'XPS 13',
	description: 'Middle-of-the-pack 2-in-1 screen laptop',
	productId: 7,
	price: 799.99,
	vendor: 'Dell',
}, {
	name: 'Alienware 17',
	description: 'The go-to laptop for any serious gamer',
	productId: 8,
	price: 449.99,
	vendor: 'Dell',
}, {
	name: 'HP Chromebook 14 G4',
	description: 'A laptop from HP featuring the ChromeOS from Google',
	productId: 9,
	price: 279.99,
	vendor: 'HP',
}, {
	name: 'ThinkPad 460s',
	description: 'A lightweight, durable business laptop with a focus on productivity',
	productId: 10,
	price: 989.10,
	vendor: 'Lenovo',
}];

// Populate Database
function populateUsers() {
	return User.remove({}).then(() => {
		return User.create(newUsers);
	}).then(() => {
		return console.log('Finished populating Users...');
	}).catch(
		err => handleErr(err)
	);
}

function populateProducts() {
	return Product.remove({}).then(() => {
		return Product.create(newProducts);
	}).then(() => {
		return console.log('Finished populating Products...');
	}).catch(
		err => handleErr(err)
	);
}

Promise.join(
	// Populate Promises
	populateUsers(),
	populateProducts(),
	// Final Handler
	function() {
		console.log('Finished populating database.');
		process.exit();
	}
).catch(err => {
	console.log('The seed process failed because of an error.');
	process.exit();
});