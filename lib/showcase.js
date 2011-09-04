var express = require('express');
	mongoStore = require('connect-mongodb'),
	Server = require('mongodb').Server,
	utils = require('./utils'),
	require('./dateFormat.js');

var ALL_MODULES = ['auth', 'blog'];

function showcase(settings, module_list) {
	if (settings === undefined || !('secret' in settings))
		throw "Must provide the \"secret\" setting."
	if (module_list === undefined)
		module_list = ALL_MODULES;
	
	var defaults = {
		dbName: 'showcase',
		dbServer: 'localhost',
		dbPort: 27017,
		dir: __dirname + "/../..",
		port: 80,
		defaultUsername: 'Showcase User',
		defaultPassword: 'guest', // Archer anyone?
	};
	
	settings = utils.extend(defaults, settings);
	
	var server = express.createServer();
	server.configure(function() {
		this.use(express.cookieParser());
		this.use(express.bodyParser());
		this.use(express.session({
			store: new mongoStore({
				server_config: new Server(settings.dbServer, settings.dbPort, {
					auto_reconnect: true, 
					native_parser: true
				}),
				dbname: settings.dbName,
				collection: 'sessions',
				reapInterval: 60000 * 10 
			}),
			secret: settings.secret
		}));
		this.use(express.methodOverride());
		this.use(this.router);

		this.set("view engine", "html");
		this.set("views", __dirname + "/views");
		this.set('view options', {
			layout: settings.dir + '/views/layout'
		});

		this.register(".html", require("jqtpl").express);
		this.use(express.static(settings.dir + '/public'));
		this.dynamicHelpers({
			user: function(req, res) { return req.session.user; },
		});
	});

	var modules = {};
	module_list.forEach(function(m) {
		var M = require('./' + m);
		modules[m] = new M(settings);
		modules[m].addRoutes(server, "");
	});

	return {
		server: server,
		modules: modules,
		start: function() {
			server.listen(settings.port);
		}
	};
}

module.exports = showcase;
