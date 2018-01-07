const localStrategy =  require('passport-local').Strategy;
const user = require('../models/user');
const config = require('./database');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
	passport.use(new localStrategy(function(username, password, done) {
		let query = {username: username};
		user.findOne(query, function(err, user) {
			if (err) {
				throw err;
			}
			if (!user) {
				return done(null, false, {message: 'User not found'});
			}

			bcrypt.compare(password, user.password, function(err, isMatch) {
				if (err) {
					throw err;
				}
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {message: 'Incorrect password'})
				}
			});
		});
	}));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		user.findById(id, function(err, user) {
			done(err, user);
		});
	});
}