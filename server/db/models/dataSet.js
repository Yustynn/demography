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
    	type: Boolean
    }
});

mongoose.model('DataSet', schema);
