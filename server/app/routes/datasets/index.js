'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var DataSet = mongoose.model('DataSet');
var _ = require('lodash');
var fsp = require('fs-promise');
var path = require('path');












// multer is middleware used to parse the file that is uploaded through the POST request
// This route should come last, so other routes are not affected by this middleware
// BOBBY NOTE: Need to figure out how uploadFilePath with change when deployed
var uploadFilePath = path.join(__dirname + '/../../../db/upload-files');
var multer = require('multer');
var upload = multer({
    dest: uploadFilePath
});

// Route to create a new dataset in MongoDB and save a renamed csv file to the filesystem
router.post('/', upload.single('file'), function(req, res, next) {
    var originalFilePath;
    var newFilePath;
    DataSet.create(req.body)
        .then(dataset => {
            originalFilePath = req.file.path;
            newFilePath = uploadFilePath + '/user:' + dataset.user + '-dataset:' + dataset._id + '.csv';
            fsp.rename(originalFilePath, newFilePath);
            return dataset;
        })
        .then(dataset => {
            res.status(201).send(dataset);
        })
        .then(null, next);
});
