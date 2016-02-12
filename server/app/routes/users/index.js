'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

var tokenSecret = process.env.TOKEN_SECRET; //TODO: hope this will work once deployed

// BOBBY NOTE: Need to add some "admin" controls to these routes, so only they can delete, etc

// Route to retrieve all users
// GET /api/users/
router.get("/", function(req, res, next) {
    User.find({})
    .then(users => res.status(200).send(users))
    .then(null, next);
});

// Route to retrieve all users
// GET /api/users/:userId
router.get("/:userId", function(req, res, next) {
    User.findById(req.params.userId)
    .then(user => {
    	if(req.user._id !== req.params.userId){
    		user = user.sanitizeForUser();
    	}
    	res.status(200).send(user)
    })
    .then(null, next);
});

// Route to retrieve all users
// DELETE /api/users/:userId
router.delete("/:userId", function(req, res, next) {
    User.remove({ _id: req.params.userId })
    .then(response => res.status(200).send("User successfully removed"))
    .then(null, next);
});

//request a token:
router.get("/:id/generateToken", function (req, res, next) {
    console.log(tokenSecret);
    User.findById(req.params.id)
    .then(user => {
        //generate token and send to user
        var token = jwt.sign(user, tokenSecret,{});
        res.status(200).send({success: true, token:token});
    })
    .then(null, next);
});
