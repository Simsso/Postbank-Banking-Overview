var ui = (function(jQuery) {
	var tableTransactions = jQuery('#transactions-table'),
		tableBodyTransactions = tableTransactions.find('tbody');

	var divBalanceValue = jQuery('#key-number-balance'),
		divTransactionVolumeValue = jQuery('#key-number-volume'),
		divSurplusValue = jQuery('#key-number-surplus');

	function renderData(data) {
		renderKeyNumbers(data);
		renderTable(data);
	}

	function renderKeyNumbers(data) {
		// balance
		var balance = 0;
		if (data.length > 0) {
			balance = data[0]['Balance'];
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
			tableBodyHtml += '<tr>' + 
				'<td>' + dateFns.format((new Date(transaction['DateOfBookkeepingEntry'])), 'DD. MMM YYYY') + '</td>' +
				'<td>' + transaction['ExchangeType'] + '</td>' +
				'<td>' + transaction['Applicant'] + '</td>' +
				'<td>' + transaction['Recipient'] + '</td>' +
				'<td>' + transaction['Amount'].formatMoney() + '</td>' +
				'<td>' + transaction['Balance'].formatMoney() + '</td>' +
				'</tr>';
		}

		tableBodyTransactions.html(tableBodyHtml);
	}
	return {
		renderData: renderData
	};
})(jQuery);