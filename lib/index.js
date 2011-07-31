var express = require('express');
var path = require('path');
var mongoStore = require('connect-mongodb');
var blog = require('./controllers/blog');
var auth = require('./controllers/auth');
var Server = require('mongodb').Server
var server_config = new Server('localhost', 27017, {auto_reconnect: true, native_parser: true})
require('./dateFormat.js');

var app = express.createServer();

app.configure(function(){
	app.use(express.cookieParser());
    app.use(express.bodyParser());
	app.use(express.session({
		store: new mongoStore({
			server_config: server_config,
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

app.addRoutes = function(routeList, prefix) {
	var that = this;
	routeList.forEach(function(r) {
		if(r.verb == 'get') {
			that.get(path.join(prefix, r.route), r.fun);
		}
		else if(r.verb == 'post') {
			that.post(path.join(prefix, r.route), r.fun);
		}
	});
}

app.addCMSModule = function(module, prefix) {
	this.addRoutes(module.routes, prefix);
}

exports.app = app;
exports.blog = blog;
exports.auth = auth;
