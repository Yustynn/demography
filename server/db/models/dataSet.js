var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    title: {
        type: String
    },
    shortDescription: {
    	type: String
    },
    public: {
    	type: Boolean,
        default: false
    }
});

mongoose.model('DataSet', schema);
