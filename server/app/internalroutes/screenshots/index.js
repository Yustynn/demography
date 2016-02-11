var mongoose = require('mongoose');
var router = require('express').Router();
var Pageres = require('pageres');
var path = require("path")
var _ = require("lodash")
var Dashboard = mongoose.model('Dashboard')
module.exports = router;

// /internalapi/screenshots
router.post("/", function(req, res, next) {
	var cookieString = `connect.sid=${req.cookies['connect.sid']}`;
    var pageres = new Pageres({cookies: [cookieString], filename: req.body.dashboardId, selector: '#main > div > div.ng-scope.gridster.gridster-desktop.gridster-loaded'})
        .src('http://localhost:1337/users/' + req.user._id + '/datasets/' + req.body.datasetId + '/dashboards/' + req.body.dashboardId, ['1024x768'], {crop: true})
        .dest(path.join(__dirname, "../../../db/screenshots"))
        .run()
        .then(data => {
            return Dashboard.update({_id: req.body.dashboardId},{ $set: { screenshot: data[0].filename }})
        })
        .then(data => {
            console.log('Screenshot successful!')
            res.status(200).send()
        })
        .then(null, function (err) {
        	console.log(err);
			console.log(err.stack);
			next(err);
        })
})
