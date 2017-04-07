const mongoose = require('mongoose'),
	{ getLastUpdated } = require('./schema-helpers'),
	{ sortByUpdated } = require('./query-helpers');

const CustomerSchema = new mongoose.Schema({
	companyName: { type: String, unqiue: true, required: true },
	address: { type: String, required: true },
	
}, {
	timestamps: true,
});

CustomerSchema.virtual('lastUpdated').get(getLastUpdated);

CustomerSchema.query.mostRecent = sortByUpdated;

module.exports = mongoose.model('Customer', CustomerSchema);