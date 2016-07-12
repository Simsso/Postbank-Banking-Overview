function formatCurrency(val) {
	if (typeof val !== 'number') {
		val = parseFloat(val);
	}
	return val.formatMoney();
}

function getCurrentMonth() {
	return {
		from: (new Date(moment().startOf('month'))).toMySQLString(),
		to: (new Date(moment().endOf('month'))).toMySQLString()
	};
}

var Transaction = React.createClass({
	getInitialState: function() {
		return { 
			expanded: false
		};
	},

	toggleExpanded: function() {
		this.setState({ expanded: !this.state.expanded });
	},

	render: function() {
		var amount = this.props.data['Amount'];
		var amountClassName = (amount >= 0) ? '' : 'text-warning';
		var expandedClass = this.state.expanded ? '' : 'hidden';
		return (
			<div>
				<div className="row" onClick={this.toggleExpanded}>
					<div className="col-sm-2">{this.props.data['DateOfBookkeepingEntry']}</div>
					<div className="col-sm-2">{this.props.data['ExchangeType']}</div>
					<div className="col-sm-3">{this.props.data['Applicant']}</div>
					<div className="col-sm-3">{this.props.data['Recipient']}</div>
					<div className="col-sm-2">
						<div className="pull-right">
							<span className={amountClassName}>
								{formatCurrency(amount)}
							</span>
						</div>
					</div>
				</div>

				<div className="row">
					<div className={expandedClass}>	
						<div className="col-xs-12">
							<p>{this.props.data['Details']}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var TransactionList = React.createClass({
	render: function() {
		var transactionItems = this.props.data.map(function(transaction) {
			return (
				<Transaction key={transaction.key} data={transaction} />
			);
		}.bind(this));
		return (
			<div className="transaction-list">
				<div className="row">
					<div className="col-sm-2">Value Date</div>
					<div className="col-sm-2">Exchange Type</div>
					<div className="col-sm-3">Applicant</div>
					<div className="col-sm-3">Recipient</div>
					<div className="col-sm-2">Amount (&euro;)</div>
				</div>
				{transactionItems}
			</div>
		);
	}
});

var TransactionListWrapper = React.createClass({
	previousMonth: function() {
		this.setStateRecursively({ time: {
			from: (new Date(moment(this.state.time.from).subtract(1, 'month'))).toMySQLString(),
			to: (new Date(moment(this.state.time.to).subtract(1, 'month').endOf('month'))).toMySQLString()
		}})
	},
	nextMonth: function() {
		this.setStateRecursively({ time: {
			from: (new Date(moment(this.state.time.from).add(1, 'month'))).toMySQLString(),
			to: (new Date(moment(this.state.time.to).add(1, 'month').endOf('month'))).toMySQLString()
		}})
	},
	withinDateRange: function(date) {
		var dateFrom = new Date(this.state.time.from), dateTo = new Date(this.state.time.to), x = new Date(date); 
		if (this.state.time.from === null && this.state.time.to === null) {
			return true;
		}
		if (this.state.time.from === null) {
			return dateTo >= x;
		}
		if (this.state.time.to === null) {
			return dateFrom <= x;
		}
		return dateFrom <= x && dateTo >= x;
	},
	mergeObjects: function(a, b) {
		for (var attr in b) {
			if (typeof b[attr] === 'object') {
				this.mergeObjects(a[attr], b[attr]);
			}
			else if (typeof b[attr] !== 'undefined') {
				a[attr] = b[attr];
			}
		}
		return a;
	},
	setStateRecursively: function(stateUpdate) {
		var newState = this.state;
		this.setState(this.mergeObjects(newState, stateUpdate));
	},

	fetch: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return { 
			data: [],
			time: getCurrentMonth()
		};
	},
	componentDidMount: function() {
		this.fetch();
	},
	getExchange: function(transactions) {
		var income = 0, expenses = 0;
		for (var i = 0; i < transactions.length; i++) {
			var transaction = transactions[i];
			var amount = transaction['Amount'];
			if (amount >= 0) {
				income += amount;
			}
			else {
				expenses += amount;
			}
		}
		return {
			income: income,
			expenses: expenses
		};
	},
	updateDateFrom: function(event) {
		this.setStateRecursively({
			time: { from: event.target.value.toString() }
		});
	},
	updateDateTo: function(event) {
		this.setStateRecursively({
			time: { to: event.target.value.toString() }
		});
	},
	render: function() {
		var transactionsWithinTimeRange = [];
		for (var i = 0; i < this.state.data.length; i++) {
			if (this.withinDateRange(this.state.data[i]['DateOfBookkeepingEntry'])) {
				transactionsWithinTimeRange.push(this.state.data[i]);
			}
		}
		var exchange = this.getExchange(transactionsWithinTimeRange);
		return (
			<div className="transaction-list-wrapper">
				<h2>List of all Transactions</h2>
				<div className="row">
					<div className="col-xs-2">
						<input type="button" className="form-control btn" value="Previous" onClick={this.previousMonth} />
					</div>
					<div className="col-xs-4">
						From<input type="date" className="form-control" value={this.state.time.from} onChange={this.updateDateFrom} />
					</div>
					<div className="col-xs-4">
						To<input type="date" className="form-control" value={this.state.time.to} onChange={this.updateDateTo} /><br />
					</div>
					<div className="col-xs-2">
						<input type="button" className="form-control btn" value="Next" onClick={this.nextMonth} />
					</div>
				</div>
				<input type="button" className="btn btn-primary" onClick={this.fetch} value="Fetch data" />
				<div class="row">
					<div class="col-sm-6">
						Income: {formatCurrency(exchange.income)}
					</div>
					<div class="col-sm-6">
						Expenses: {formatCurrency(exchange.expenses)}
					</div>
				</div>
				<TransactionList data={transactionsWithinTimeRange} />
			</div>
		);
	}
});

var App = React.createClass({
	render: function() {
		return (
			<div className="container">
				<h1>Postbank Banking Overview</h1>
  				<TransactionListWrapper url="/api/transactions" />
			</div>
		);
	}
});

ReactDOM.render(
	<App />,
 	document.getElementById('content')
);