module.exports = function(server, port) {
	var mongo = require('mongodb');
	
	var createSlug = function(title) {
		return title.replace(/[^A-Za-z0-9']+/g, "-").toLowerCase();
	}
	
	var incSlug = function(slug, i) {
		if(i != 1) {
			return slug + '-' + i;
		}
		else {
			return slug;
		}
	}

	var makeSlugUnique = function(slug, callback, i) {
		i = i || 1;
		db.collection('posts', function(err, collection) {
			collection.count({'slug': incSlug(slug, i)}, function(err, count) {
				if(count < 1) {
					callback(incSlug(slug, i));
				}
				else {
					makeSlugUnique(slug, callback, ++i);
				}
			});
		});
	}
	
	if(! port) port = mongo.Connection.DEFAULT_PORT;
	var db = new mongo.Db(
		'cms', 
		new mongo.Server(
			server, 
			port, 
			{auto_reconnect: true}), 
		{native_parser:true}
	);
	db.open(function() {});
	
	return {
		getPosts: function(callback) {
			db.collection('posts', function(err, collection) {
				collection.find({},{sort:[['date','desc']]}, function(err, cursor) {
					cursor.toArray(callback);
				});
			});
		},
		createPost: function(post) {
			if(post.title && post.content) {
				var slug = createSlug(post.title);
				makeSlugUnique(slug, function(s) {
					post.slug = s;
					db.collection('posts', function(err, collection) {
						collection.insert([post]);
					});
				})
			};
		},
		getPost: function(slug, callback) {
			db.collection('posts', function(err, collection) {
				collection.find({'slug': slug}, function(err, cursor) {
					cursor.toArray(function(err, posts) {
						callback(err, posts[0]);
					});
				});
			});
		}
	};
	
}