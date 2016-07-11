(function() {
	const fs = require('fs');
	var util = {};
	module.exports = util;

	util.pad = function(num, size) {
	    var s = num + "";
	    while (s.length < size) s = "0" + s;
	    return s;
	};

	// returns the current time in seconds 
	util.getUnixTimestamp = function() {
		return Date.now() / 1000 | 0;
	};

	// creates a directory synchronously if it doesn't exist yet
	// doesn't work it the path is e.g. "foo/bar" and the directory "foo" doesn't exist
	util.createDirectoryIfItDoesntExist = function(path) {
		var dir = './' + path;

		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
	};

	// returns the file extension of a path or a filename
	// "/bla/xyz.txt" --> "txt"
	// "xyz.pdf" --> "pdf"
	util.path2fileExtension = function(path) {
		return path.split('.').pop();
	};

	// validate email RegExp from SO answer http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
	util.validEmail = function(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	};


	// parse date string function
	// @return Date object
	util.parseDateString = function(input, format) {
		switch (format) {
			case 'dd.mm.yyyy':
				var parts = input.split('.');
				// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
				return new Date(parts[2], parseInt(parts[1]) - 1, parts[0]); // months are 0-based
			case 'dd.mm.yy':
				var parts = input.split('.');
				// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
				return new Date('20' + parts[2], parseInt(parts[1]) - 1, parts[0]); // months are 0-based
			default:
				console.log('Chose default date parser (' + input + ', ' + format + ')');
				return new Date(input);
		}
	};


	// Date object to MySQL date string
	// @return MySQL date string (yyyy-mm-dd)
	util.dateToMySQLString = function(date) {
		if (!date instanceof Date) {
			throw Error("No Date object passed");
		}

		return util.pad(date.getFullYear(), 4) + '-' + util.pad(date.getMonth() + 1, 2) + '-' + util.pad(date.getDate(), 2); // month is zero based
	}
})();