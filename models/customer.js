const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
	companyName: { type: String, unqiue: true, required: true },
	address: { type: String, required: true },
	
}, {
	timestamps: true,
});

module.exports = mongoose.model('Customer', CustomerSchema);