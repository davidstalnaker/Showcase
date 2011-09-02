var markdown = require('node-markdown').Markdown;

module.exports = function(blog) {
	var get = {
		home: function(req, res) {
			blog.getPosts(function(err, posts) {
				posts.forEach(function(elem, i) {
					elem.renderedContent = markdown(elem.content, true);
				});
				res.local('posts', posts);
				res.render('blog/viewPosts');
			});
		},
		createPost: function(req, res) {
			res.local('post', {});
			res.render('blog/editPost');
		},
		editPost: function(req, res, next) {
			blog.getPost(req.params.slug, function(err, post) {
				if (post) {
					res.local('post', post);
					res.render('blog/editPost');
				}
				else {
					next();
				}
			});
		},
		deletePost: function(req, res, next) {
			blog.getPost(req.params.slug, function(err, post) {
				if (post) {
					res.local('post', post);
					res.render('blog/deletePost');
				}
				else {
					next();
				}
			});
		},
		viewPost: function(req, res, next) {
			blog.getPost(req.params.slug, function(err, post) {
				if (post) {
					post.renderedContent = markdown(post.content, true);
					res.local('post', post);
					res.render('blog/viewPost');
				}
				else {
					next();
				}
			});
		},
		manage: function(req, res) {
			blog.getPosts(function(err, posts) {
				res.local('posts', posts);
				res.render('blog/manage');
			});
		}
	}
	var post = {
		editPost: function(req, res) {
			if (req.body.slug) {
				blog.upsertPost({
					"slug": req.body.slug,
					"title": req.body.title,
					"content": req.body.content
				});
			}
			else {
				blog.upsertPost({
					"title": req.body.title,
					"content": req.body.content,
					"date": new Date()
				});
			}
			res.redirect('/');
		},
		deletePost: function(req, res) {
			blog.deletePost(req.params.slug);
			res.redirect('/');
		}
	};
	return [
		{ verb: 'get',  route: '/',             func: get.home },
		{ verb: 'get',  route: '/manage',       func: get.manage },
		{ verb: 'get',  route: '/create',       func: get.createPost },
		{ verb: 'post', route: '/create',       func: post.editPost },
		{ verb: 'get',  route: '/edit/:slug',   func: get.editPost },
		{ verb: 'post', route: '/edit/:slug',   func: post.editPost },
		{ verb: 'get',  route: '/delete/:slug', func: get.deletePost },
		{ verb: 'post', route: '/delete/:slug', func: post.deletePost },
		{ verb: 'get',  route: '/view/:slug',   func: get.viewPost }
	];
}
