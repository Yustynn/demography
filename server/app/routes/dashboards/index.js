var mongoose = require('mongoose');
var Dashboard = mongoose.model('Dashboard');
var Widget = mongoose.model('Widget');
var router = require('express').Router();
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send("You are not authenticated");
    }
};

// Helper function to determine if the user in the search is the same as the user making the request
var searchUserEqualsRequestUser = function(searchUser, requestUser) {
    return searchUser.toString() === requestUser._id.toString();
}

// /api/dashboards/?filterCriteria=XYZ
router.get("/", function (req, res, next) {
	Dashboard.find(req.query).populate("user dataset")
	.then(allDashboards => {
		//send the dashboard if it is public OR if it belongs to the user requesting it
        res.status(200).send(allDashboards.filter(dashboard => dashboard.isPublic || dashboard.user._id.toString() === req.user._id.toString()))
    })
	.then(null, next)
});

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
    console.log("req.body from router", req.body)
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
    Dashboard.findById(req.params.id)
    .then(dashboard => {
        if (!searchUserEqualsRequestUser(dashboard.user, req.user)) res.status(401).send("You are not authorized to access this dashboard");
        return dashboard.remove();
    })
    .then(dashboard => {
        res.status(200).send(dashboard);
    })
    .then(null, function(err) {
        err.message = "Something went wrong when trying to delete this dashboard";
        next(err);
    });
});

// /api/dashboards/id/widgets
router.get("/:id/widgets", function (req, res, next) {
    Widget.find({dashboard: req.params.id})
    .then(widgets => res.status(201).send(widgets))
    .then(null, next);
});
