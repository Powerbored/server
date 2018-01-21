const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const app = express();

mongoose.connect(config.database);
let db = mongoose.connection;
db.once('open', function() {
	console.log('Mongoose connected to ' + db.name);
});
db.on('error', function(err){
	console.log(err);
});

const routes = {
	index: {
		name: 'Home',
		path: '/index',
		router: require('./routes/index')
	}, 
	users: {
		path: '/users',
		router: require('./routes/users')
	}, 
	articles: {
		name: 'Articles',
		path: '/articles',
		router: require('./routes/articles')
	}
}
app.locals.nav = routes;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.basedir = app.get('views');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

app.use(session({
	secret: 'this is the secret',
	resave: true,
	saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		let namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.get('*', function(req, res, next) {
	res.locals.user = req.user || null;
	next();
})

app.use('/', routes.index.router);
for (let r of Object.keys(routes)) {
	app.use(routes[r].path, routes[r].router);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
