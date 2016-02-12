'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var DataSet = mongoose.model('DataSet');
var jwt = require('jsonwebtoken');
var routeUtility = require('../route-utilities.js');
var fsp = require('fs-promise');

var tokenSecret = process.env.TOKEN_SECRET; //TODO: hope this will work once deployed

//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
// route middleware to verify a token
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, tokenSecret, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        // if there is no token return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});


//Route to POST new dataset
router.post("/", function(req, res, next){
    console.log("POST")
    var authenticatedUser = req.decoded;

    var filepath, returnDataObject;

    //var dataArray = routeUtility.convertToFlatJson(JSON.parse(req.body.data.toString()));
    //not sure we need to parse
    var dataArray = (typeof req.body.data === 'string' ? routeUtility.convertToFlatJson(JSON.parse(req.body.data)) : routeUtility.convertToFlatJson(req.body.data));

    //req.body contains all information for new dataset:
    var metaData = req.body;
    delete metaData.data;
    metaData.user = authenticatedUser._id;

    DataSet.create(metaData)
    .then(dataset => {
        filepath = routeUtility.getFilePath(dataset.user, dataset._id, "application/json");
        //create FS file
    })


});

//Route to UPDATE existing dataset by ID

//Route to DELETE existing dataset by ID


// Route to retrieve all users
// DELETE /api/users/:userId
// router.delete("/:datasetId", function(req, res, next) {

//     DataSet.remove({
//             _id: req.params.userId
//         })
//         .then(response => res.status(200).send("User successfully removed"))
//         .then(null, next);
// });

//request a token:
router.get("/generateToken", function(req, res, next) {
    if (req.user) {
        //generate token and send to user
        var token = jwt.sign(req.user, tokenSecret, {});
        res.status(200).send({
            success: true,
            token: token
        });
    }
    else res.status(401).send("You are not logged in");
});
