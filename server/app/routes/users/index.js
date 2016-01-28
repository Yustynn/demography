'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var path = require('path');

var multer = require('multer');
var uploadFilePath = path.join(__dirname + '/../../../db/upload-files')

// BOBBY NOTE: Need to rename file to user_id and project_id before saving
    // Add filename property to the multer config object
var upload = multer({ dest: uploadFilePath });

// Post route
    // POST /api/users/uploads
router.post('/uploads', upload.single('file'), function(req, res, next) {
    var file = req.file;
    res.send(file);
});
