const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

let userModel = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res) {
	res.render('users/register');
});

router.post('/register', function(req, res) {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Eamil is not valid').isEmail();
	req.checkBody('username', 'Unseranme is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

	let errors =  req.validationErrors();
	
	if (errors) {
		res.render('users/register', {
			errors: errors
		});
	} else {
		let newUser = new userModel({
			name: name,
			email: email,
			username: username,
			password: password
		});

		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(newUser.password, salt, function(err, hash){
				if (err) {
					console.log(err);
				}
				newUser.password = hash;
				newUser.save(function(saveErr){
					if (saveErr) {
						console.log(saveErr);
						return;
					} else {
						req.flash('success', 'You are now registered');
						res.redirect('/users/login');
					}
				});
			});
		});
	}
});

router.get('/login', function(req, res) {
	res.render('users/login');
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

module.exports = router;
