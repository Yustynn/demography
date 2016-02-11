'use strict';

var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var DataSet = mongoose.model('DataSet');
var _ = require('lodash');
var fsp = require('fs-promise');
var path = require('path');
var flatten = require('flat');
var routeUtility = require('../route-utilities.js');

// Path where uploaded files are saved
var uploadFolderPath = path.join(__dirname + '/../../../db/upload-files');

// Route to retrieve all datasets
    // This sends metadata only. The GET /:datasetId will need to be used to access the actual data
// GET /api/datasets/
router.get("/", function(req, res, next) {
    // If a specific user data is requested by a different user, only send the public data
    var queryObject = req.query;
    queryObject.isPublic = true;

    // If a specific user data is requested by the same user, send it back
    if (queryObject.user && routeUtility.searchUserEqualsRequestUser(queryObject.user, req.user)) delete queryObject.isPublic;
    DataSet.find(queryObject)
    .then(datasets => res.status(200).json(datasets))
    .then(null, function(err) {
        err.message = "Something went wrong when trying to access these datasets";
        next(err);
    });
});

// GET /api/datasets/:datasetId
router.get("/:datasetId", function(req, res, next) {
    var returnDataObject;
    DataSet.findById(req.params.datasetId)
    .then(dataset => {
        // Throw an error if a different user tries to access a private dataset
        if (!req.headers['user-agent'].includes("PhantomJS")) {
            if (!routeUtility.searchUserEqualsRequestUser(dataset.user, req.user) && !dataset.isPublic) {
                return res.status(401).send("You are not authorized to access this dataset");
            }
        }

        // Save the metadata on the return object
        returnDataObject = dataset.toJSON();

        // Retrieve the file so it can be sent back with the metadata
        var filePath = routeUtility.getFilePath(dataset.user, dataset._id, dataset.fileType);
        fsp.readFile(filePath, { encoding: 'utf8' })
        .then(rawFile => {
            // Convert csv file to a json object if needed
            var dataArray = dataset.fileType === "text/csv" ? routeUtility.convertCsvToJson(rawFile) : JSON.parse(rawFile);
            // Add the json as a property of the return object, so it an be sent with the metadata
            returnDataObject.jsonData = dataArray;
            res.status(200).json(returnDataObject);
        });
    })
    .then(null, function(err) {
        err.message = "Something went wrong when trying to access this dataset";
        next(err);
    });
});

// multer is middleware used to parse the file that is uploaded through the POST request
// This route should come last, so other routes are not affected by this middleware
var multer = require('multer');
var upload = multer({
    dest: uploadFolderPath
});

// Route to create a new dataset in MongoDB and save a renamed csv file to the filesystem
// POST /api/datasets/
router.post('/', upload.single('file'), function(req, res, next) {
    var metaData = req.body,
    originalFilePath = req.file.path,
    newFilePath,
    returnDataObject,
    dataArray;

    metaData.fileType = "application/json";

    if (req.file.mimetype !== "text/csv" && req.file.mimetype !== "application/json") {
        fsp.unlink(originalFilePath);
        res.status(422).send("This is not valid file type. Upload either .csv or .json");
    }

    DataSet.create(metaData)
    .then(dataset => {
        // Save the metadata on the return object
        returnDataObject = dataset.toJSON();
        newFilePath = routeUtility.getFilePath(dataset.user, dataset._id, "application/json");

        return fsp.readFile(originalFilePath, { encoding: 'utf8' });
    })
    .then(rawFile => {
        // Convert csv file to a json object if needed, or flatten json object if needed
        dataArray = req.file.mimetype === "application/json" ? routeUtility.convertToFlatJson(JSON.parse(rawFile)) : routeUtility.convertCsvToJson(rawFile);
        //remove temp file:
        fsp.unlink(originalFilePath);
        //save JSON file to FS
        fsp.writeFile(newFilePath, JSON.stringify(dataArray));
        // Add the json as a property of the return object, so it an be sent with the metadata
        returnDataObject.jsonData = dataArray;
        res.status(201).json(returnDataObject);
    })
    .then(null, function(err) {
        err.message = "Something went wrong when trying to create this dataset";
        next(err);
    });
});

