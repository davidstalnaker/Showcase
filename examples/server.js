var showcase = require('../lib/showcase');
var app = showcase.app;
var blog = showcase.blog({}, {});
var auth = showcase.auth({}, {});

app.set('view options', {
	layout: __dirname + '/views/layout'
});

app.addCMSModule(auth, '');
app.addCMSModule(blog, '');

app.listen(9001);
