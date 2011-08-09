/**
 * Random utility functions used in Showcase.
 */

module.exports = {
    /** Naively combines the properties of two objects. */
    combine: function(obj1, obj2) {
        var newObj = {};
        for (k in obj1) newObj[k] = obj1[k];
        for (k in obj2) newObj[k] = obj2[k];
        return newObj;
    }
};
