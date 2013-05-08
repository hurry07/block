if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis || window,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

function _extends(sub, super_, props) {
    sub.prototype = Object.create(super_.prototype);
    if (props) {
        for (var i in props) {
            sub.prototype[i] = props[i];
        }
    }
    sub.prototype.constructor = sub;
    return sub;
}

/**
 * add default crate method
 *
 * @param sub
 * @param super_
 * @param props
 * @returns {*}
 * @private
 */
function _node(sub, super_, props) {
    var type = _extends(sub, super_, props);
    type.create = type.create || function () {
        var node = new (Function.prototype.bind.apply(type, [type].concat(Array.prototype.slice.call(arguments, 0))));
        node.create();
        return node;
    }
    return type;
}
function _defineClass(super_, props) {
    props = props || {};
    var sub = _getOwnProperty(props, 'constructor') || function () {
        super_.apply(this, arguments);
    };
    sub.prototype = Object.create(super_.prototype);
    if (props) {
        for (var i in props) {
            sub.prototype[i] = props[i];
        }
    }
    sub.prototype.constructor = sub;
    return sub;
}
function _getOwnProperty(o, p) {
    if (o.hasOwnProperty(p)) {
        return o[p];
    }
    return undefined;
}

/**
 * used to operate some.path.name = 'value'
 * @constructor
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
/**
 * please be careful not clean your object type property.
 *
 * @param path
 * @returns {boolean}
 */
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
DataMap.prototype.log = function (nodes) {
    nodes.each(function (id) {
        if (this.has(id)) {
            console.log(id, this.value(id));
        }
    }, this);
}
function Collection(elements) {
    this.args = elements;
}
Collection.prototype.iter = function (fn) {
    for (var i = 0, args = this.args, l = args.length; i < l; i++) {
        var arg = args[i];
        if (typeOf(arg) == 'array') {
            for (var j = 0 , cl = arg.length; j < cl; j++) {
                fn(arg[j]);
            }
        } else {
            fn(arg);
        }
    }
}
function collection() {
    return new Collection(Array.prototype.slice.call(arguments, 0));
}
function ctrlKey(event) {
    return event.metaKey || event.ctrlKey;
}