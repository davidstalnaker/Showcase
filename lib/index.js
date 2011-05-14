var express = require('express');
var mongoStore = require('connect-mongodb');
var blog = require('./controllers/blog');
var auth = require('./controllers/auth');
var utils = require('./utils')
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

app.addRoutes = function(routeList, prefix) {
	var that = this;
	routeList.forEach(function(r) {
		if(r.verb == 'get') {
			that.get(utils.buildPath([prefix, r.route]), r.fun);
		}
		else if(r.verb == 'post') {
			that.post(utils.buildPath([prefix, r.route]), r.fun);
		}
	});
}

app.addCMSModule = function(module, prefix) {
	this.addRoutes(module.routes, prefix);
}

exports.app = app;
exports.blog = blog;
exports.auth = auth;
