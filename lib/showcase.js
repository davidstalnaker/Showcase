var express = require('express');
	mongoStore = require('connect-mongodb'),
	Server = require('mongodb').Server,
	utils = require('./utils'),
	require('./dateFormat.js');

function showcase(settings, module_list) {
	if (settings === undefined || !('secret' in settings))
		throw "Must provide the \"secret\" setting."
	if (module_list === undefined)
		module_list = ['auth', 'blog'];
	
	var defaults = {
		dbName: 'showcase',
		dbServer: 'localhost',
		dbPort: 27017,
		dir: __dirname + "/../..",
		port: 80,
		defaultUsername: 'Showcase User',
		defaultPassword: 'guest', // Archer anyone?
		blogPrefix: '',
	};
	
	settings = utils.extend(defaults, settings);
	
	var server = express.createServer();
	var app = {
		server: server,
		settings: settings,
		start: function() {
			server.listen(settings.port);
		},
		errors: {
			NotFound: function(msg) {
			    this.name = 'NotFound';
			    Error.call(this, msg);
			    Error.captureStackTrace(this, arguments.callee);
			},
			Unauthorized: function(msg) {
				this.name = 'Unauthorized';
			    Error.call(this, msg);
			    Error.captureStackTrace(this, arguments.callee);
			},
		},
		decorators: {
			loginRequired: function(f) {
				return function(req, res, next) {
					if (req.session.user) {
						f(req, res, next);
					}
					else {
						throw app.errors.Unauthorized();
					}
				};
			},
		},
	};

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

		this.get('/404', function(req, res) {
			res.render('404', { status: 404 });
		})
	});

	module_list.forEach(function(m) {
		var M = require('./' + m);
		app[m] = new M(app);
	});

	return app;
}

module.exports = showcase;
