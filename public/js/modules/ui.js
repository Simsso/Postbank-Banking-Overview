var ui = (function(jQuery) {
	var tableTransactions = jQuery('#transactions-table'),
		tableBodyTransactions = tableTransactions.find('tbody');

	var divBalanceValue = jQuery('#key-number-balance .value'),
		divTransactionVolumeValue = jQuery('#key-number-volume .value'),
		divSurplusValue = jQuery('#key-number-surplus .value'),
		divBalanceValueDevelopment = jQuery('#key-number-balance .development'),
		divTransactionVolumeValueDevelopment = jQuery('#key-number-volume .development'),
		divSurplusValueDevelopment = jQuery('#key-number-surplus .development');

	var spanSelectedDateRange = jQuery('.selected-date-range'),
		prevDateRange = jQuery('#prev-date-range'),
		nextDateRange = jQuery('#next-date-range');

	function renderData(data, previous) {
		renderKeyNumbers(data, previous);
		renderTable(data);
	}

	function renderKeyNumbers(data, previous) {
		var keyNumbers = businessLogic.getKeyNumbers(data);

		if (previous.length > 0) {
			var prevKeyNumbers = businessLogic.getKeyNumbers(previous);
			renderKeyNumberDevelopment(keyNumbers, prevKeyNumbers);
		}
		else {
			resetKeyNumberDevelopment();
		}

		divBalanceValue.html(keyNumbers.balance.formatMoney() + ' &euro;');
		divTransactionVolumeValue.html(keyNumbers.volume.formatMoney() + ' &euro;');
		divSurplusValue.html(keyNumbers.surplus.formatMoney() + ' &euro;');
	}

	function renderKeyNumberDevelopment(now, prev) {
		renderSingleKeyNumberDevelopmentField(divBalanceValueDevelopment, now.balance, prev.balance);
		renderSingleKeyNumberDevelopmentField(divTransactionVolumeValueDevelopment, now.volume, prev.volume);
		renderSingleKeyNumberDevelopmentField(divSurplusValueDevelopment, now.surplus, prev.surplus);
	}

	function renderSingleKeyNumberDevelopmentField(element, now, prev) {
		element.removeClass('red').removeClass('green').addClass(((now - prev) >= 0) ? 'green' : 'red');
		element.html((now - prev).formatMoney(undefined, undefined, undefined, true) + ' &euro;');
	}

	function resetKeyNumberDevelopment() {
		divBalanceValueDevelopment.html('').removeClass('red').removeClass('green');
		divTransactionVolumeValueDevelopment.html('').removeClass('red').removeClass('green');
		divSurplusValueDevelopment.html('').removeClass('red').removeClass('green');
	}

	function renderTable(data) {
		data = data.reverse();
		var tableBodyHtml = '';

		for (var i = 0; i < data.length; i++) {
			var transaction = data[i], previous = (i > 0) ? data[i - 1] : null;
			var sameDayAsPreviousTransaction = (i > 0 && dateFns.differenceInDays(transaction['ValueDate'], previous['ValueDate']) === 0);
			tableBodyHtml += '<tr data-toggle="collapse" data-target="#main-table-row-expand-' + i + '" ' +
						'class="accordion-toggle' + (sameDayAsPreviousTransaction ? ' light-border' : '') + '">' + 
					'<td class="tnum">' + dateFns.format(transaction['ValueDate'], 'DD. MMM YYYY') + '</td>' +
					'<td>' + transaction['ExchangeType'] + '</td>' +
					'<td>' + transaction['Applicant'] + '</td>' +
					'<td>' + transaction['Recipient'] + '</td>' +
					'<td class="tnum text-right' +  ((transaction['Amount'] < 0) ? ' red' : '') + '">' + transaction['Amount'].formatMoney() + '</td>' +
					'<td class="tnum text-right">' + transaction['Balance'].formatMoney() + '</td>' +
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
				case '4-months':
					text = dateFns.format(newDateRange.from, 'MMM ' + 
						((dateFns.getYear(newDateRange.from) === dateFns.getYear(newDateRange.till)) ? // start and end same year
							'' : 
							'YYYY')) + 
						' - ' + 
						dateFns.format(newDateRange.till, 'MMM YYYY');
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