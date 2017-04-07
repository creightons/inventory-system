const mongoose = require('mongoose'),
	{ getLastUpdated } = require('./schema-helpers'),
	{ sortByUpdated } = require('./query-helpers');

const ProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	productId: { type: Number, required: true, unique: true },
	price: { type: Number, required: true },
	vendor: String,
},
{
	timestamps: true,
});

ProductSchema.virtual('lastUpdated').get(getLastUpdated);

ProductSchema.query.mostRecent = sortByUpdated;

module.exports = mongoose.model('Product', ProductSchema);
