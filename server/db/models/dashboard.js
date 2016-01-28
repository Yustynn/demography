var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    title: {
        type: String
    },
    project: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Project',
        required: true
    },
    lastUpdated: {
    	type: Date, 
    	default: Date.now
    },
    public: {
    	type: Boolean
    }
});


schema.pre('save', function (next) {

    this.lastUpdated = Date.now()
    next();

});

mongoose.model('Dashboard', schema);
