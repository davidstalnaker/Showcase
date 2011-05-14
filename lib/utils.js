

module.exports = {
    combine: function(obj1, obj2) {
        var newObj = {};
        for (k in obj1) newObj[k] = obj1[k];
        for (k in obj2) newObj[k] = obj2[k];
        return newObj;
    },
	concatPaths: function(p1, p2) {
		if(p1 == '') return p2;
		if(p2 == '') return p1;
		if(p1.charAt(p1.length - 1) == '/') {
			p1 = p1.slice(0, -1);
		}
		if(p2.charAt(0) == '/') {
			p2 = p2.slice(1);
		}
		return p1 + '/' + p2;
	},
	buildPath: function(paths) {
		return paths.reduce(function(prev, curr) {
			return module.exports.concatPaths(prev, curr);
		}, '');
	}
};
