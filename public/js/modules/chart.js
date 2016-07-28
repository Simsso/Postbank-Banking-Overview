var chart = (function(Chart) {
	var balanceChartElement = $('#balance-chart');

	function showBalanceChart(transactions) {
		var dataPoints = [];
		for (var i = 0; i < transactions.length; i++) {
			var coord = {
				x: (new Date(transactions[i]['DateOfBookkeepingEntry'])).getTime(),
				y: transactions[i]['Balance']
			};
			if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1].x === coord.x) {
				dataPoints[dataPoints.length - 1] = coord;
			}
			else {
				dataPoints.push(coord);
			}
		}
		var lineChart = new Chart(balanceChartElement, {
		    type: 'line',
		    data: {
		        datasets: [{
		        	lineTension: 0,
		        	fill: false,
		        	pointRadius: 0,
		            label: 'Balance',
		            borderColor: 'rgb(1,1,102)',
		            data: dataPoints
		        }]
		    },
		    options: {
		    	legend: {
		    		display: false
		    	},
		        scales: {
		            xAxes: [{
		                type: 'linear',
		                position: 'bottom'
		            }]
		        }
		    }
		});
	}
	return {
		showBalanceChart: showBalanceChart
	};
})(Chart);