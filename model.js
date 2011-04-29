module.exports = function(server, port) {
	var mongo = require('mongodb');
	var step = require('step');
	
	var createSlug = function(title) {
		return title.replace(/[^A-Za-z0-9']+/g, "-").toLowerCase();
	}
	
	var incSlug = function(slug, i) {
		if (i == 1) return slug;
		return slug + '-' + i;
	}

	var makeSlugUnique = function(slug, callback, i) {
		i = i || 1;
		step(
			function() {
				db.collection('posts', this);
			},
			function(err, collection) {
				collection.count({'slug': incSlug(slug, i)}, this);
			},
			function(err, count) {
				if (count < 1) {
					callback(incSlug(slug, i));
				}
				else {
					makeSlugUnique(slug, callback, ++i);
				}
			}
		);
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
			step(
				function() {
					db.collection('posts', this);
				},	
				function(err, collection) {
					collection.find({},{sort:[['date','desc']]}, this);
				},	
				function(err, cursor) {
					cursor.toArray(callback);
				}
			);
		},
		createPost: function(post) {
			if(!post.title || !post.content) return;
			step(
				function() {
					var slug = createSlug(post.title);
					makeSlugUnique(slug, this);
				},
				function(slug) {
					post.slug = slug;
					db.collection('posts', this);
				},
				function(err, collection) {
					collection.insert([post]);
				}
			);
		 
		},
		getPost: function(slug, callback) {
			step(
				function() {
					db.collection('posts',	this);
				},
				function(err, collection) {
					collection.find({'slug': slug}, this);
				},
				function(err, cursor) {
					cursor.toArray(this);
				},
				function(err, posts) {
					callback(err, posts[0]);
				}
			);
		}
	};
	
}