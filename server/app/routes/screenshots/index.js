var mongoose = require('mongoose');
var router = require('express').Router();
var Pageres = require('pageres');
var path = require("path")
var _ = require("lodash")
module.exports = router;

// /api/screenshots
router.post("/", function(req, res, next) {
    console.log("THIS IS REQBODY", req.body)

	var cookieString = `connect.sid=${req.cookies['connect.sid']}`;
    var pageres = new Pageres({cookies: [cookieString], filename: req.body.dashboardId, selector: '#main > div > div.ng-scope.gridster.gridster-desktop.gridster-loaded', delay: 1})
        .src('http://localhost:1337/users/' + req.user._id + '/datasets/' + req.body.datasetId + '/dashboards/' + req.body.dashboardId, ['1024x768'])
        .dest(path.join(__dirname, "../../../db/screenshots"))
        .run()
        .then(() => {
        	console.log('Screenshot successful!')
        	res.status(200).send()
        })
        .then(null, function (err) {
        	console.log(err);
			console.log(err.stack);
			next(err);
        })
})

//filename: '<%= url.split("!")[7] %>!',

// selector: '#main > div > div.ng-scope.gridster.gridster-desktop.gridster-loaded'