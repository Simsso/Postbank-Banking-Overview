var transactionsApi = function(app, fileParser) {
	app.get('/api/transactions', function(req, res) {
		fileParser.getAllTransactions(function(transactions) {
			for (var i = 0; i < transactions.length; i++) {
				transactions[i].key = i;
			}
			res.status(200).json(transactions);
		});
	});
};

module.exports = transactionsApi;