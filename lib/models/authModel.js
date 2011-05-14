var mongo = require('mongoskin');
var step = require('step');
var utils = require('./../utils.js');
var bcrypt = require('bcrypt');

module.exports = function(settings) {
	
	var defaults = {
		database: 'cms',
		server: 'localhost',
		port: 27017,
	};
	
	settings = utils.combine(defaults, settings);
	
	var db = mongo.db(settings.server + ':' + settings.port + '/' + settings.database + '?auto_reconnect');
	db.open(function(err, coll) {});
	db.bind('users');
	
	return {
		registerUser: function(user, callback) {
			step(
				function() {
					bcrypt.gen_salt(10, this);
				},
				function(err, salt) {
					user.salt = salt;
					bcrypt.encrypt(user.password, user.salt, this);
				},
				function(err, hash) {
					user.hash = hash;
					delete user.password;
					db.users.insert(user, {safe: true}, callback)
				}
			);
		},
		getUser: function(user, callback) {
			var fulluser;
			step(
				function() {
					db.users.find({username: user.username}).toArray(this);
				},
				function(err, users) {
					if(users && users.length == 1) {
						fulluser = users[0];
						bcrypt.encrypt(user.password, fulluser.salt, this);
					}
					else {
						callback(null);
					}
				},
				function(err, hash) {
					
					if(hash === fulluser.hash) {
						callback(fulluser);
					}
					else {
						callback(null);
					}
				}
				
			);
		}
	};
	
}
