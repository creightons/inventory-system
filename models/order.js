const mongoose = require('mongoose'),
	{ sortByUpdated } = require('./query-helpers'),
	moment = require('moment'),
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

OrderSchema.virtual('lastUpdated').get(function() {
	const updatedTime = moment(this.updatedAt);
	return updatedTime.format('YYYY-MM-DD');
});

OrderSchema.statics.getOrders = function() {
	return this
		.find({})
		.select('quantity customer product')
		.populate('customer', 'companyName')
		.populate('product', 'name');
};

OrderSchema.query.mostRecent = sortByUpdated;

OrderSchema.query.withDate = function() {
	return this.find({}).select('updatedAt');
}

module.exports = mongoose.model('Order', OrderSchema);