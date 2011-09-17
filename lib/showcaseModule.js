var fs = require('fs'),
	mongo = require('mongoskin'),
	path = require('path');

function ShowcaseModule(name, app) {
	// Check if this is being used to create a prototype or to initialize.
	if (arguments.length == 0)
		return;
	this.name = name;
	this.db = mongo.db(app.settings.dbServer + ':' + app.settings.dbPort + '/'
		+ app.settings.dbName + '?auto_reconnect');
	this.db.open(function(err, coll) {});
	// Initialize routes.
	require('./' + this.name + '/routes')(this, app);
}

module.exports = ShowcaseModule
