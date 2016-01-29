var router = require('express').Router();
var Dashboard = require('../../../db/models/dashboard')
module.exports = router;

// /api/dashboards
router.get("/", function(req, res, next) {
	Dashboard.find()
		.then(function(allDashboards) {
			res.status(200).send(allDashboards);
		})
		.then(null, next)
})

// /api/dashboards/id
router.get("/:dashboardId", function(req, res, next) {
	Dashboard.findById(req.params.dashboardId)
		.then(function(dashboard) {
			res.status(200).send(dashboard);
		})
		.then(null, next)
})

router.post("/", function(req, res, next) {
	Dashboard.create(req.body)
		.then(function(createdDashboard) {
			res.status(201).send(createdDashboard);
		})
		.then(null, next)
})

router.put("/:dashboardId", function(req, res, next) {
	Dashboard.update({ _id: req.params.dashboardId}, req.body, function(err) {
		if(!err) res.status(200).send("Updated dashboard successfully!");
		else {
			console.error(err);
			res.status(404).send("We're sorry... There is no dashboard with that ID in our database.");
		}
	});
})

router.delete("/:dashboardId", function(req, res, next) {
	Dashboard.remove({_id: req.params.dashboardId}, function (err) {
		if(!err) res.status(200).send("Deleted dashboard successfully!");
		else {
			console.error(err);
			res.status(404).send("We're sorry... There is no dashboard with that ID in our database.");		
		}
	})
})