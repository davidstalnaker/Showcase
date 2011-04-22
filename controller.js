module.exports = function(model) {
	return {
		home: function(req, res) {
			model.getPosts(function(err, posts) {
				res.render('home', { posts: posts });
			});
		}
	};
}

