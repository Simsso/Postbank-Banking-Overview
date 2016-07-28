var api = (function(jQuery) {
	const url = "/api/transactions";

	function fetchData(success, error) {
		jQuery.ajax({
			url: url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				console.log(data);
				success(data);
			},
			error: error
		});
	}
	return {
		fetchData: fetchData
	};
})(jQuery);