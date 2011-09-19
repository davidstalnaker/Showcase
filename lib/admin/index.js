var path = require('path'),
	ShowcaseModule = require('./../showcaseModule');

function Admin(app) {
	ShowcaseModule.call(this, path.basename(__dirname), app);
	this.sections = [];
}

Admin.prototype = new ShowcaseModule();

Admin.prototype.addSection = function(sectionTemplate) {
	this.sections.splice(0, 0, sectionTemplate);
}

module.exports = Admin;
