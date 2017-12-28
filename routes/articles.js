const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	let articles = [
		{
			id: 1,
			title: 'Article One',
			author: 'Andrew',
			body: 'This is atricle one'
		}, {
			id: 2,
			title: 'Article Two',
			author: 'not Andrew',
			body: 'This is atricle two'
		}, {
			id: 3,
			title: 'Article Three',
			author: 'Andrew',
			body: 'This is atricle three'
		}
	];
	res.render('articles/index', {
		title: 'Articles',
		articles: articles
	});
});

router.get('/add', function(req, res) {
	res.render('articles/add', { 
		title: 'Add Article' 
	});
});

module.exports = router;
