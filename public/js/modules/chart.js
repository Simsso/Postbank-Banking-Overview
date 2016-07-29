var chart = (function(Chart) {
	var balanceChartElement = $('#balance-chart');

	function getDataPoints(transactions, addEndPoint) {
		transactions = transactions.slice(0); // create a copy for sorting
		transactions.sort(function(a, b) {
			if ((new Date(a['DateOfBookkeepingEntry'])).getTime() < (new Date(b['DateOfBookkeepingEntry'])).getTime()) {
				return -1;
			}
			return 1;
		});
		var dataPoints = [];
		for (var i = 0; i < transactions.length; i++) {
			var coord = {
				x: (new Date(transactions[i]['DateOfBookkeepingEntry'])).getTime(),
				y: transactions[i]['Balance']
			}, lastCoord = (dataPoints.length > 0) ? dataPoints[dataPoints.length - 1] : null;

			if (dataPoints.length === 0) {
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

		// add end point
		var startOfToday = dateFns.startOfToday().getTime(),
			lastCoord = (dataPoints.length > 0) ? dataPoints[dataPoints.length - 1] : null;
		if (addEndPoint && lastCoord !== null && lastCoord.x < startOfToday) {
			dataPoints.push({
				x: startOfToday,
				y: lastCoord.y
			});
		}
		return dataPoints;
	}

	function showBalanceChart(transactions, addEndPoint) {
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
		            data: getDataPoints(transactions, addEndPoint)
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
		                    unit: 'month'
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