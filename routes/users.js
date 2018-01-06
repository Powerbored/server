const express = require('express');
const router = express.Router();

let user = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res) {
	res.render('users/register');
});

module.exports = router;
