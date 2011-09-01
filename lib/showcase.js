var express = require('express');
var mongoStore = require('connect-mongodb');
var Server = require('mongodb').Server
var server_config = new Server('localhost', 27017, {auto_reconnect: true, native_parser: true})
var utils = require('./utils');
require('./dateFormat.js');

var ALL_MODULES = ['auth'];

function showcase(settings, module_list) {
	if (settings === undefined)
		settings = {};
	if (module_list === undefined)
		module_list = ALL_MODULES;
	
	var defaults = {
	    database: 'showcase',
	    server: 'localhost',
	    port: 27017,
	};
	
	settings = utils.combine(defaults, settings);
	
	var server = express.createServer();
	server.configure(function() {
		this.use(express.cookieParser());
	    this.use(express.bodyParser());
		this.use(express.session({
			store: new mongoStore({
				server_config: server_config,
				dbname: 'showcase',
				collection: 'sessions',
				reapInterval: 60000 * 10 
			}),
			secret: "8A0fdSAj"
		}));
	    this.use(express.methodOverride());
	    this.use(this.router);

		this.set("view engine", "html");
		this.set("views", __dirname + "/views");
		this.register(".html", require("jqtpl").express);

		this.use(express.static(__dirname + '/public'));
	});
	
	var modules = {};
	module_list.forEach(function(m) {
		var M = require('./' + m);
		modules[m] = new M(settings);
		modules[m].addRoutes(server, "");
	});
	
	return {
		server: server,
		modules: modules
	};
}

module.exports = showcase;
