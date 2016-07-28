(function() {
	api.fetchData(
		function(data) {
			ui.renderData(data);
			chart.showBalanceChart(data);
		},
		function() {
			console.log("error");
		}
	);
})();