// Route to update an existing dataset in MongoDB and overwrite the saved csv file in the filesystem
// PUT /api/datasets/:datasetId
router.put("/:datasetId/updateDataset", function(req, res, next) {
    DataSet.findById(req.params.datasetId)
    .then(mongoDataset => {
        // Throw an error if a different user tries to update mongoDataset
        if (!routeUtility.searchUserEqualsRequestUser(mongoDataset.user, req.user)) res.status(401).send("You are not authorized to access this mongoDataset");
        var filePath = routeUtility.getFilePath(mongoDataset.user, mongoDataset._id, mongoDataset.fileType);
        fsp.readFile(filePath, { encoding: 'utf8' })
        .then(file => {
            if (req.params)
            res.status(200).send(file);
        })
    }).then(null, function(err) {
        err.message = "Something went wrong when trying to update this dataset";
        next(err);
    });
});

router.post('/:datasetId/updateDataset', upload.single('file'), function(req, res, next) {
    var metaData = req.body,
    originalFilePath = req.file.path,
    datasetId = req.params.datasetId,
    newFilePath,
    returnDataObject,
    dataArray;

    metaData.fileType = "application/json";

    if (req.file.mimetype !== "text/csv" && req.file.mimetype !== "application/json") {
        // Remove temp file
        fsp.unlink(originalFilePath);
        res.status(422).send("This is not valid file type. Upload either .csv or .json");
    }

    DataSet.findByIdAndUpdate(datasetId, metaData)
    .then(originalDataset => {
        return DataSet.findById(originalDataset._id);
    })
    .then(updatedDataset => {
        // Save the metadata on the return object
        returnDataObject = updatedDataset.toJSON();
        newFilePath = routeUtility.getFilePath(updatedDataset.user, updatedDataset._id, "application/json");

        return fsp.readFile(originalFilePath, { encoding: 'utf8' });
    })
    .then(rawFile => {
        // Convert csv file to a json object if needed, or flatten json object if needed
        dataArray = req.file.mimetype === "application/json" ? routeUtility.convertToFlatJson(JSON.parse(rawFile)) : routeUtility.convertCsvToJson(rawFile);
        // Remove temp file
        fsp.unlink(originalFilePath);
        // Remove old file name
        return fsp.unlink(newFilePath);
    })
    .then(response => {
        // Save JSON file to FS
        fsp.writeFile(newFilePath, JSON.stringify(dataArray));
        // Add the json as a property of the return object, so it an be sent with the metadata
        returnDataObject.jsonData = dataArray;
        res.status(201).json(returnDataObject);
    })
    .then(null, function(err) {
        err.message = "Something went wrong when trying to create this dataset";
        next(err);
    });
});

//FOR EXTERNAL API CALLS:
//Route to update an existing dataset in mongodb and update/ add an array of entries based on unique _id or unique id:


// Route to delete an existing dataset in MongoDB and the saved csv file in the filesystem
// DELETE /api/datasets/:datasetId
router.delete("/:datasetId", function(req, res, next) {
    var filePath;
    DataSet.findById(req.params.datasetId)
    .then(dataset => {
        // Throw an error if a different user tries to delete dataset
        if (!routeUtility.searchUserEqualsRequestUser(dataset.user, req.user)) res.status(401).send("You are not authorized to access this dataset");
        filePath = routeUtility.getFilePath(dataset.user, dataset._id, dataset.fileType);
        return dataset.remove();
    })
    .then(dataset => {
        fsp.unlink(filePath);
        res.status(200).send(dataset);
    })
    .then(null, function(err) {
        err.message = "Something went wrong when trying to delete this dataset";
        next(err);
    });
});
