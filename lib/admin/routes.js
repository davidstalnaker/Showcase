module.exports = function(admin, app) {
	admin.get = {
		admin: function(req, res) {
			if (req.session.user) {
				res.render('admin', {sections: admin.sections});
			}
			else {
				res.redirect('/login');
			}
		},
	};
	admin.post = {};
	app.server.get('/admin', admin.get.admin);
}
