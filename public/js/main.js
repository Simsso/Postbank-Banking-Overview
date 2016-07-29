(function() {
	api.fetchData(
		function(data) {
			ui.renderData(data);
			chart.showBalanceChart(data, true);
		},
		function() {
			console.log("error");
		}
	);
})();