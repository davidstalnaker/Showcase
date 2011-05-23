

module.exports = {
    combine: function(obj1, obj2) {
        var newObj = {};
        for (k in obj1) newObj[k] = obj1[k];
        for (k in obj2) newObj[k] = obj2[k];
        return newObj;
    }
};
