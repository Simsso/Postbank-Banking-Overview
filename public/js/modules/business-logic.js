var businessLogic = (function() {
	function getKeyNumbers(data) {
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

		return {
			balance: balance,
			volume: volume,
			surplus: surplus
		};

	}

	return {
		getKeyNumbers: getKeyNumbers
	};
})();