var cms = require('../lib/index');
var app = cms.app;
var blog = cms.blog({}, {});
var auth = cms.auth({}, {});

app.set('view options', {
	layout: __dirname + '/views/layout'
});

app.addCMSModule(auth, '');
app.addCMSModule(blog, '');

app.listen(9001);
