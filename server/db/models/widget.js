var mongoose = require('mongoose');

var widgetTypes = ['widget', 'text', 'graph', 'spreadsheet', 'other'];

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
        required: true,
        enum: widgetTypes
    },
    col: {
        type: Number,
        required: true
    },
    row: {
        type: Number,
        required: true
    },
    sizeX: {
        type: Number,
        required: true
    },
    sizeY: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
});

mongoose.model('Widget', schema);
