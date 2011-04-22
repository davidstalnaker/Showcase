module.exports = function(server, port) {
	var mongo = require('mongodb');
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
				collection.find(function(err, cursor) {
					cursor.toArray(callback);
				});
			});
		},
		createPost: function(post) {
			db.collection('posts', function(err, collection) {
				collection.insert([post]);
			});
		}
	};
	
}