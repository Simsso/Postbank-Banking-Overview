var dateRange = (function(jQuery) {
	var dateRangeWidthName = {
		'week': 'Week',
		'month': 'Month',
		'quarter': 'Quarter',
		'year': 'Year',
		'lifetime': 'Lifetime',
		'custom': 'Custom range'
	};

	var divSelectedRangeWidthName = $('.selected-date-range-width');

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

	function prevDateRange() {
		switch (selectedRangeWidth) {
			case 'week':
				dateRange.from = dateFns.subWeeks(dateRange.from, 1);
				dateRange.till = dateFns.subWeeks(dateRange.till, 1);
				break;
			case 'month':
				dateRange.from = dateFns.subMonths(dateRange.from, 1);
				dateRange.till = dateFns.subMonths(dateRange.till, 1);
				break;
			case 'quarter':
				dateRange.from = dateFns.subQuarters(dateRange.from, 1);
				dateRange.till = dateFns.subQuarters(dateRange.till, 1);
				break;
			case 'year':
				dateRange.from = dateFns.subYears(dateRange.from, 1);
				dateRange.till = dateFns.subYears(dateRange.till, 1);
				break;
		}

		events.emit('selected-date-range-change', dateRange);
	}

	function nextDateRange() {
		switch (selectedRangeWidth) {
			case 'week':
				dateRange.from = dateFns.addWeeks(dateRange.from, 1);
				dateRange.till = dateFns.addWeeks(dateRange.till, 1);
				break;
			case 'month':
				dateRange.from = dateFns.addMonths(dateRange.from, 1);
				dateRange.till = dateFns.addMonths(dateRange.till, 1);
				break;
			case 'quarter':
				dateRange.from = dateFns.addQuarters(dateRange.from, 1);
				dateRange.till = dateFns.addQuarters(dateRange.till, 1);
				break;
			case 'year':
				dateRange.from = dateFns.addYears(dateRange.from, 1);
				dateRange.till = dateFns.addYears(dateRange.till, 1);
				break;
		}

		events.emit('selected-date-range-change', dateRange);
	}

	function getChartScaleX() {
		switch (selectedRangeWidth) {
			case 'week':
				return 'day';
			case 'month':
				return 'week';
			case 'quarter':
				return 'month';
			case 'year':
				return 'quarter';
			case 'lifetime':
				return 'year';
			case 'custom':
				return 'year';
		}
	}

	return {
		getDateRange: getDateRange,
		prevDateRange: prevDateRange,
		nextDateRange: nextDateRange,
		getChartScaleX: getChartScaleX
	};
})(jQuery);