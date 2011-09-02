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
			res.render('auth/logout');
		},
		register: function(req, res) {
			res.render('auth/register');
		}
	}
	var post = {
		login: function(req, res) {
			auth.getUser({
				username: req.body.username,
				password: req.body.password
			},
			function(user) {
				if (user) {
					req.session.user = user;
				}
				res.redirect('/');
			});	
		},
		register: function(req, res) {
			auth.registerUser({
				username: req.body.username,
				password: req.body.password
			},
			function() {
				res.redirect('/');
			});
		}
	};
	return [
		{ verb: 'get',  route: '*',         func: get.checkSession },
		{ verb: 'get',  route: '/login',    func: get.login },
		{ verb: 'post', route: '/login',    func: post.login },
		{ verb: 'get',  route: '/logout',   func: get.logout },
		{ verb: 'get',  route: '/register', func: get.register },
		{ verb: 'post', route: '/register', func: post.register }
	];
}
