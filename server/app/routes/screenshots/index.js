var mongoose = require('mongoose');
var router = require('express').Router();
var Pageres = require('pageres');
var path = require("path")
var _ = require("lodash")
var Dashboard = mongoose.model('Dashboard')
module.exports = router;

// /api/screenshots
router.post("/", function(req, res, next) {
	var cookieString = `connect.sid=${req.cookies['connect.sid']}`;
    console.log(req.user._id);
    var pageres = new Pageres({cookies: [cookieString], filename: req.body.dashboardId, selector: '#main > div > div.gridster.gridster-desktop.gridster-loaded', delay: 1})
        .src('http://localhost:1337/users/' + req.user._id + '/datasets/' + req.body.datasetId + '/dashboards/' + req.body.dashboardId, ['1024x768'])
        .dest(path.join(__dirname, "../../../db/screenshots"))
        .run()
        .then(data => {
            console.log('WOW THIS IS WEIRD', data);
            return Dashboard.findByIdAndUpdate(req.body.dashboardId, { screenshot: data[0].filename }, { new: true })
        })
        .then(updatedDashboard => {
            console.log('Screenshot successful!')
            res.status(200).send(updatedDashboard)
        })
        .then(null, function (err) {
        	console.log(err);
			console.log(err.stack);
			next(err);
        })
})