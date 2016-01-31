'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');

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
    .then(user => res.status(200).send(user))
    .then(null, next);
});

// Route to retrieve all users
// DELETE /api/users/:userId
router.delete("/:userId", function(req, res, next) {
    User.remove({ _id: req.params.userId })
    .then(response => res.status(202).send("User successfully removed"))
    .then(null, next);
});
