var mongoose = require('mongoose');
var Dashboard = mongoose.model('Dashboard');
var Widget = mongoose.model('Widget');
var router = require('express').Router();
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

// /api/dashboards/?filterCriteria=XYZ
router.get("/", function (req, res, next) {
	Dashboard.find(req.query)
	.then(allDashboards => {
		//send the dashboard if it is public OR if it belongs to the user requesting it
        res.status(200).send(allDashboards.filter(d => d.isPublic || d.user.toString() === req.user._id.toString()))
    })
	.then(null, next)
})

// /api/dashboards/id
router.get("/:id", function(req, res, next) {
	Dashboard.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('dataset', 'title lastUpdated fileType')
		.then(function(dashboard){
            if (req.headers['user-agent'].includes("PhantomJS")) {
                dashboard.getWidgets()
                .then(function(widgets){
                    var myDash = dashboard.toJSON();
                    myDash['widgets'] = widgets;
                    res.status(201).send(myDash);
                });
            }
            else {
                if (dashboard.isPublic || dashboard.user._id.toString() === req.user._id.toString()){
                    dashboard.getWidgets()
                    .then(function(widgets){
                        var myDash = dashboard.toJSON();
                        myDash['widgets'] = widgets;
                        res.status(201).send(myDash);
                    });
                }
                else res.status(401).send("You are not authorized to view this dashboard");
            }
        })
		.then(null, next);
});

router.post("/", ensureAuthenticated, function(req, res, next) {
    Dashboard.create(req.body)
    .then(createdDashboard => res.status(201).send(createdDashboard))
});

router.put("/:id", ensureAuthenticated, function(req, res, next) {
    Widget.findByIdAndUpdate(req.params.id, req.body)
    .then(function(widget) {
        res.status(200).send(widget);
    }).then(null, next)
});

// Route to delete an existing dashboard in MongoDB
// DELETE /api/dashboards/:dashboardId
router.delete("/:id", ensureAuthenticated, function(req, res, next) {
	Dashboard.remove({_id: req.params.id}, function (err) {
		if(!err) res.status(200).send("Deleted dashboard successfully!");
		else {
			console.error(err);
			res.status(404).send("We're sorry... There is no dashboard with that ID in our database.");
		}
	})
});

// /api/dashboards/id/widgets
router.get("/:id/widgets", function (req, res, next) {
    Widget.find({dashboard: req.params.id})
    .then(widgets => res.status(201).send(widgets))
    .then(null, next);
});
