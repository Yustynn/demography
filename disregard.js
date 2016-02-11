var connectToDb = require('./server/db');
var mongoose = require('mongoose');
var DataSet = mongoose.model('DataSet');
var Dashboard = mongoose.model('Dashboard');


DataSet.findByIdAndUpdate('56bb6820db76169fa52bb4e6', {'title': "Luxury Auto Sales"})
	.then(function(updated) {
		console.log(updated)
	})

Dashboard.find({title: "fghjkl"})
	.then(function(allDashboards) {
		allDashboards.forEach(function(e) {
			e.update({'title': "Luxury Auto Sales"})
				.then(function(d) {
					console.log(d)
				})
		})
	})
