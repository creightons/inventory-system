const { paginationLimit }  = require('../constants'),
	Promise = require('bluebird');

function getPaginatedTableContext({
	pageNumber,
	query,
	routeUrl,
	columnTitles,
	rowMappingFunction,
}) {

	const skipCount = (pageNumber - 1) * paginationLimit;

	// Grab an extra document (1 more than limit) to check whether there are 
	// any more documents to grab after this page of results
	const limitCount = paginationLimit + 1;

	return query
		.skip(skipCount)
		.limit(limitCount)
		.exec()
		.then(results => {
			let nextButtonUrl,
			previousButtonUrl;
		
			const nextButtonEnabled = results.length === limitCount;
			const previousButtonEnabled = pageNumber !== 1;

			if (nextButtonEnabled) {
				const nextPage = pageNumber + 1;
				nextButtonUrl = `/${routeUrl}?pageNumber=${nextPage}`;
			}

			if (previousButtonEnabled) {
				const prevPage = pageNumber - 1;
				previousButtonUrl = `/${routeUrl}?pageNumber=${prevPage}`;
			}

			const rows = results
				// Exclude the extra item used for checking for another page
				.slice(0, paginationLimit)
				.map(result => rowMappingFunction(result));			

			const tableContext = {
				hasNavigation: true,
				nextButtonEnabled,
				previousButtonEnabled,
				nextButtonUrl,
				previousButtonUrl,
				columnTitles,
				rows,
			};

			return Promise.resolve(tableContext);
		});
}

module.exports = getPaginatedTableContext;