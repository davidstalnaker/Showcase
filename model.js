var mongo = require('mongodb');
var step = require('step');
var utils = require('./utils.js');

module.exports = function(settings) {
	
	var defaults = {
	    database: 'cms',
	    server: 'localhost',
	    port: mongo.Connection.DEFAULT_PORT,
	};
	
	settings = utils.combine(defaults, settings);
	
	var db = new mongo.Db(
		settings.database, 
		new mongo.Server(
			settings.server, 
			settings.port, 
			{auto_reconnect: true}), 
		{native_parser:true}
	);
	db.open(function() {});
    
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
		upsertPost: function(post) {
			step(
				function() {
					if(!post.slug) {
						var slug = createSlug(post.title);
						makeSlugUnique(slug, this);
					}
					else {
						this();	
					}
				},
				function(slug) {
					if(slug) post.slug = slug;
					db.collection('posts', this);
				},
				function(err, collection) {
					collection.update({"slug": post.slug}, {$set: post}, {upsert: true});
				}
			);
		},
		deletePost: function(slug) {
			step(
				function() {
					db.collection('posts',	this);
				},
				function(err, collection) {
					collection.remove({'slug': slug}, this);
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
