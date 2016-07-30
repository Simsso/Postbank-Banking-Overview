(function() {
	var lastFetched = null;
	api.fetchData(
		function(data) {
			lastFetched = data;
			renderData(data);
		},
		function() {
			console.log("error");
		}
	);

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