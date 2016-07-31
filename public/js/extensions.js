// repeats a given string n times
String.prototype.repeat = function(n) {
  if (n === 0)
    return '';
  n = n || 1;
  return Array(n + 1).join(this);
};


// returns true if the array contains the passed object
Array.prototype.contains = function(obj) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};

// removes the first occurence of the given object in an array
Array.prototype.remove = function(obj) {
  var index = this.indexOf(obj);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};

// removes all occurences of the given object in an array
Array.prototype.removeAll = function(obj) {
  for(var i = 0; i < this.length; i++) {
    if (this[i] === obj) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

// randomizes array element order in-place
Array.prototype.shuffle = function() {
  var swapIndex;
  for (var i = 0; i < this.length; i++) {
    swapIndex = Math.floor(Math.random() * this.length);
    this.swap(i, swapIndex);
  }
  return this;
};

// swaps two elements
Array.prototype.swap = function(a, b) {
  var tmp = this[a];
  this[a] = this[b];
  this[b] = tmp;
  return this;
};

// pushes elements of an array into another array
Array.prototype.pushElements = function(array) {
  for (var i = 0; i < array.length; i++) {
    this.push(array[i]);
  }
};

// returns a random elemenf from an array 
Array.prototype.getRandomElement = function() {
  if (this.length === 0) return undefined;
  return this[Math.round(Math.random() * (this.length - 1))];
};


// removes all elements which are undefined
Array.prototype.removeUndefined = function() {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === undefined) {
      this.splice(i, 1);
      i--;
    }
  }
};

// reverses the order of all elements
Array.prototype.reverse = function() {
	var result = [];
	for (var i = this.length - 1; i >= 0; i--) {
		result.push(this[i]);
	}
	return result;
};

// returns index of max element
Array.prototype.indexOfMax = function() {
  if (this.length === 0) {
    return -1;
  }

  var max = this[0];
  var maxIndex = 0;

  for (var i = 1; i < this.length; i++) {
    if (this[i] > max) {
      maxIndex = i;
      max = this[i];
    }
  }

  return maxIndex;
}

// returns index of min element
Array.prototype.indexOfMin = function() {
  if (this.length === 0) {
    return -1;
  }

  var min = this[0];
  var minIndex = 0;

  for (var i = 1; i < this.length; i++) {
    if (this[i] < min) {
      minIndex = i;
      min = this[i];
    }
  }

  return minIndex;
}

// returns index of min element
Array.prototype.indexOfClosestToZero = function() {
  if (this.length === 0) {
    return -1;
  }

  var closestToZero = Math.abs(this[0]);
  var closestToZeroIndex = 0;

  for (var i = 1; i < this.length; i++) {
    if (Math.abs(this[i]) < closestToZero) {
      closestToZeroIndex = i;
      closestToZero = Math.abs(this[i]);
    }
  }

  return closestToZeroIndex;
}

// converts a number to an English string
Number.prototype.toEnglishString = function() {
  if (this.valueOf() > 12) {
    return this.toString();
  }
  var strings = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  return strings[this.valueOf()];
};

// converts a number to a English month name abbreviation
Number.prototype.toMonthAbbreviation = function() {
  if (this.valueOf() > 12) return undefined;
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"];
  return monthNames[this.valueOf() - 1];
};

// sets a single bit
Number.prototype.setBit = function(x) {
  return this.valueOf() | 1 << x;
};

// clear a single bit
Number.prototype.clearBit = function(x) {
  return this.valueOf() & ~(1 << x);
};

// toggles a single bit
Number.prototype.toggleBit = function(x) {
  return this.valueOf() ^ 1 << x;
};

// get a single bit
Number.prototype.getBit = function(x) {
  return (this.valueOf() >> x) & 1;
};

// check a single bit agains value
Number.prototype.changeBitTo = function(x, value) {
  return this.valueOf() ^ (-value ^ this.valueOf()) & (1 << x);
};

// adds leading zeros to a number
Number.prototype.pad = function(size) {
    var s = this + "";
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

// maps a value from two bounds to another two
Math.map = function(x, in_min, in_max, out_min, out_max) {
  return (x-in_min) * (out_max-out_min) / (in_max-in_min) + out_min;
};

// sign function
Math.sgn = function(x) {
  if (x < 0)
    return -1;
  if (x === 0)
    return 0;
  return 1;
};

// converts radian to degree
Math.rad2deg = function(rad) {
  return (rad / 0.0174532925);
};

// converts degree to radian
Math.deg2rad = function(deg) {
  return (deg * 0.0174532925);
};



// returns a default data string of type dd.mm.yyyy hh:mm:ss
Date.prototype.toDefaultString = function() {
  return this.getDate().addLeadingZeros(2) + ". " + 
    (this.getMonth()+1).toMonthAbbreviation() + " " + 
    this.getFullYear().addLeadingZeros(4) + " " + 
    this.getHours().addLeadingZeros(2) + ":" + 
    this.getMinutes().addLeadingZeros(2);
};

// Date object to MySQL date string
// @return MySQL date string (yyyy-mm-dd)
Date.prototype.toMySQLString = function() {
	return this.getFullYear().pad(4) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2); // month is zero based
};

// returns the current time in milliseconds
Date.millis = function () {
  return new Date().getTime();
};

// returns the current time in seconds
Date.seconds = function () {
  return Math.round(Date.millis() / 1000 - 0.5, 0);
};