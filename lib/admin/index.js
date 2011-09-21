var path = require('path'),
	ShowcaseModule = require('./../showcaseModule');

function Admin(app) {
	ShowcaseModule.call(this, path.basename(__dirname), app);
	this.sections = [];
	this.dataGetters = {};
}

Admin.prototype = new ShowcaseModule();

Admin.prototype.addSection = function(sectionTemplate, dataKey, dataGetter) {
	this.sections.splice(0, 0, sectionTemplate);
	if (dataKey && dataGetter) {
		this.dataGetters[dataKey] = dataGetter;
	}
}

module.exports = Admin;
