var markdown = require('node-markdown').Markdown;
var utils = require('./../utils');

module.exports = function(blog) {
	var get = {
		home: function(req, res) {
			blog.getPosts(function(err, posts) {
				posts.forEach(function(elem, i) {
					elem.renderedContent = markdown(elem.content, true);
				});
				res.render('blog/viewPosts', utils.combine(req.content, {posts: posts}));
			});
		},
		createPost: function(req, res) {
			res.render('blog/editPost', utils.combine(req.content, {post: {}}));
		},
		editPost: function(req, res, next) {
			blog.getPost(req.params.slug, function(err, post) {
				if (post) {
					res.render('blog/editPost', utils.combine(req.content, {post: post}));
				}
				else {
					next();
				}
			});
		},
		deletePost: function(req, res, next) {
			blog.getPost(req.params.slug, function(err, post) {
				if (post) {
					res.render('blog/deletePost', utils.combine(req.content, {post: post}));
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
					res.render('blog/viewPost', utils.combine(req.content, {post: post}));
				}
				else {
					next();
				}
			});
		},
		manage: function(req, res) {
			blog.getPosts(function(err, posts) {
				res.render('blog/manage', utils.combine(req.content, {posts: posts}));
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
