var path = require('path');
var step = require('step');

var ShowcaseModule = require('./../showcaseModule');

function createSlug(title) {
	return title.replace(/[^A-Za-z0-9']+/g, "-").toLowerCase();
}

function incSlug(slug, i) {
	if (i == 1) return slug;
	return slug + '-' + i;
}

function makeSlugUnique(db, slug, callback, i) {
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

function Blog(settings) {
	ShowcaseModule.call(this, path.basename(__dirname), settings);
	var db = this.db
	db.bind('posts', { 
		'createUniqueSlug': function(title, callback) {
			makeSlugUnique(db, createSlug(title), callback);
		}
	});
	this.routes = require("./routes")(this);
}

Blog.prototype = new ShowcaseModule();

Blog.prototype.getPosts = function(callback) {
	this.db.collection('posts').find({}, {sort: [['date', 'desc']]})
		.toArray(callback);
}

Blog.prototype.createPost = function(post) {
	if (!post.title || !post.content) return;
	var that = this;
	step(
		function() {
			var slug = createSlug(post.title);
			makeSlugUnique(that.db, slug, this);
		},
		function(slug) {
			post.slug = slug;
			that.db.posts.insert([post]);
		}
	);
}

Blog.prototype.upsertPost = function(post) {
	var db = this.db;
	var upsert = function(slug) {
		db.posts.update({"slug": slug}, {$set: post}, {upsert: true})
	};
	if (!post.slug) {
		db.posts.createUniqueSlug(post.title, upsert);
	}
	else {
		upsert(post.slug);
	}
}

Blog.prototype.deletePost = function(slug) {
	this.db.posts.remove({'slug': slug});
}

Blog.prototype.getPost = function(slug, callback) {
	this.db.posts.find({'slug': slug}).toArray(function(err, posts) {
		callback(err, posts[0]);
	});
}

module.exports = Blog;
