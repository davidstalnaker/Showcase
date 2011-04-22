var express = require('express');
var model = require('./model.js')('localhost');
var controller = require('./controller.js')(model);
var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);

	app.set("view engine", "html");
	app.set("view options", {layout: false});
	app.register(".html", require("jqtpl").express);
	
	app.use(express.static(__dirname + '/public'));
});



app.get('/', controller.home);

app.listen(9001);