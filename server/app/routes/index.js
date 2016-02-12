'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/dashboards', require('./dashboards'));
router.use('/datasets', require('./datasets'));
router.use('/widgets', require('./widgets'));
router.use('/screenshots', require('./screenshots'));
router.use('/external', require('./external'));


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
