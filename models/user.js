const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },

	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	created: { type: Date },
});


UserSchema.pre('save', function(next) {
	this.created = Date.now();
	console.log('date = ', this.date);
	next();
});

module.exports = mongoose.model('User', UserSchema);