const mongoose = require('mongoose');

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

module.exports = mongoose.model('Product', ProductSchema);
