(function() {
	var lastFetched = null;
	api.fetchData(
		function(data) {
			transactionDataProcessing.dateObjects(data);
			lastFetched = transactionDataProcessing.intelligentSwapping(data);
			renderData(lastFetched);
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

		var filteredTransactions = transactionDataProcessing.filterByDateRange(transactions, dateRange.getDateRange()),
			previousTime = transactionDataProcessing.filterByDateRange(transactions, dateRange.getPrevDateRange());

		ui.renderData(filteredTransactions, previousTime);
		chart.showBalanceChart(filteredTransactions, true);
	}

	events.on('selected-date-range-change', function() {
		renderData();
	});
})();