var dataBase = (function() {
	const fs = require('fs');
	const path = require('path');
	const Transaction = require('./transaction');

	const dataBasePath = 'data';
	const dataBaseTransactionsFile = 'transactions.json';

	function saveTransactions(transactions, removeDuplicates, callback) {
		loadTransactions(function(savedTransactions) {
			for (var i = 0; i < savedTransactions.length; i++) {
				var equalTransactionSaved = false;
				for (var j = 0; j < transactions.length; j++) {
					if (savedTransactions[i].equals(transactions[j])) {
						equalTransactionSaved = true;
					}
				}
				if (equalTransactionSaved) {
					savedTransactions.splice(i, 1);
					i--;
				}
				else {
					console.log("New transaction added");
				}
			}
			Array.prototype.push.apply(transactions, savedTransactions);
			fs.writeFile(path.join(dataBasePath, dataBaseTransactionsFile), JSON.stringify(transactions), function(err) {
				callback(err, transactions);
			});
		});
	}

	function loadTransactions(callback) {
		fs.readFile(path.join(dataBasePath, dataBaseTransactionsFile), 'utf-8', function(err, content) {
			if (err) {
				return [];
			}
			var arr = JSON.parse(content), transactions = [];
			for (var i = 0; i < arr.length; i++) {
				transactions.push(new Transaction(arr[i]));
			}
			callback(transactions);
		});
	}
	return {
		saveTransactions: saveTransactions,
		loadTransactions: loadTransactions
	};
})();

module.exports = dataBase;