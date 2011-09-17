var utils = require('../utils');

module.exports = function(auth, app) {
	auth.get = {
		login: function(req, res) {
			res.render('auth/login');
		},
		logout: function(req, res) {
			req.session.destroy();
			res.redirect('/');
		},
		modify: function(req, res) {		
			res.render('auth/modify');
		}
	};
	auth.post = {
		login: function(req, res, next) {
			auth.authenticateUser(req.body.password, function(user) {
				if (user) {
					req.session.user = user;
					res.redirect('/');
				}
				else {
					res.send(401);
				}
			});	
		},
		modify: function(req, res) {
			auth.modifyUser(req.session.user, req.body.oldPassword, {
				username: req.body.username,
				password: req.body.newPassword
			}, function() {
				res.redirect('/');
			});
		}
	};
	app.server.get( '/login',   auth.get.login);
	app.server.post('/login',   auth.post.login);
	app.server.get( '/logout',  auth.get.logout);
	app.server.get( '/account', auth.get.modify);
	app.server.post('/account', auth.post.modify);
}
