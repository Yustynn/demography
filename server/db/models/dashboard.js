var mongoose = require('mongoose');
//var User = require('./../models/user.js);
var Widget = mongoose.models.Widget;

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    title: {
        type: String, required: true
    },
    dataset: {
        type: mongoose.Schema.Types.ObjectId, ref: 'DataSet',
        required: true
    },
    lastUpdated: {
    	type: Date,
    	default: Date.now
    },
    isPublic: {
    	type: Boolean, default: false
    },
    tags: {
        type: [String]
    }
});

schema.pre('save', function (next) {
    this.lastUpdated = Date.now()
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
