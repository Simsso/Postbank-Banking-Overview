function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

Number.prototype.formatMoney = function(c, d, t) {
	var n = this, 
		c = isNaN(c = Math.abs(c)) ? 2 : c, 
		d = d == undefined ? "," : d, 
		t = t == undefined ? "." : t, 
		s = n < 0 ? "-" : "", 
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// Date object to MySQL date string
// @return MySQL date string (yyyy-mm-dd)
Date.prototype.toMySQLString = function() {
	return pad(this.getFullYear(), 4) + '-' + pad(this.getMonth() + 1, 2) + '-' + pad(this.getDate(), 2); // month is zero based
}