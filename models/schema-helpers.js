const moment = require('moment');

function getLastUpdated() {
	const updatedTime = moment(this.updatedAt);
	return updatedTime.format('YYYY-MM-DD');
}

module.exports = {
	getLastUpdated,
};