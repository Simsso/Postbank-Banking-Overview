var transactionDataProcessing = (function() {

	// Intelligent swapping

	// This function swaps transactions of the same date. That might be necessary because some banks don't order them in a way that is correct. Consider the following example:
	// index | date       | amount | balance
	// 17    | 20-07-2016 | 500    | 500
	// 18    | 22-07-2016 | 100    | 610
	// 19    | 22-07-2016 | 10     | 510
	//
	// In that example rows 18 and 19 need to be swapped. The fact that the transaction amounts are rounded to cents makes it a little bit more complicated because the balance of index 18 might be e.g. 610.01 because of rounding. Therefore the algorithm searches for the closest balance that fits the transactions.
	function intelligentSwapping(data) {
		data = data.sort(function(a, b) {
			return a['ValueDate'] - b['ValueDate'];
		});
		// data needs to be sorted descending by ['ValueDate']
		for (var ptr = 1; ptr < data.length; ptr++) {
			var sameDate = getSameDateElements(data, ptr), 
				difference = [];

			for (var i = 0; i < sameDate.length; i++) {
				difference.push(transactionPreceds(data[ptr - 1], sameDate[i]));
			}

			var min = difference.indexOfClosestToZero();
			if (min + ptr !== ptr) {
				data.swap(min + ptr, ptr);
				console.log("swap performed (difference " + difference[min].toFixed(5) + ")");
			}
		}
		return data;
	}

	// helper function for intelligentSwapping
	function getSameDateElements(data, ptr) {
		var sameDate = [];
		var date = data[ptr]['ValueDate'];
		for (var i = ptr; i < data.length; i++) {
			if (data[i]['ValueDate'].getTime() === date.getTime()) {
				sameDate.push(data[i]);
			}
		}
		return sameDate;
	}

	// helper function for intelligentSwapping
	function transactionPreceds(a, b) {
		return a['Balance'] - (b['Balance'] - b['Amount']); // difference (ideal but not always given: 0)
	}



	// Filter by date range

	// filters all transactions within the date range
	function filterByDateRange(transactions, dateRange) {
		// lifetime
		if (dateRange.from === null || dateRange.till === null) {
			return transactions;
		}

		var inRange = [];
		for (var i = 0; i < transactions.length; i++) {
			if (dateFns.isWithinRange(transactions[i]['ValueDate'], dateRange.from, dateRange.till)) {
				inRange.push(transactions[i]);
			}
		}
		return inRange;
	}



	// Date objects

	// replaces JSON date object strings with actual Date objects
	function dateObjects(data) {
		for (var i = 0; i < data.length; i++) {
			data[i]['ValueDate'] = mySQLDateToNonTimezonDate(data[i]['ValueDate']);
			data[i]['DateOfBookkeepingEntry'] = mySQLDateToNonTimezonDate(data[i]['DateOfBookkeepingEntry']);
		}
	}

	// dateObjects helper function
	function mySQLDateToNonTimezonDate(string) {
		var parts = string.split('-');
		if (parts.length !== 3) {
			throw new Error("Invalid string passed. Format yyyy-mm-dd required");
		}
		return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1,  parseInt(parts[2]), 0, 0);
	}



	return {
		intelligentSwapping: intelligentSwapping,
		filterByDateRange: filterByDateRange,
		dateObjects: dateObjects
	};
})();