var Transaction = React.createClass({
	formatCurrency: function(val) {
		return val + "€";
	},

	render: function() {
		return (
			<tr>
				<td>{this.props.data['DateOfBookkeepingEntry']}</td>
				<td>{this.props.data['ValueDate']}</td>
				<td>{this.props.data['ExchangeType']}</td>
				<td>{this.props.data['Details']}</td>
				<td>{this.props.data['Applicant']}</td>
				<td>{this.props.data['Recipient']}</td>
				<td>{parseFloat(this.props.data['Amount']).formatMoney() + "€"}</td>
				<td>{parseFloat(this.props.data['Balance']).formatMoney() + "€"}</td>
			</tr>
		);
	}
});

var TransactionList = React.createClass({
	render: function() {
		var transactionItems = this.props.data.map(function(transaction) {
			return (
				<Transaction data={transaction} />
			);
		});
		return (
			<table className="transaction-list">
				<thead>
					<tr>
						<th>Bookkeeping Entry</th>
						<th>Value Date</th>
						<th>Exchange Type</th>
						<th>Details</th>
						<th>Applicant</th>
						<th>Recipient</th>
						<th>Amount</th>
						<th>Balance</th>
					</tr>
				</thead>
				<tbody>
					{transactionItems}
				</tbody>
			</table>
		);
	}
});

var TransactionListWrapper = React.createClass({
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
			data: []
		};
	},
	componentDidMount: function() {
		this.fetch();
	},
	render: function() {
		return (
			<div className="transaction-list-wrapper">
				<h2>List of all Transactions</h2>
				<input type="button" onClick={this.fetch} value="Fetch data" />
				<TransactionList data={this.state.data} />
			</div>
		);
	}
});

ReactDOM.render(
  <TransactionListWrapper url="/api/transactions" />,
  document.getElementById('content')
);