var ui = (function(jQuery) {
	var tableTransactions = jQuery('#transactions-table'),
		tableBodyTransactions = tableTransactions.find('tbody');

	var divBalanceValue = jQuery('#key-number-balance'),
		divTransactionVolumeValue = jQuery('#key-number-volume'),
		divSurplusValue = jQuery('#key-number-surplus');

	var spanSelectedDateRange = jQuery('.selected-date-range'),
		prevDateRange = jQuery('#prev-date-range'),
		nextDateRange = jQuery('#next-date-range');

	function renderData(data) {
		renderKeyNumbers(data);
		renderTable(data);
	}

	function renderKeyNumbers(data) {
		// balance
		var balance = 0;
		if (data.length > 0) {
			balance = data[data.length - 1]['Balance'];
		}

		// transaction volume and surplus
		var volume = 0, surplus = 0;
		for (var i = 0; i < data.length; i++) {
			volume += Math.abs(data[i]['Amount']);
			surplus += data[i]['Amount'];
		}

		divBalanceValue.html(balance.formatMoney() + ' &euro;');
		divTransactionVolumeValue.html(volume.formatMoney() + ' &euro;');
		divSurplusValue.html(surplus.formatMoney() + ' &euro;');
	}

	function renderTable(data) {
		var tableBodyHtml = '';

		for (var i = 0; i < data.length; i++) {
			var transaction = data[i];
			tableBodyHtml += '<tr data-toggle="collapse" data-target="#main-table-row-expand-' + i + '" class="accordion-toggle">' + 
				'<td>' + dateFns.format(transaction['ValueDate'], 'DD. MMM YYYY') + '</td>' +
				'<td>' + transaction['ExchangeType'] + '</td>' +
				'<td>' + transaction['Applicant'] + '</td>' +
				'<td>' + transaction['Recipient'] + '</td>' +
				'<td>' + transaction['Amount'].formatMoney() + '</td>' +
				'<td>' + transaction['Balance'].formatMoney() + '</td>' +
				'</tr>' + 
				'<tr>'  + 
    			'<td colspan="6" class="hidden-row">' + 
        		'<div class="accordion-body collapse" id="main-table-row-expand-' + i + '">' + 
        		'<div class="hidden-content"><span class="details">Details</span>' + transaction['Details'] + '</div>' + 
        		'</div>' + 
    			'</td>' + 
				'</tr>';
		}

		tableBodyTransactions.html(tableBodyHtml);
	}

	function updateDateRange(newDateRange) {
		// start and end available
		var text = '';
		if (dateRange.getDateRange().from !== null && dateRange.getDateRange().till !== null) {
			switch (dateRange.getSelectedRangeWidth()) {
				case 'month':
					text = dateFns.format(newDateRange.from, 'MMM YYYY');
					break;
				case 'quarter':
					text = dateFns.format(newDateRange.from, 'Qo YYYY')
					break;
				case 'year':
					text = dateFns.format(newDateRange.from, 'YYYY');
					break;
				default: 
					text = dateFns.format(newDateRange.from, 'DD. MMM YYYY') + ' - ' + dateFns.format(newDateRange.till, 'DD. MMM YYYY');
			}
			spanSelectedDateRange.html(text);
		}
		else {
			spanSelectedDateRange.html('');
		}
	}

	prevDateRange.on('click', dateRange.prevDateRange);
	nextDateRange.on('click', dateRange.nextDateRange);


	events.on('selected-date-range-change', updateDateRange);


	return {
		renderData: renderData
	};
})(jQuery);