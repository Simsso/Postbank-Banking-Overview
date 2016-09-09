var chart = (function(Chart) {
	var balanceChartElement = $('#balance-chart');

	function getChartScaleX() {
		switch (dateRange.getSelectedRangeWidth()) {
			case 'week':
				return 'day';
			case 'month':
				return 'week';
			case 'quarter':
				return 'month';
			case 'year':
				return 'quarter';
			case 'lifetime':
				return 'month';
			case 'custom':
				return 'year';
		}
	}

	function getDataPoints(transactions) {
		transactions = transactions.slice(0); // create a copy for sorting
		var dataPoints = [];
		for (var i = 0; i < transactions.length; i++) {
			var coord = {
				x: transactions[i]['ValueDate'].getTime(),
				y: transactions[i]['Balance']
			}, lastCoord = (dataPoints.length > 0) ? dataPoints[dataPoints.length - 1] : null;

			if (dataPoints.length === 0) {
				dataPoints.push({
					x: coord.x,
					y: transactions[i]['Balance'] - transactions[i]['Amount']
				});
				dataPoints.push(coord);
			}
			else {
				if (lastCoord.x !== coord.x) {
					dataPoints.push({
						x: coord.x,
						y: lastCoord.y
					});
				}
				dataPoints.push(coord);
			}
		}


		// start and end available
		if (dateRange.getDateRange().from !== null && dateRange.getDateRange().till !== null) {
			// add start and end point
			var startDate = dateRange.getDateRange().from.getTime(),
				endDate = dateRange.getDateRange().till.getTime(),
				firstCoord = (dataPoints.length > 0) ? dataPoints[0] : null;
				lastCoord = (dataPoints.length > 0) ? dataPoints[dataPoints.length - 1] : null;

			// end date in the future
			/*if (dateFns.isFuture(endDate)) {
				endDate = dateFns.startOfToday().getTime();
			}*/
			if (firstCoord !== null && firstCoord.x > startDate) {
				dataPoints.unshift({
					x: startDate,
					y: firstCoord.y
				});
			}
			if (lastCoord !== null && lastCoord.x < endDate) {
				dataPoints.push({
					x: endDate,
					y: lastCoord.y
				});
			}
		}

		return dataPoints;
	}

	function showBalanceChart(transactions) {
		var lineChart = new Chart(balanceChartElement, {
		    type: 'line',
		    data: {
		        datasets: [{
		        	lineTension: 0,
		        	fill: false,
		        	pointRadius: 0,
		        	pointHoverRadius: 0,
		            label: 'Balance',
		            borderColor: 'rgb(1,1,102)',
		            borderWidth: 2,
		            data: getDataPoints(transactions)
		        }]
		    },
		    options: {
		    	legend: {
		    		display: false
		    	},
		    	tooltips: {
		    		enabled: false
		    	},
		        scales: {
		            xAxes: [{
		                type: 'time',
		                time: {
		                    unit: getChartScaleX()
		                }
		            }],
		            yAxes: [{
		                type: 'linear',
		                scaleLabel: {
		                	display: true,
		                	labelString: "Balance [€]"
		                }
		            }]
		        }
		    }
		});
	}

	return {
		showBalanceChart: showBalanceChart
	};
})(Chart);