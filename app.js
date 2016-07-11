const express = require('express');
const bodyParser = require('body-parser');

var app = express();

// modules
const dataBase = require('./data-base');
const fileParser = require('./file-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

// api
app.get('/api', function (req, res) {
  res.status(200).send('Server online');
});

app.post('/api/*', function(req, res, next) {
	// log every api request
	console.log(req.url);
	console.log(req.body);

	next();
});

const port = 8080;
app.listen(port);

fileParser.getAllTransactions(function(transactions) {
	console.log(transactions);
});

console.log('listening on port ' + port);