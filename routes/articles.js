const express = require('express');
const router = express.Router();

let articleModel = require('../models/article');

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

router.get('/add', function(req, res) {
	res.render('articles/add', { 
		title: 'Add Article' 
	});
});

router.post('/add', function(req, res){
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('author', 'Author is required').notEmpty();
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
		article.author = req.body.author;
		article.body = req.body.body;
		article.save(function(err){
			if (err) {
				console.log(err);
				return;
			} else {
				req.flash('success', 'Added '+article.title);
				res.redirect('/articles');
			}
		});
	}	
});

router.get('/:id', function(req, res){
	articleModel.findById(req.params.id, function(err, article){
		res.render('articles/article', {
			article: article
		});
	});
});

router.delete('/:id', function(req, res) {
	let query = {_id:req.params.id};

	articleModel.remove(query, function(err) {
		if (err) {
			console.log(err);
		}
		res.send('Success');
	});
});

router.get('/edit/:id', function(req, res){
	articleModel.findById(req.params.id, function(err, article){
		res.render('articles/edit', {
			article: article
		});
	});
});

router.post('/edit/:id', function(req, res){
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
			req.flash('success', 'Updated '+article.title);
			res.redirect('/articles');
		}
	});
});

module.exports = router;
