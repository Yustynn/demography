'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var DataSet = mongoose.model('DataSet');
var _ = require('lodash');
var fsp = require('fs-promise');
var path = require('path');

// Path where uploaded files are saved
var uploadFolderPath = path.join(__dirname + '/../../../db/upload-files');

// Helper function to construct a file path
var getFilePath = function(userId, datasetId) {
    return uploadFolderPath + '/user:' + userId + '-dataset:' + datasetId + '.csv';
}

// Route to retrieve all datasets
// GET /api/datasets/
// BOBBY NOTE: Need to figure out the best way of retrieving multiple files from the filesystem
router.get("/", function(req, res, next) {
    res.status(200).send("Ability to retrieve all files is TBU");
});

// Route to retrieve all datasets
// GET /api/datasets/:datasetId/:originalUserId
// BOBBY NOTE: May need to convert this to JSON on the response, if we can't save it as json
router.get("/:datasetId/:originalUserId", function(req, res, next) {
    var filePath = getFilePath(req.params.originalUserId, req.params.datasetId);
    fsp.readFile(filePath, { encoding: 'utf8' })
    .then(file => res.status(200).send(file))
    .then(null, next);
});

// multer is middleware used to parse the file that is uploaded through the POST request
// This route should come last, so other routes are not affected by this middleware
// BOBBY NOTE: Need to figure out how uploadFolderPath with change when deployed
var multer = require('multer');
var upload = multer({
    dest: uploadFolderPath
});

// Route to create a new dataset in MongoDB and save a renamed csv file to the filesystem
// POST /api/datasets/
router.post('/', upload.single('file'), function(req, res, next) {
    var originalFilePath;
    var newFilePath;
    DataSet.create(req.body)
        .then(dataset => {
            originalFilePath = req.file.path;
            newFilePath = getFilePath(dataset.user, dataset._id);
            fsp.rename(originalFilePath, newFilePath);
            return dataset;
        })
        .then(dataset => res.status(201).send(dataset))
        .then(null, next);
});

// Route to update an existing dataset in MongoDB and overwrite the saved csv file in the filesystem
// PUT /api/datasets/:datasetId/:originalUserId
// BOBBY NOTE: Need to figure out how to go about updating the files in the filesystem
router.put('/:datasetId/:originalUserId', function(req, res, next) {
    var filePath = getFilePath(req.params.originalUserId, req.params.datasetId);
    fsp.readFile(filePath, { encoding: 'utf8' })
    .then(file => res.status(200).send("Ability to update file is TBU"))
    .then(null, next);
});

// Route to update an existing dataset in MongoDB and overwrite the saved csv file in the filesystem
// DELETE /api/datasets/:datasetId/:originalUserId
// BOBBY NOTE: Need to figure out how to go about updating the files in the filesystem
router.delete('/:datasetId/:originalUserId', function(req, res, next) {
    var filePath = getFilePath(req.params.originalUserId, req.params.datasetId);
    DataSet.remove({ _id: req.params.datasetId })
    .then(response => {
        fsp.unlink(filePath)
        .then(response => res.status(200).send("Data set successfully removed"));
    }).then(null, next);
});