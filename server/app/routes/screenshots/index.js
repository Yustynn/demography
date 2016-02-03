var mongoose = require('mongoose');
var router = require('express').Router();
var Pageres = require('pageres');
module.exports = router;

// /api/screenshots
router.post("/", function(req, res, next) {
	var cookieString = `connect.sid=${req.cookies['connect.sid']}`;
	console.log(cookieString);
    var pageres = new Pageres({cookies: [cookieString]})
        .src('http://localhost:1337/users/' + req.user._id + '/datasets/' + req.body.datasetId + '/dashboards/' + req.body.dashboardId, ['480x320', '1024x768', 'iphone 5s'], {crop: true})
        .dest(process.cwd())
        .run()
        .then(() => console.log('screenshot successful!'))
        .then(null, function (err) {
        	console.log(err);
			console.log(err.stack);
			next(err);
        })
})
