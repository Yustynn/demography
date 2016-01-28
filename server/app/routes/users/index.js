'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');

// Route for file uploads
// router.post('/:userId/upload', function(req, res, next) {
//     console.log("User: ", req.params.userId);
//     console.log("Body: ", req.body);
//     res.end();
// });

router.post('/upload', function(req, res, next) {
    console.log("Body: ", req.body);
    res.end();
});

