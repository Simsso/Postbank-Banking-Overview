var ui = (function(jQuery) {
	var tableTransactions = jQuery('#transactions-table'),
		tableBodyTransactions = tableTransactions.find('tbody');

	function renderData(data) {
		var tableBodyHtml = '';

		for (var i = 0; i < data.length; i++) {
			var transaction = data[i];
			tableBodyHtml += '<tr>' + 
				'<td>' + transaction['DateOfBookkeepingEntry'] + '</td>' +
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