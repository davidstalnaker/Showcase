var cms = require('../lib/index');
var app = cms.app;
var blog = cms.blog({}, {});
var auth = cms.auth({}, {});

app.addCMSModule(auth, '');
app.addCMSModule(blog, '');

app.listen(9001);
