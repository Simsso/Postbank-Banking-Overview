var fileParser = (function() {
	const fs = require('fs');
	const windows1252 = require('windows-1252');
	const path = require('path');
	const Transaction = require('./transaction');

	// creates a directory synchronously if it doesn't exist yet
	// doesn't work it the path is e.g. "foo/bar" and the directory "foo" doesn't exist
	function createDirectoryIfItDoesntExist(path) {
		var dir = './' + path;

		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
	}

	const newFilesPath = 'add';
	const headerLine = '"Buchungstag";"Wertstellung";"Umsatzart";"Buchungsdetails";"Auftraggeber";"Empfänger";"Betrag (€)";"Saldo (€)"';

	function init() {
		createDirectoryIfItDoesntExist(newFilesPath);
	}

	// @para callback string[] file names
	function getFileNames(callback) {
		fs.readdir(newFilesPath, callback);
	}

	function getFileLines(callback) {

	}

	function getTransactions(path, callback) {
		fs.readFile(path, function(err, data) { // open file with ASCII encoding to make it readable for the windows1252 module
			if (err) {
				console.log(err);
				callback([]);
				return;
			}

			data = data.toString('binary');
			var text = windows1252.decode(data); // read Western (Windows 1252) encoded file
			var lines = text.split(/\r?\n/);
			var headerFound = false, transactions = [];
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				if (line === headerLine) {
					headerFound = true;
					continue;
				}
				if (headerFound) {
					var newTransaction = new Transaction();
					var parseErr = newTransaction.parseString(line)
					if (parseErr) {
						console.log(parseErr)
						continue;
					}
					transactions.push(newTransaction);
				}
			}
			callback(transactions);
		});
	}

	function getAllTransactions(callback) {
		var transactions = [], processedFilesCount = 0;
		getFileNames(function(err, files) {
			for (var i = 0; i < files.length; i++) {
				getTransactions(path.join(newFilesPath, files[i]), function(transactionsFromFile) {
					Array.prototype.push.apply(transactions, transactionsFromFile);
					if (++processedFilesCount == files.length) {
						callback(transactions);
					}
				});
			}
		});
	}

	init();


	// api
	return {
		getAllTransactions: getAllTransactions
	};
})();

module.exports = fileParser;