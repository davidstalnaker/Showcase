var express = require('express');
var model = require('./model.js')('localhost');
var controller = require('./controller.js')(model);
var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);

	app.set("view engine", "html");
	app.register(".html", require("jqtpl").express);
	
	app.use(express.static(__dirname + '/public'));
});



app.get('/', controller.home);
app.get('/create', controller.createPost);
app.post('/create', controller.postCreatePost);

app.listen(9001);