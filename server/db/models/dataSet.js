var mongoose = require('mongoose');
var Promise = require('bluebird');

var Dashboard = mongoose.model('Dashboard');
var Widget = mongoose.model('Widget');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileType: {
        type: String,
        default: "application/json"
    },
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    originalDataset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataSet',
    },
    templateDashboard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dashboard'
    }
});

schema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// BOBBY NOTE: Figure out how to get this pre remove hook to work
schema.pre('remove', function(next) {
    //remove all of it's dashboards
    Dashboard.remove({
            dataset: this._id
        })
        .then(function() {
            next();
        });
});

schema.post('save', (doc, next) => {

    console.log('it!')
    if (!doc.templateDashboard) return next();

    console.log('getting it!')

    let templateDashboard;

    return Dashboard.findById(doc.templateDashboard)
    .then((template) => {
        templateDashboard = template.toObject();
        templateDashboard.title = doc.title;
        templateDashboard.shortDescription = doc.shortDescription;
        templateDashboard.isPublic = doc.isPublic;

        delete templateDashboard._id;

        console.log('coming!');

        const dashboardProm = Dashboard.create(templateDashboard);
        const templateWidgetsProm = template.getWidgets();

        return Promise.all([dashboardProm, templateWidgetsProm]);
    })
    .then((resolvedArr) => {
        const dashboard = resolvedArr[0];
        const templateWidgets = resolvedArr[1];

        return Promise.map(templateWidgets, (templateWidget) => {
            templateWidget = templateWidget.toObject();
            templateWidget.dashboard = promArr[0]._id;
            delete templateWidget.lastUpdated;

            return Widget.create(templateWidget);
        });
    })
    .then( (widgets) => {
        console.log(widgets);
    }, console.error.bind(console))
})

mongoose.model('DataSet', schema);
