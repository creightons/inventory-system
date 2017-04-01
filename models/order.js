const mongoose = require('mongoose'),
	{ Schema } = mongoose;

const OrderSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'Customer',
		required: true,
	},
	quantity: { 
		type: 'Number',
		required: true,
		min: 1,
	},
}, {
	timestamps: true,
});

module.exports = mongoose.model('Order', OrderSchema);