var dataBase = (function() {
	const fs = require('fs');
	const path = require('path');
	const Transaction = require('./transaction');

	const dataBasePath = 'data';
	const dataBaseTransactionsFile = 'transactions.json';

	function saveTransactions(transactions, removeDuplicates, callback) {
		loadTransactions(function(savedTransactions) {
			Array.prototype.push.apply(transactions, savedTransactions);
			for (var i = 0; i < transactions.length; i++) {
				var a = transactions[i];
				for (var j = i + 1; j < transactions.length; j++) {
					var b = transactions[j];
					if (a.equals(b)) {
						transactions.splice(j, 1);
						j--;
					}
				}
			}
			fs.writeFile(path.join(dataBasePath, dataBaseTransactionsFile), JSON.stringify(transactions), function(err) {
				callback(err, transactions);
			});
		});
	}

	function loadTransactions(callback) {
		fs.readFile(path.join(dataBasePath, dataBaseTransactionsFile), 'utf-8', function(err, content) {
			if (err) {
				callback([]);
			}
			try {
				var arr = JSON.parse(content), transactions = [];
				for (var i = 0; i < arr.length; i++) {
					transactions.push(new Transaction(arr[i]));
				}
				callback(transactions);
			}
			catch (e) {
				console.log(e);
				callback([]);
			}
		});
	}
	return {
		saveTransactions: saveTransactions,
		loadTransactions: loadTransactions
	};
})();

module.exports = dataBase;