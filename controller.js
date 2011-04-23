module.exports = function(model) {
	return {
		home: function(req, res) {
			model.getPosts(function(err, posts) {
				res.render('home', { posts: posts });
			});
		},
		createPost: function(req, res) {
			res.render('createPost');
		},
		postCreatePost: function(req, res) {
			model.createPost({
				"title": req.body.title,
				"content": req.body.content,
				"date": new Date()
			});
			res.redirect('/');
		},
		viewPost: function(req, res, next) {
			model.getPost(req.params.slug, function(err, post) {
				if(post){
					res.render('viewPost', {post: post});
				}
				else {
					next();
				}
			});
		}
	};
}

