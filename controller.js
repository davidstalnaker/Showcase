var markdown = require('node-markdown').Markdown;

module.exports = function(model) {
	return {
		home: function(req, res) {
			model.getPosts(function(err, posts) {
				posts.forEach(function(elem, i) {
					elem.renderedContent = markdown(elem.content, true);
				});
				res.render('home', { posts: posts, username: (req.session.user) ? req.session.user.username : null});
			});
		},
		createPost: function(req, res) {
			res.render('editPost', {post: {}});
		},
		editPost: function(req, res, next) {
			model.getPost(req.params.slug, function(err, post) {
				if(post){
					res.render('editPost', {post: post});
				}
				else {
					next();
				}
			});
		},
		deletePost: function(req, res, next) {
			model.getPost(req.params.slug, function(err, post) {
				if(post){
					res.render('deletePost', {post: post});
				}
				else {
					next();
				}
			});
		},
		viewPost: function(req, res, next) {
			model.getPost(req.params.slug, function(err, post) {
				if(post){
					post.renderedContent = markdown(post.content, true);
					res.render('viewPost', {post: post});
				}
				else {
					next();
				}
			});
		},
		manage: function(req, res) {
			model.getPosts(function(err, posts) {
				res.render('manage', { posts: posts });
			});
		},
		login: function(req, res, next) {
			res.render('login');
		},
		logout: function(req, res, next) {
			req.session.destroy();
			res.render('logout');
		},
		register: function(req, res) {
			res.render('register');
		},
		POST: {
			editPost: function(req, res) {
				if(req.body.slug) {
					model.upsertPost({
						"slug": req.body.slug,
						"title": req.body.title,
						"content": req.body.content
					});
				}
				else {
					model.upsertPost({
						"title": req.body.title,
						"content": req.body.content,
						"date": new Date()
					});
				}
				res.redirect('/');
			},
			deletePost: function(req, res) {
				model.deletePost(req.params.slug);
				res.redirect('/');
			},
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
						console.log(user);
						req.session.user = user;
					}
					res.redirect('/');
				});
				
			}
		}
	};
}

