var fs = require('fs');
var mongo = require('mongoskin');
var path = require('path');

function ShowcaseModule(name, settings) {
	if (arguments.length == 0)
		return;
	this.name = name;
	this.settings = settings;
	this.db = mongo.db(settings.server + ':' + settings.port + '/' +
		settings.database + '?auto_reconnect');
	this.db.open(function(err, coll) {});
}

ShowcaseModule.prototype.findView = function(viewName) {
	var view = path.join(this.name, viewName);
	if (this.settings.viewPath) {
		var altView = path.join(settings.viewPath, viewName) + '.html';
		try {
			if (fs.statSync(altView).isFile()) {
				return altView;
			}
		}
		catch(e) { }
	}
	return view;
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
