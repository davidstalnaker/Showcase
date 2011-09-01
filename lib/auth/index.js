var step = require('step');
var bcrypt = require('bcrypt');
var path = require('path');

var ShowcaseModule = require('./../showcaseModule');

function Auth(settings) {
	ShowcaseModule.call(this, path.basename(__dirname), settings);
	this.db.bind('users');
	this.routes = require("./routes")(this);
}

Auth.prototype = new ShowcaseModule();

Auth.prototype.registerUser = function(user, callback) {
	var that = this;
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
			that.db.users.insert(user, {safe: true}, callback);
		}
	);
}

Auth.prototype.getUser = function(user, callback) {
	var that = this;
	var fulluser;
	step(
		function() {
			that.db.users.find({username: user.username}).toArray(this);
		},
		function(err, users) {
			if (users && users.length == 1) {
				fulluser = users[0];
				bcrypt.encrypt(user.password, fulluser.salt, this);
			}
			else {
				callback(null);
			}
		},
		function(err, hash) {
			if (hash === fulluser.hash) {
				callback(fulluser);
			}
			else {
				callback(null);
			}
		}
	);
}

module.exports = Auth;
