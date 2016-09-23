var dateRange = (function(jQuery) {
	var dateRangeWidthName = {
		'week': 'Week',
		'month': 'Month',
		'quarter': 'Quarter',
		'year': 'Year',
		'lifetime': 'Lifetime',
		'custom': 'Custom range'
	};

	var divSelectedRangeWidthName = $('.selected-date-range-width-value');

	var selectedRangeWidth = 'month';
	var dateRange = {
		from: null,
		till: null
	};

	jQuery(window).on('hashchange', function() {
		var hash = window.location.hash;
		if (hash) {
			hash = hash.slice(1);
			processSelectedRangeWidth(hash);
		}
		else {
			processSelectedRangeWidth(selectedRangeWidth);
		}
	});

	jQuery(document).on('ready', function() {
		jQuery(window).trigger('hashchange');
	});

	function getDateRange() {
		return dateRange;
	}

	function processSelectedRangeWidth(rangeWidth) {
		selectedRangeWidth = rangeWidth;
		divSelectedRangeWidthName.html(dateRangeWidthName[rangeWidth]);

		var currentDate = new Date();

		switch (rangeWidth) {
			case 'week':
				var currentDateMinusOne = dateFns.subDays(currentDate, 1); // subtract one because Sunday is dateFns' first day of week
				dateRange.from = dateFns.addDays(dateFns.startOfWeek(currentDateMinusOne), 1);
				dateRange.till = dateFns.addDays(dateFns.endOfWeek(currentDateMinusOne), 1);
				break;
			case 'month':
				dateRange.from = dateFns.startOfMonth(currentDate);
				dateRange.till = dateFns.endOfMonth(currentDate);
				break;
			case 'quarter':
				dateRange.from = dateFns.startOfQuarter(currentDate);
				dateRange.till = dateFns.endOfQuarter(currentDate);
				break;
			case 'year':
				dateRange.from = dateFns.startOfYear(currentDate);
				dateRange.till = dateFns.endOfYear(currentDate);
				break;
			case 'lifetime':
				dateRange.from = null;
				dateRange.till = null;
				break;
			case 'custom':
				dateRange.from = null;
				dateRange.till = null;
				break;
		}

		events.emit('selected-date-range-change', dateRange);
	}

	function getPrevDateRange() {
		var range = {
			from: null,
			till: null
		};

		switch (selectedRangeWidth) {
			case 'week':
				range.from = dateFns.subWeeks(dateRange.from, 1);
				range.till = dateFns.subWeeks(dateRange.till, 1);
				break;
			case 'month':
				range.from = dateFns.subMonths(dateRange.from, 1);
				range.till = dateFns.endOfMonth(dateFns.subMonths(dateRange.till, 1));
				break;
			case 'quarter':
				range.from = dateFns.subQuarters(dateRange.from, 1);
				range.till = dateFns.endOfQuarter(dateFns.subQuarters(dateRange.till, 1));
				break;
			case 'year':
				range.from = dateFns.subYears(dateRange.from, 1);
				range.till = dateFns.endOfYear(dateFns.subYears(dateRange.till, 1));
				break;
		}
		return range;
	}

	function getNextDateRange() {
		var range = {
			from: null,
			till: null
		};

		switch (selectedRangeWidth) {
			case 'week':
				range.from = dateFns.addWeeks(dateRange.from, 1);
				range.till = dateFns.addWeeks(dateRange.till, 1);
				break;
			case 'month':
				range.from = dateFns.addMonths(dateRange.from, 1);
				range.till = dateFns.endOfMonth(dateFns.addMonths(dateRange.till, 1));
				break;
			case 'quarter':
				range.from = dateFns.addQuarters(dateRange.from, 1);
				range.till = dateFns.endOfQuarter(dateFns.addQuarters(dateRange.till, 1));
				break;
			case 'year':
				range.from = dateFns.addYears(dateRange.from, 1);
				range.till = dateFns.endOfYear(dateFns.addYears(dateRange.till, 1));
				break;
		}
		return range;
	}

	function prevDateRange() {
		dateRange = getPrevDateRange();
		events.emit('selected-date-range-change', dateRange);
	}

	function nextDateRange() {
		dateRange = getNextDateRange();
		events.emit('selected-date-range-change', dateRange);
	}

	function getSelectedRangeWidth() {
		return selectedRangeWidth;
	}

	return {
		getDateRange: getDateRange,
		prevDateRange: prevDateRange,
		nextDateRange: nextDateRange,
		getPrevDateRange: getPrevDateRange,
		getNextDateRange: getNextDateRange,
		getSelectedRangeWidth: getSelectedRangeWidth
	};
})(jQuery);