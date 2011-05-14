var markdown = require('node-markdown').Markdown;
var controller = require('./../controller');
var utils = require('./../utils');

module.exports = function(settings, dbSettings) {
	var defaults = {
		module: 'blog',
		viewPath: undefined
	}
	settings = utils.combine(defaults, settings);
	
	var that = controller('blog', settings, dbSettings);
	that.get = {
		home: function(req, res) {
			that.model.getPosts(function(err, posts) {
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
			that.model.getPost(req.params.slug, function(err, post) {
				if(post){
					res.render('blog/editPost', utils.combine(req.content, {post: post}));
				}
				else {
					next();
				}
			});
		},
		deletePost: function(req, res, next) {
			that.model.getPost(req.params.slug, function(err, post) {
				if(post){
					res.render('blog/deletePost', utils.combine(req.content, {post: post}));
				}
				else {
					next();
				}
			});
		},
		viewPost: function(req, res, next) {
			that.model.getPost(req.params.slug, function(err, post) {
				if(post){
					post.renderedContent = markdown(post.content, true);
					res.render('blog/viewPost', utils.combine(req.content, {post: post}));
				}
				else {
					next();
				}
			});
		},
		manage: function(req, res) {
			that.model.getPosts(function(err, posts) {
				res.render('blog/manage', utils.combine(req.content, {posts: posts}));
			});
		}
	}
	that.post = {
		editPost: function(req, res) {
			if(req.body.slug) {
				that.model.upsertPost({
					"slug": req.body.slug,
					"title": req.body.title,
					"content": req.body.content
				});
			}
			else {
				that.model.upsertPost({
					"title": req.body.title,
					"content": req.body.content,
					"date": new Date()
				});
			}
			res.redirect('/');
		},
		deletePost: function(req, res) {
			that.model.deletePost(req.params.slug);
			res.redirect('/');
		}
	};
	that.routes = [
		{ verb: 'get', route: '/', fun: that.get.home },
		{ verb: 'get', route: '/manage', fun: that.get.manage },
		{ verb: 'get', route: '/create', fun: that.get.createPost },
		{ verb: 'post', route: '/create', fun: that.post.editPost },
		{ verb: 'get', route: '/edit/:slug', fun: that.get.editPost },
		{ verb: 'post', route: '/edit/:slug', fun: that.post.editPost },
		{ verb: 'get', route: '/delete/:slug', fun: that.get.deletePost },
		{ verb: 'post', route: '/delete/:slug', fun: that.post.deletePost },
		{ verb: 'get', route: '/view/:slug', fun: that.get.viewPost }
	];
	return that;
}
