const express = require('express');
const router = express.Router();

let articleModel = require('../models/article');
let userModel = require('../models/user');

router.get('/', function(req, res) {
	articleModel.find({}, function(err, articles){
		if (err) {
			console.log(err);
		} else {
			res.render('articles/index', {
				title: 'Articles',
				articles: articles
			});
		}
	});
});

router.get('/add', ensureAuthenticated, function(req, res) {
	res.render('articles/article-form', { 
		title: 'Add Article' ,
		postTo: '/articles/add'
	});
});

router.post('/add', function(req, res){
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('body', 'Body is required').notEmpty();

	let errors = req.validationErrors();

	if(errors) {
		res.render('articles/add', {
			title: 'Add Article',
			errors: errors
		});
	} else {
		let article = new articleModel();
		article.title = req.body.title;
		article.author = req.user._id;
		article.body = req.body.body;
		article.save(function(err){
			if (err) {
				console.log(err);
				return;
			} else {
				req.flash('success', 'Added ' + article.title);
				res.redirect('/articles');
			}
		});
	}	
});

router.get('/:id', function(req, res, next) {
	articleModel.findById(req.params.id, function(err, article){
		if (article) {
			if (article.author) {
				userModel.findById(article.author, function(err, user) {
					res.render('articles/article', {
						article: article,
						author: user.name
					});
				});
			} else {
				res.render('articles/article', {
					article: article,
					author: 'unknown'
				});
			}
		} else {
			next();
		}
	});
});

router.delete('/:id', function(req, res) {
	console.log(req.user);
	if (!req.user._id) {
		res.status(500).send();
	}

	let query = {_id: req.params.id};

	articleModel.findById(req.params.id, function(err, article){
		if (article.author != req.user._id) {
			res.status(500).send();
		} else {
			articleModel.remove(query, function(err) {
				if (err) {
					console.log(err);
				}
				res.send('Success');
			});
		}
	});
});

router.get('/edit/:id', ensureAuthenticated, function(req, res){
	articleModel.findById(req.params.id, function(err, article){
		if (article.author != req.user._id) {
			req.flash('danger', 'Not authorised');
			res.redirect('/articles/' + article._id);
		} else {
			res.render('articles/article-form', {
				article: article,
				title: 'Edit ' + article.title,
				postTo: '/articles/edit/' + article._id
			});
		}
	});
});

router.post('/edit/:id', ensureAuthenticated, function(req, res){
	let article = {
		title: req.body.title,
		author: req.body.author,
		body: req.body.body
	},
	query = {_id: req.params.id};

	articleModel.update(query, article, function(err){
		if (err) {
			console.log(err);
			return;
		} else {
			req.flash('success', 'Updated ' + article.title);
			res.redirect('/articles');
		}
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'Please log in to add or edit articles');
		res.redirect('/users/login');
	}
}

module.exports = router;
