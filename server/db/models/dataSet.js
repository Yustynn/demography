var mongoose = require('mongoose');
var Dashboard = mongoose.model('Dashboard');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    fileType: {
        type: String, default: "application/json"
    },
    title: {
        type: String, required: true
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
    }
});

schema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

// BOBBY NOTE: Figure out how to get this pre remove hook to work
schema.pre('remove', function (next) {
    //remove all of it's dashboards
    Dashboard.remove({ dataset: this._id} )
    .then(function(){
        next();
    });
});

mongoose.model('DataSet', schema);
