var step = require('step'),
	bcrypt = require('bcrypt'),
	path = require('path'),
	utils = require('../utils'),
	ShowcaseModule = require('./../showcaseModule');

function hashPassword(user, callback) {
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
			callback(user);
		}
	);
}

function Auth(app) {
	ShowcaseModule.call(this, path.basename(__dirname), app);
	var db = this.db;
	db.bind('users');
	db.users.find({}).toArray(function(err, users) {
		if (users.length === 0) {
			hashPassword({
				username: app.settings.defaultUsername,
				password: app.settings.defaultPassword
			}, function(user) {
				db.users.insert(user, {safe: true});
			});
		}
		else if (users.length > 1) {
			console.log("WARNING: there should not be more than one user!");
		}
	});
}

Auth.prototype = new ShowcaseModule();

Auth.prototype.authenticatePassword = function(user, password, callback) {
	bcrypt.encrypt(password, user.salt, function(err, hash) {
		callback(hash === user.hash, user);
	});
}

Auth.prototype.authenticateUser = function(password, callback) {
	var that = this;
	step(
		function() {
			that.db.users.find().toArray(this);
		},
		function(err, users) {
			if (users && users.length == 1) {
				that.authenticatePassword(users[0], password, this);
			}
			else {
				callback(null);
			}
		},
		function(success, user) {
			callback(success ? user : null);
		}
	);
}

Auth.prototype.modifyUser = function(user, password, newUser, callback) {
	var db = this.db;
	this.authenticatePassword(user, password, function(authenticated) {
		if (authenticated) {
			hashPassword(utils.extend(user, newUser), function(user) {
				// Convert ID back from a string.
				user._id = db.users.id(user._id);
				db.users.save(user, {safe: true}, callback);
			});
		}
		else {
			throw "Invalid password";
		}
	});
}

module.exports = Auth;
