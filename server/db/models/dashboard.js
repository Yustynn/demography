var mongoose = require('mongoose');
var Widget = mongoose.model('Widget');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    title: {
        type: String, required: true
    },
    shortDescription: {
        type: String
    },
    dataset: {
        type: mongoose.Schema.Types.ObjectId, ref: 'DataSet',
        required: true
    },
    lastUpdated: {
    	type: Date,
    	default: Date.now
    },
    screenshot: {
        type: String,
        default: 'data/DashboardBackground.jpg'
    },
    isPublic: {
    	type: Boolean, default: false
    },
    tags: {
        type: [String]
    },
    originalDashboard: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard',
    }
});

schema.pre('save', function (next) {
    this.lastUpdated = Date.now()
    if(!this.originalCreator) this.originalCreator = this.user;
    next();
});

schema.pre('remove', function (next) {
    //remove all of it's widgets
    Widget.remove({dashboard: this._id})
    .then(function(){
        next();
    });
});

schema.methods.getWidgets = function getWidgets() {
    return Widget.find({dashboard: this._id})
    .then(function(widgets){
        return widgets;
    });
};

mongoose.model('Dashboard', schema);
