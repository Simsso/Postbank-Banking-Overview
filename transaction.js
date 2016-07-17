const util = require('./util');

function convertDate(string) {
	return util.dateToMySQLString(util.parseDateString(string, 'dd.mm.yyyy'));
}

var Transaction = function(obj) {
	if (obj) {
		for (attr in obj) {
			if (Transaction.prototype[attr] === null) {
				this[attr] = obj[attr];
			}
		}
	}

};

Transaction.parseAmount = function(amount) {
	amount = amount.replace('¤ ', ''); // remove strange symbol from string
	amount = amount.replace('.', ''); // remove dot which marks thousands (e.g. "1.235,00€")
	amount = amount.replace(',', '.'); // replace comma with dot for parsing
	return parseFloat(amount); // convert into a number
}

Transaction.prototype['DateOfBookkeepingEntry'] = null;
Transaction.prototype['ValueDate'] = null;
Transaction.prototype['ExchangeType'] = null;
Transaction.prototype['Details'] = null;
Transaction.prototype['Applicant'] = null;
Transaction.prototype['Recipient'] = null;
Transaction.prototype['Amount'] = null;
Transaction.prototype['Balance'] = null;

Transaction.prototype.parseString = function(string) {
	var parts = string.substring(1, string.length - 2).split('";"');
	if (parts.length !== 8) {
		return new Error("Invalid string passed");
	}

	this['DateOfBookkeepingEntry'] = convertDate(parts[0]);
	this['ValueDate'] = convertDate(parts[1]);
	this['ExchangeType'] = parts[2];
	this['Details'] = parts[3];
	this['Applicant'] = parts[4];
	this['Recipient'] = parts[5];
	this['Amount'] = Transaction.parseAmount(parts[6]);
	this['Balance'] = Transaction.parseAmount(parts[7]);
}

Transaction.prototype.equals = function(transaction) {
	for (attr in transaction) {
		if (this[attr] !== transaction[attr]) {
			return false;
		}
	}
	return true;
}

module.exports = Transaction;