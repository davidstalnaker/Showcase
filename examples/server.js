var showcase = require('../lib/showcase')();
var app = showcase.server;

app.set('view options', {
	layout: __dirname + '/views/layout'
});

app.listen(9001);
