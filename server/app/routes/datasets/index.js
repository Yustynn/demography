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
var getFilePath = function(userId, datasetId, fileType) {
    if (fileType === "text/csv") return uploadFolderPath + '/user:' + userId + '-dataset:' + datasetId + '.csv';
    else if (fileType === "application/json") return uploadFolderPath + '/user:' + userId + '-dataset:' + datasetId + '.json';
}

// Helper function to convert csv to json
var convertCsvToJson = function(rawFile) {
    var fileStr = rawFile.toString();
    var rawDataArray = fileStr.split("\n").map(function(line, index) {
        return line.split(",").map(function(cell){
            return cell.replace(/^\s+|\s+$/g,'');   //trim whitespace
        });
    });
    var headerArray = rawDataArray.shift();
    console.log(rawDataArray[rawDataArray.length-1])

    //recursively remove empty rows:
    var cleanCounter = 0;
    while(rawDataArray[rawDataArray.length-1][0] === ""){
        rawDataArray.pop();
        cleanCounter++
    }
    if (cleanCounter > 0) console.log("removed", cleanCounter, "invalid rows from the CSV");

    return rawDataArray.map(function(line) {
        var dataFieldObject = {};
        line.forEach(function(item, index) {
            dataFieldObject[headerArray[index]] = item;
        });
        return dataFieldObject;
    });
}

// Helper function to determine if the user in the search is the same as the user making the request
var searchUserEqualsRequestUser = function(searchUser, requestUser) {
    return searchUser.toString() === requestUser._id.toString();
}

// Route to retrieve all datasets
    // This sends metadata only. The GET /:datasetId will need to be used to access the actual data
// GET /api/datasets/
router.get("/", function(req, res, next) {
    // If a specific user data is requested by a different user, only send the public data
    var queryObject = req.query;

    if (queryObject.user && !searchUserEqualsRequestUser(queryObject.user, req.user)) queryObject["isPublic"] = true;

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
    console.log(req.headers)
    DataSet.findById(req.params.datasetId) // .lean() allows the mongo object to be mutable. We may want to use a lodash method here instead
    .then(dataset => {
        // Throw an error if a different user tries to access a private dataset
        if (!req.headers['user-agent'].includes("PhantomJS")) {
            if (!searchUserEqualsRequestUser(dataset.user, req.user) && !dataset.isPublic) {
                return res.status(401).send("You are not authorized to access this dataset");
            }
        }


        // Save the metadata on the return object
        returnDataObject = dataset.toJSON();


        // Retrieve the file so it can be sent back with the metadata
        var filePath = getFilePath(dataset.user, dataset._id, dataset.fileType);
        fsp.readFile(filePath, { encoding: 'utf8' })
        .then(rawFile => {
            // Convert csv file to a json object if needed
            // BOBBY NOTE: Need to test this out when the file is json to start
            var dataArray = dataset.fileType === "text/csv" ? convertCsvToJson(rawFile) : JSON.parse(rawFile);
            // Add the json as a property of the return object, so it an be sent with the metadata
            returnDataObject["jsonData"] = dataArray;
            res.status(200).json(returnDataObject);
        });
    })
    .then(null, function(err) {
        console.error(err, err.stack)
        err.message = "Something went wrong when trying to access this dataset";
        next(err);
    });
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
// BOBBY NOTE: Need to allow this to process .json files as well
router.post('/', upload.single('file'), function(req, res, next) {
    var metaData = req.body;
    var returnDataObject;
    metaData.fileType = req.file.mimetype;
    if (metaData.fileType !== "text/csv" && metaData.fileType !== "application/json") res.status(422).json("This is not valid file type. Upload either .csv or .json");
    var originalFilePath;
    var newFilePath;
    DataSet.create(metaData)
    .then(dataset => {
        // Save the metadata on the return object
        returnDataObject = dataset.toJSON();

        // Rename the file saved to the filesystem so it follows proper naming convention
        originalFilePath = req.file.path;
        newFilePath = getFilePath(dataset.user, dataset._id, dataset.fileType);
        fsp.rename(originalFilePath, newFilePath)
        .then(response => {
            // Retrieve the file so it can be sent back with the metadata
            fsp.readFile(newFilePath, { encoding: 'utf8' })
            .then(rawFile => {
                // Convert csv file to a json object if needed
                // BOBBY NOTE: Need to test this out when the file is json to start
                var dataArray = dataset.fileType === "text/csv" ? convertCsvToJson(rawFile) : JSON.parse(rawFile);

                // Add the json as a property of the return object, so it an be sent with the metadata
                returnDataObject["jsonData"] = dataArray;

                res.status(201).json(returnDataObject);
            });
        })
    })
    .then(null, function(err) {
        err.message = "Something went wrong when trying to create this dataset";
        next(err);
    });
});

// BOBBY NOTE: Need to figure out how to go about updating the files in the filesystem

// Route to update an existing dataset in MongoDB and overwrite the saved csv file in the filesystem
// PUT /api/datasets/:datasetId
router.put("/:datasetId", function(req, res, next) {
    DataSet.findById(req.params.datasetId)
    .then(dataset => {
        // Throw an error if a different user tries to update dataset
        if (!searchUserEqualsRequestUser(dataset.user, req.user)) res.status(401).send("You are not authorized to access this dataset");
        var filePath = getFilePath(dataset.user, dataset._id, dataset.fileType);
        fsp.readFile(filePath, { encoding: 'utf8' })
        .then(file => res.status(200).send("Ability to update file is TBU"))
    }).then(null, function(err) {
        err.message = "Something went wrong when trying to update this dataset";
        next(err);
    });
});

// Route to delete an existing dataset in MongoDB and the saved csv file in the filesystem
// DELETE /api/datasets/:datasetId
// BOBBY NOTE: Do we need a separate route to update the metadate and the file in the filesystem?
router.delete("/:datasetId", function(req, res, next) {
    DataSet.findById(req.params.datasetId)
    .then(dataset => {
        // Throw an error if a different user tries to delete dataset
        if (!searchUserEqualsRequestUser(dataset.user, req.user)) res.status(401).send("You are not authorized to access this dataset");
        var filePath = getFilePath(dataset.user, dataset._id, dataset.fileType);
        DataSet.remove({ _id: dataset._id })
        .then(function(response) {
            fsp.unlink(filePath);
        }, function(err) {
            return next(err);
        });

        return dataset; // BOBBY NOTE: Sending back the dataset so we can remove it from the scope array
    })
    .then(dataset => res.status(200).send(dataset))
    .then(null, function(err) {
        err.message = "Something went wrong when trying to delete this dataset";
        next(err);
    });
});
