var controller = require('./../controller');
var utils = require('./../utils');



module.exports = function(settings, dbSettings) {
	var defaults = {
		module: 'auth',
		viewPath: undefined
	}
	settings = utils.combine(defaults, settings);
	
	that = controller('auth', settings, dbSettings);
	
	that.get = {
		checkSession: function(req, res, next) {
			if(req.session && req.session.user) {
				req.content = utils.combine(req.content, {username: req.session.user.username});
			}
			next();
		},
		login: function(req, res, next) {
			console.log(__dirname);
			res.render(that.findView('login'), req.content);
		},
		logout: function(req, res, next) {
			console.log(this);
			req.session.destroy();
			res.render(that.findView('logout'));
		},
		register: function(req, res) {
			res.render(that.findView('register'), req.content);
		}
	}
	that.post = {
		register: function(req, res) {
			model.registerUser({
				username: req.body.username,
				password: req.body.password
			},
			function() {
				res.redirect('/');
			});
		},
		login: function(req, res) {
			model.getUser({
				username: req.body.username,
				password: req.body.password
			},
			function(user) {
				if(user) {
					req.session.user = user;
				}
				res.redirect('/');
			});	
		}
	};
	that.routes = [
		{ verb: 'get', route: '*', fun: that.get.checkSession },
		{ verb: 'get', route: '/login', fun: that.get.login },
		{ verb: 'post', route: '/login', fun: that.post.login },
		{ verb: 'get', route: '/logout', fun: that.get.logout },
		{ verb: 'get', route: '/register', fun: that.get.register },
		{ verb: 'post', route: '/register', fun: that.post.register }
	];
	return that;
}
