var showcase = require('../lib/showcase')({
	dir: __dirname,
	port: 9001,
	secret: "abcdefgh",
});
showcase.start();
