var utils = require('../utils');

module.exports = function(auth) {
	var get = {
		checkSession: function(req, res, next) {
			if (req.session && req.session.user) {
				res.local('username', req.session.user.username);
			}
			next();
		},
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
	}
	var post = {
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
	return [
		{ verb: 'get',  route: '*',        func: get.checkSession },
		{ verb: 'get',  route: '/login',   func: get.login },
		{ verb: 'post', route: '/login',   func: post.login },
		{ verb: 'get',  route: '/logout',  func: get.logout },
		{ verb: 'get',  route: '/account', func: get.modify },
		{ verb: 'post', route: '/account', func: post.modify }
	];
}
