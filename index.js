var express = require('express');
var model = require('./model.js')('localhost');
var controller = require('./controller.js')(model);
require('./dateFormat.js');

var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);

	app.set("view engine", "html");
	app.set("views", __dirname + "/views");
	app.register(".html", require("jqtpl").express);
	
	app.use(express.static(__dirname + '/public'));
});

app.get('/', controller.home);
app.get('/create', controller.createPost);
app.post('/create', controller.postCreatePost);
app.get('/view/:slug', controller.viewPost);

exports.app = app;
