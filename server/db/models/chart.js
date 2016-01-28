var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    dashboard: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard',
        required: true
    },
    title: {
        type: String
    },
    type: {
    	type: String,
        required: true 
    },
    public: {
    	type: Boolean
    }
});

mongoose.model('Chart', schema);
