'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var DataSet = mongoose.model('DataSet');
var _ = require('lodash');

// Post route to create a project in the database
    // POST /api/users/:userId/projects
router.post('/:userId/projects', function(req, res, next) {
    DataSet.create(req.body)
    .then(project => {
        res.status(201).json(project);
    }).then(null, next);
})






// multer is middleware used to parse the file that is uploaded through the POST request
// This route should come last, so other routes are not affected by this middleware
    // BOBBY NOTE: Need to figure out how uploadFilePath with change when deployed
var path = require('path');
var uploadFilePath = path.join(__dirname + '/../../../db/upload-files')
var multer = require('multer');

// Config settings to set the filename and storage location
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadFilePath);
    },
    filename: function(req, file, cb) {
        cb(null, 'user:' + req.params.userId + '-project:' + req.params.projectName);
    }
});

var upload = multer({ storage: storage });

// Post route to save a file to the filesystem
    // POST /api/users/:userId/uploads/:projectName
router.post('/:userId/uploads/:projectName', upload.single('file'), function(req, res, next) {
    res.status(201).send(req.file);
});
