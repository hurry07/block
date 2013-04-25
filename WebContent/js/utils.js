/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-4-13
 * Time: 上午11:15
 * To change this template use File | Settings | File Templates.
 */
function DataMap() {
    this.root = arguments[0] || {};
}
/**
 * load data
 * @returns {*}
 */
DataMap.prototype.data = function () {
    if (typeof arguments[0] === 'object') {
        this.root = arguments[0];
    }
    return this.root;
}
/**
 * data access is synchronized
 *
 * @param path
 * @param value if provide, then make sure there is a key with this value, else equals to value(undefined)
 */
DataMap.prototype.value = function (path, value) {
    var node = this.root;
    var isget = arguments.length == 1;
    if(!path) {
        console.log(path);
    }
    if(typeOf(path) != 'string') {
        console.log(path);
    }
    for (var i = 0, paths = path.split('\.'), l = paths.length, e; i < l, e = paths[i]; i++) {
        if (i == l - 1) {
            if (!node.hasOwnProperty(e)) {
                node[e] = undefined;
            }
            if (isget) {
                return node[e];
            } else {
                node[e] = value;
            }
        } else {
            node = (node[e] || (node[e] = {}));
        }
    }
}
DataMap.prototype.del = function (path) {
    var node = this.root;
    for (var i = 0, paths = path.split('\.'), l = paths.length, e; i < l, e = paths[i]; i++) {
        if (i == l - 1) {
            delete node[e];
        } else {
            if (!(node = node[e])) {
                break;
            }
        }
    }
}
DataMap.prototype.clean = function (path) {
    var node = this.root;
    for (var i = 0, paths = path.split('\.'), l = paths.length, e; i < l, e = paths[i]; i++) {
        if (i == l - 1) {
            if (node.hasOwnProperty(e)) {
                if (typeof node[e] === 'object') {
                    var c = node[e];
                    for (var rm in c) {
                        delete c[rm];
                    }
                } else {
                    delete node[e];
                }
            }
        } else {
            if (!(node = node[e])) {
                break;
            }
        }
    }
    return false;
}
DataMap.prototype.has = function (path) {
    var node = this.root;
    for (var i = 0, paths = path.split('\.'), l = paths.length, e; i < l, e = paths[i]; i++) {
        if (i == l - 1) {
            return node.hasOwnProperty(e);
        } else {
            if (!(node = node[e])) {
                break;
            }
        }
    }
    return false;
}
