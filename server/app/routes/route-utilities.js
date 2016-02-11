'use strict';

var _ = require('lodash');
var fsp = require('fs-promise');
var path = require('path');
var flatten = require('flat');

var exports = module.exports = {};

// Path where uploaded files are saved
var uploadFolderPath = path.join(__dirname + '/../../db/upload-files');

var filterFloat = function (value) {
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value);
  return NaN;
}

// Helper function to construct a file path
exports.getFilePath = function(userId, datasetId, fileType) {
    if (fileType === "text/csv") return uploadFolderPath + '/user:' + userId + '-dataset:' + datasetId + '.csv';
    else if (fileType === "application/json") return uploadFolderPath + '/user:' + userId + '-dataset:' + datasetId + '.json';
}

// Helper function to convert csv to json
exports.convertCsvToJson = function(rawFile) {
    var fileStr = rawFile.toString();
    var rawDataArray = fileStr.split("\n").map(function(line, index) {
        return line.split(",").map(function(cell){
            return cell.replace(/^\s+|\s+$/g,''); //trim whitespace
        });
    });
    var headerArray = rawDataArray.shift();

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
            if (filterFloat(item) !== NaN) item = filterFloat(item);
            dataFieldObject[headerArray[index]] = item;
        });
        return dataFieldObject;
    });
}

exports.convertToFlatJson = function(rawFile) {
    // If the json is an array of objects, return a flattened array
    if (Array.isArray(rawFile)) {
        return rawFile.map(function(row) {
            return flatten(row, { safe: true });
        });
    } // If the json is one object, return the flattened object
    else if (typeof rawFile === "object") return flatten(rawFile, { safe: true });
    else return; // Otherwise return undefined
}

// Helper function to determine if the user in the search is the same as the user making the request
exports.searchUserEqualsRequestUser = function(searchUser, requestUser) {
    if (searchUser.toString() === requestUser._id.toString()) return true;
    return false;
}
