module.exports = function(admin, app) {
	admin.get = {
		admin: function(req, res) {
			if (req.session.user) {
				var templateData = {sections: admin.sections};
				var dataGetters = admin.dataGetters;
				function getData(i) {
					console.log(i);
					var keys = Object.keys(dataGetters);
					console.log(keys);
					if (keys.length > i) {
						var k = keys[i];
						dataGetters[k](function(data) {
							templateData[k] = data;
							getData(i + 1);
						});
					}
					else {
						console.log('rendering template...');
						console.log(templateData);
						res.render('admin', templateData);
					}
				}
				getData(0);
			}
			else {
				res.redirect('/login');
			}
		},
	};
	admin.post = {};
	app.server.get('/admin', admin.get.admin);
}
