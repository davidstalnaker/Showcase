var express = require('express');
var mongoStore = require('connect-mongodb');
var model = require('./model.js')({});
var controller = require('./controller.js')(model);
require('./dateFormat.js');

var app = express.createServer();

app.configure(function(){
	app.use(express.cookieParser());
    app.use(express.bodyParser());
	app.use(express.session({
		store: new mongoStore({ 
			dbname: 'cms',
			collection: 'sessions',
			reapInterval: 60000 * 10 
		}),
		secret: "8A0fdSAj"
	}));
    app.use(express.methodOverride());
    app.use(app.router);

	app.set("view engine", "html");
	app.set("views", __dirname + "/views");
	app.register(".html", require("jqtpl").express);
	
	app.use(express.static(__dirname + '/public'));
});
app.get('*', controller.checkSession);
app.get('/', controller.home);
app.get('/login', controller.login);
app.post('/login', controller.POST.login);
app.get('/logout', controller.logout);
app.get('/register', controller.register);
app.post('/register', controller.POST.register);
app.get('/manage', controller.manage);
app.get('/create', controller.createPost);
app.post('/create', controller.POST.editPost);
app.get('/edit/:slug', controller.editPost);
app.post('/edit/:slug', controller.POST.editPost);
app.get('/delete/:slug', controller.deletePost);
app.post('/delete/:slug', controller.POST.deletePost);
app.get('/view/:slug', controller.viewPost);

exports.app = app;
