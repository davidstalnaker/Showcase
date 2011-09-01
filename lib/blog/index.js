var step = require('step');
var utils = require('./../utils.js');

module.exports = function(settings) {
	
	var defaults = {
	    database: 'showcase',
	    server: 'localhost',
	    port: 27017,
	};
	
	settings = utils.combine(defaults, settings);
	
	var db = mongo.db(settings.server + ':' + settings.port + '/' + settings.database + '?auto_reconnect');
	db.open(function(err, coll) {});
	db.bind('posts');
    
	var createSlug = function(title) {
		return title.replace(/[^A-Za-z0-9']+/g, "-").toLowerCase();
	}
	
	var incSlug = function(slug, i) {
		if (i == 1) return slug;
		return slug + '-' + i;
	}

	var makeSlugUnique = function(slug, callback, i) {
		i = i || 1;
		db.posts.count({'slug': incSlug(slug, i)}, function(err, count) {
			if (count < 1) {
				callback(incSlug(slug, i));
			}
			else {
				makeSlugUnique(slug, callback, ++i);
			}
		});
	}
	
	db.bind('posts', { 
		'createUniqueSlug': function(title, callback) {
			makeSlugUnique(createSlug(title), callback);
		}
	});
	
	return {
		getPosts: function(callback) {
			db.collection('posts').find({},{sort:[['date','desc']]}).toArray(callback);
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
					db.posts.insert([post]);
				}
			);
		 
		},
		upsertPost: function(post) {
			var upsert = function(slug) {
				db.posts.update({"slug": slug}, {$set: post}, {upsert: true})
			};
			if(!post.slug) {
				db.posts.createUniqueSlug(post.title, upsert);
			}
			else {
				upsert(post.slug);
			}
		},
		deletePost: function(slug) {
			db.posts.remove({'slug': slug});
		},
		getPost: function(slug, callback) {
			db.posts.find({'slug': slug}).toArray(function(err, posts) {
				callback(err, posts[0]);
			});
		}
	};	
}
