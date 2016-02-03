var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    fileType: {
        type: String
    },
    title: {
        type: String
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

mongoose.model('DataSet', schema);
