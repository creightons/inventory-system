const mongoose = require('mongoose'),
	Promise = require('bluebird'),
	User = require('../models/user'),
	Customer = require('../models/customer'),
	Product = require('../models/product'),
	Order = require('../models/order');

if (process.env.NODE_ENV !== 'production') {
	// Apply ENV variables
	require('dotenv').config();
}

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

const newCustomers = [{
	companyName: 'Alpha, Inc',
	address: '123 Northern Avenue',
}, {
	companyName: "Bob's Computer Palace",
	address: "16 Main St.",
}, {
	companyName: 'Laptop Heaven',
	address: '741A Riley Blvd',
}, {
	companyName: 'Smith & Sons',
	address: '34 Copley Ave',
}, {
	companyName: 'Laptop Heaven',
	address: '741A Riley Blvd',
}, {
	companyName: 'Laptop Heaven',
	address: '741A Riley Blvd',
}, {
	companyName: 'Computer Depot',
	address: '13 41st St',
}, {
	companyName: 'Computer Kingdom',
	address: '949 Winter St',
}, {
	companyName: 'Warehouse Blues',
	address: '53 Vue St',
}, {
	companyName: 'Tech World',
	address: '1142 Center St',
}, {
	companyName: 'Malware Defense',
	address: '4 Madison Ave',
}, {
	companyName: 'The Everything Store',
	address: '1991 Huntsman Rd',
}, {
	companyName: 'Tech Savy',
	address: '65 Long St',
}, {
	companyName: 'The Hardware Store',
	address: '742 Chevy Blvd',
}, {
	companyName: 'Super Defenders',
	address: '93 Silicon Rd',
}, {
	companyName: 'Database Experts',
	address: '18 Markey Way',
}, {
	companyName: 'Sublime Computers',
	address: '45 Narwhal St',
}, {
	companyName: 'Data Defenders',
	address: '78 Yawkey Avenue',
}, {
	companyName: 'All The CPUs',
	address: '32B Blue Hill Ave',
}, {
	companyName: 'Computer Domain',
	address: '12 River St',
}, {
	companyName: 'GPU Center',
	address: '59 Cambridge St',
	}, {
	companyName: 'ICG Computer',
	address: '99 Somersette St',
}, {
	companyName: 'The Appliance Store',
	address: '43 Newton Rd',
}, {
	companyName: 'PC Repair',
	address: '4357 Second St',
}, {
	companyName: 'Tech Center',
	address: '3 Haven St',
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

function populateCustomers() {
	return Customer.remove({}).then(() => {
		return Customer.create(newCustomers);
	}).then(() => {
		return console.log('Finished populating Customers...');
	}).catch(
		err => handleErr(err)
	);
}

// Given an array of elements, returns a random element
function getRandom(dataSet) {
	const length = dataSet.length - 1;
	const index = Math.floor(
		Math.random() * length
	);
	return dataSet[index];
};

function populateOrders() {
	return Order.remove({}).then(() => {
		return Promise.join(
			Customer.find({}),
			Product.find({}),
			(customers, products) => {
				const numberOfOrders = 1000;
				const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				const orderPromises = [];
				let currentQuantity,
					currentProduct,
					currentCustomer;

				for (let i = 0; i < numberOfOrders; i++) {
					currentQuantity = getRandom(quantities);
					currentCustomer = getRandom(customers);
					currentProduct = getRandom (products);
					orderPromises.push(
						new Order({
							product: currentProduct._id,
							customer: currentCustomer._id,
							quantity: currentQuantity,
						}).save()
					);
				}

				return Promise.all(orderPromises);
			}
		);
	});
}

// Populate database
Promise.join(
	// Populate Promises For Independent Models
	populateUsers(),
	populateProducts(),
	populateCustomers(),
	// Final Handler
	function() {
		console.log('Finished populating independent models.');
		return Promise.resolve();
	}
).then(
	// Populate Orders, which depend on Customers and Products
	() => populateOrders()
).then(() => {
	console.log('Finished populating orders.');
	console.log('Finished populating database.');
	process.exit();
}).catch(err => {
	console.log('The seed process failed because of an error.');
	console.log('err = ', err);
	process.exit();
});