(function() {
	var lastFetched = null;
	api.fetchData(
		function(data) {
			for (var i = 0; i < data.length; i++) {
				console.log("date saved");
				data[i]['ValueDate'] = new Date(data[i]['ValueDate']);
				data[i]['DateOfBookkeepingEntry'] = new Date(data[i]['DateOfBookkeepingEntry']);
			}
			console.log(data);
			lastFetched = intelligentSwaping(data);
			renderData(lastFetched);
		},
		function() {
			console.log("error");
		}
	);

	// This function swaps transactions of the same date. That might be necessary because some banks don't order them in a way that is correct. Consider the following example:
	// index | date       | amount | balance
	// 17    | 20-07-2016 | 500    | 500
	// 18    | 22-07-2016 | 100    | 610
	// 19    | 22-07-2016 | 10     | 510
	//
	// In that example rows 18 and 19 need to be swapped. The fact that the transaction amounts are rounded to cents makes it a little bit more complicated because the balance of index 18 might be e.g. 610.01 because of rounding. Therefore the algorithm searches for the closest balance that fits the transactions.
	function intelligentSwaping(data) {
		data = data.sort(function(a, b) {
			return a['ValueDate'] - b['ValueDate'];
		});
		// data needs to be sorted descending by ['ValueDate']
		for (var ptr = 1; ptr < data.length; ptr++) {
			if (data[ptr - 1]['Amount'] === -34.99) {
				console.log("here we are");
			}
			var sameDate = getSameDateElements(data, ptr), 
				difference = [];

			for (var i = 0; i < sameDate.length; i++) {
				difference.push(transactionPreceds(data[ptr - 1], sameDate[i]));
			}

			var min = difference.indexOfClosestToZero();
			if (min + ptr !== ptr) {
				data.swap(min + ptr, ptr);
				console.log("swap performed");
			}
		}
		return data;
	}

	// helper function for intelligentSwaping
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

	// helper function for intelligentSwaping
	function transactionPreceds(a, b) {
		return a['Balance'] - (b['Balance'] - b['Amount']); // difference (ideal but not always given: 0)
	}

	function renderData(transactions) {
		if (!transactions) {
			transactions = lastFetched;
		}

		if (!transactions) {
			return;
		}

		var filteredTransactions = filterByDateRange(transactions, dateRange.getDateRange());

		ui.renderData(filteredTransactions);
		chart.showBalanceChart(filteredTransactions, true);
	}

	function filterByDateRange(transactions, dateRange) {
		// lifetime
		if (dateRange.from === null || dateRange.till === null) {
			return transactions;
		}

		var inRange = [];
		for (var i = 0; i < transactions.length; i++) {
			if (dateFns.isWithinRange(new Date(transactions[i]['ValueDate']), dateRange.from, dateRange.till)) {
				inRange.push(transactions[i]);
			}
		}
		return inRange;
	}

	events.on('selected-date-range-change', function() {
		renderData();
	});
})();