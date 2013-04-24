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

/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-4-10
 * Time: 下午2:56
 * To change this template use File | Settings | File Templates.
 */
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
    var sub = props.constructor || function () {
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

// ==========================================
// node is used as basic element of MVC
// ==========================================
/**
 * Node is a controller
 * Node.view is the ui selection
 * Node.data is model
 *
 * @param parent
 * @constructor
 */
function Node(parent) {
    this.init = false;
    this.parentNode = parent;
}
// implement this method to get a id of data
//Node.prototype.identifier = function(data) {
//    return '';
//}
/**
 * this method will be called when you supply an 'identifier'
 * you mey overwrite this if you data is very complex.
 * @returns {*}
 */
Node.prototype.getDataId = function () {
    return this.identifier(this.getData());
}
Node.prototype.setData = function (data) {
    this.data = data;
}
Node.prototype.getData = function () {
    return this.data;
}
/**
 * rebind data
 */
Node.prototype.refresh = function () {
    this.bind(this.data);
}
Node.prototype.bindEnter = function (data) {
    this.setData(data);
    this.enter(data);
    this.init = true;
}
Node.prototype.bindUpdate = function (data) {
    var dold = this.getData();
    var id = this.identifier;
    if (id && id(data) == this.getDataId()) {
        this.setData(data);
        this.updateIdentity(dold, data);
    } else {
        this.update(dold, data);
    }
}
Node.prototype.bindIdentity = function (data) {
    var dold = this.getData();
    this.setData(data);
    this.updateIdentity(dold, data);
}
Node.prototype.bind = function (data) {
    if (!this.init) {
        this.bindEnter(data)
        return;
    }
    this.bindUpdate(data);
}
/**
 * root view where this node's graphic will bind to
 * @returns {*}
 */
Node.prototype.rootView = function () {
    return this.parentNode.view;
}
/**
 * init a svg tag slot for future data binding
 */
Node.prototype.create = function () {
    this.view = this.createView();
    this.view.node(this);
}
Node.prototype.createView = function () {
}
/**
 * remove current node from parent node
 */
Node.prototype.destroy = function () {
    this.view.remove();
    this.data = null;
    this.init = false;
}
/**
 * customer ui creating
 */
Node.prototype.enter = function (data) {
}
/**
 * data object was replaced, this.data is already equal to dnew,
 * here you can rewrite current data to old data.
 *
 * @param pred
 * @param d
 */
Node.prototype.update = function (pred, d) {
}
/**
 * current data has the same key with preivous data
 *
 * @param pred
 * @param d
 */
Node.prototype.updateIdentity = function (pred, d) {
    this.update(pred, d);
}
/**
 * you can release customer ui, or you may send some release event
 */
Node.prototype.exit = function () {
}
/**
 * create a empty node
 *
 * @param sel
 * @returns {Node}
 */
Node.wrap = function (sel) {
    var n = new Node(null);
    n.view = sel;
    return n;
}
/**
 * create a Container function with a closure containing certain element type
 *
 * @param type
 * @returns {*}
 */
Node.createContainer = function (type) {
    var prop = arguments[1] || {};
    prop.createChild = prop.createChild || function () {
        var child = new type(this);
        child.create();
        return child;
    }
    prop.identifier && !type.prototype.identifier && (type.prototype.identifier = prop.identifier);
    var func = prop.constructor || function (p, view) {
        ListNode.call(this, p);
        this.view = view;
    }
    return _extends(func, ListNode, prop);
}
// ==========================================
// ListNode node that take a [] as its data
// ==========================================
function ListNode(parent) {
    Node.call(this, parent);
    this.init = true;
}
_extends(ListNode, Node);
/**
 * sub class should overwrite this
 * @returns {Node}
 */
ListNode.prototype.createChild = function () {
    return new Node(this);
}
/**
 * you can implement child cache.
 *
 * @param child
 */
ListNode.prototype.destroyChild = function (child) {
    child.destroy();
}
/**
 * list view will not save data within local field 'data'
 * @param data
 */
ListNode.prototype.bind = function (data) {
    this.update(data);
}
ListNode.prototype.createView = function () {
}
/**
 * sub class should give a specific type, this is like ArrayList<T>
 * @returns {*}
 */
//ListNode.prototype.identifier = function (d) {
//}
ListNode.prototype.enter = function (data) {
}
ListNode.prototype.update = function (data) {
    var id = this.identifier;
    var children = this.getChildren();
    var m = children.length;
    var n = data.length;

    if (id) {
        var reuse = new d3.map();

        // map all children
        var remain = [];
        var node;
        children.filter(function (child, i) {
            if (node = child.node()) {
                var key = node.getDataId();
                if (reuse.has(key)) {
                    remain.push(node);
                } else {
                    reuse.set(key, node);
                }
                return true;
            }
            return false;
        });

        var r = 0;
        var child;
        children = [];
        var d;

        for (var i = 0; i < n; i++) {
            var key = id(d = data[i]);

            if (reuse.has(key)) {
                child = reuse.get(key);
                reuse.remove(key);
                this.setChildId(child, i);

                child.bindIdentity(data);
            } else if (r < remain.length) {
                this.setChildId(child = remain[r], i);
                remain[r].bindUpdate(d);
                r++;
            } else {
                child = this.createChild();
                this.setChildId(remain[r ], i);
                child.bindEnter(d);
            }
            children.push(child);
        }

        for (; r < remain.length; r++) {
            this.destroyChild(remain[i]);
        }
    } else {
        var r = 0;
        var reuse = children.nodes();
        children = [];
        var child;
        for (var i = 0; i < n; i++) {
            d = data[i];
            if (r < reuse.length) {
                this.setChildId(child = reuse[r], i);
                reuse[r].bindUpdate(d);
                r++;
            } else {
                child = this.createChild();
                this.setChildId(child, i);
                child.bindEnter(d);
            }
            children.push(child);
        }
        for (; r < reuse.length; r++) {
            this.destroyChild(reuse[i]);
        }
    }
    this.updateEnd(children);
}
ListNode.prototype.exit = function () {
    this.getChildren().each(function (node) {
        node.remove();
    });
}
ListNode.prototype.getChildren = function () {
    return this.view.childNodes();
}
ListNode.prototype.updateEnd = function (children) {
}
ListNode.prototype.setChildId = function (c, id) {
    c.__id__ = id;
}
ListNode.prototype.getChildId = function (c) {
    return c.__id__;
}
ListNode.prototype.bindChild = function (d) {
    var id = this.getChildren().length;
    var child = this.createChild();
    this.setChildId(child, id);
    child.bindEnter(d);
}