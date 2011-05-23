var fs = require('fs');
var path = require('path');

module.exports = function(name, settings, dbSettings) {
	var that = {};
	that.settings = settings;
	that.model = require('./models/' + name + "Model")(dbSettings);
	
	that.findView = function(viewName) {
		var view = path.join(name, viewName);
		if(settings.viewPath) {
			var altView = path.join(settings.viewPath, viewName) + '.html';
			
			try {
				if(fs.statSync(altView).isFile()) {
					return altView;
				}
			}
			catch(e) { }
		}
		return view;
	}
	
	return that;
}