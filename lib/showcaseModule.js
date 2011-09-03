var fs = require('fs'),
	mongo = require('mongoskin'),
	path = require('path');

function ShowcaseModule(name, settings) {
	// Check if this is being used to create a prototype or to initialize.
	if (arguments.length == 0)
		return;
	this.name = name;
	this.settings = settings;
	this.db = mongo.db(settings.dbServer + ':' + settings.dbPort + '/' +
		settings.dbName + '?auto_reconnect');
	this.db.open(function(err, coll) {});
}

ShowcaseModule.prototype.addRoutes = function(server, prefix) {
	this.routes.forEach(function(r) {
		if (r.verb == 'get') {
			server.get(path.join(prefix, r.route), r.func);
		}
		else if (r.verb == 'post') {
			server.post(path.join(prefix, r.route), r.func);
		}
	});
}

module.exports = ShowcaseModule
