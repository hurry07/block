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

function _defineClass(super_, props) {
    var c = props.constructor;
    var sub;
    if (c) {
        sub = function () {
            super_.apply(this, arguments);
            c.apply(this, arguments);
        }
    } else {
        sub = function () {
            super_.apply(this, arguments);
        }
    }

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
}
// implement this method to get a id of data
//Node.prototype.identifier = function(data) {
//    return '';
//}
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
/**
 * current data was replacing by data that has the same id.
 * this method will be call only as you supply an identifier.
 *
 * see also Node.prototype.identifier
 *
 * @param dnew
 * @param dold
 */
Node.prototype.bindUpdate = function (dold, dnew) {
}
Node.prototype.bind = function (data) {
    // if this is the first time bind is called
    if (!this.init) {
        if (data) {
            this.create();
            this.init = true;
            this.setData(data);
            this.enter(data);
        } else {
            this.onNullData();
        }
    } else if (data) {
        var dold = this.getData();
        this.setData(data);

        var id = this.identifier;
        if (id && (id(dold) == id(data))) {
            this.bindUpdate(dold, data);
        } else {
            this.update(dold, data);
        }
    } else {
        this.onNullData();
    }
}
Node.prototype.onNullData = function () {
    if (this.init) {
        this.destroy();
    }
}
/**
 * root view where this node's graphic will bind to
 * @returns {*}
 */
Node.prototype.rootView = function () {
    return this.parentNode.view();
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
 * @param dold
 * @param dnew
 */
Node.prototype.update = function (dold, dnew) {
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
    if (!prop.createChild) {
        prop.createChild = function (d) {
            return new type(this);
        }
    }
    if (!prop.identifier) {
        var id = type.prototype.identifier;
        if (id) {
            prop.identifier = id;
        }
    }
    var func = prop.constructor || function (p) {
        ListNode.call(this, p);
    }
    return _extends(func, ListNode, prop);
}
// ==========================================
// ListNode node that take a [] as its data
// ==========================================
function ListNode(parent) {
    Node.call(this, parent);
}
_extends(ListNode, Node);
/**
 * sub class should overwrite this
 * @returns {Node}
 */
ListNode.prototype.createChild = function (d) {
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
    // if this is the first time bind is called
    if (!this.init) {
        if (data) {
            this.create();
            this.init = true;
            this.enter(data);
        } else {
            this.onNullData();
        }
    } else if (data) {
        this.update(data);
    } else {
        this.onNullData();
    }
}
/**
 * sub class should give a specific type, this is like ArrayList<T>
 * @returns {*}
 */
//ListNode.prototype.identifier = function (d) {
//}
ListNode.prototype.enter = function (data) {
    this.listEnter();
    this.data.forEach(function (d, i) {
        var child = this.createChild(d);
        this.setChildId(child, i);
        child.bind(d);
        this.children.push(child);
    }, this);
}
ListNode.prototype.listEnter = function () {
}
/**
 * render order is changed
 */
ListNode.prototype.sortView = function () {
}
ListNode.prototype.update = function (data) {
    var id = this.identifier;
    var children = this.children;
    var m = children.length;
    var n = data.length;

    if (id) {
        var carr = children.slice(0, m);// copy current array
        var cm = new d3.map();

        // map all children
        var remain = [];
        for (var i = 0; i < m; i++) {
            var key = id(children[i].data);
            if (cm.has(key)) {
                remain.push(children[i]);
            } else {
                cm.set(key, children[i]);
            }
        }

        var r = 0;
        var child;
        this.children = [];

        for (var i = 0; i < n; i++) {
            var key = id(data[i]);
            if (cm.has(key)) {
                child = cm.get(key);
                cm.remove(key);
                this.setChildId(child, i);

                var oldd = child.data;
                child.setData(d);
                child.bindUpdate(oldd, d);
            } else if (r < remain.length) {
                this.setChildId(remain[r ], i);

                remain[r].bind(data[i]);
                r++;
            } else {
                child = this.createChild(data[i]);
                this.setChildId(remain[r ], i);

                child.bind(data[i]);
            }

            this.children.push(child);
        }

        for (; r < remain.length; r++) {
            this.destroyChild(remain[i]);
        }
    } else {
        var min = Math.min(m, n);
        for (var i = 0, size = min; i < size; i++) {
            children[i].bind(data[i]);
        }
        // if there is more children than data
        for (var i = min; i < m; i++) {
            this.unbindChild(children[i]);
        }
        // if there is more data than children
        for (var i = min; i < n; i++) {
            var child = this.createChild(data[i]);
            this.setChildId(child, i);
            child.bind(data[i]);
            children.push(child);
        }
    }
}
ListNode.prototype.exit = function () {
    this.children.forEach(this.unbindChild, this);
    this.children = [];
}
ListNode.prototype.appendChild = function (d) {
    var child = this.createChild(d);
    this.setChildId(child, this.children.length);
    child.bind(d);
    this.children.push(child);
    return child;
}
ListNode.prototype.getChildren = function () {
    return this.children;
}
ListNode.prototype.getChild = function (i) {
    return this.children[i];
}
ListNode.prototype.getData = function () {
    var d = [];
    for (var i = 0, c = this.children, l = c.length; i < l; i++) {
        d.push(c[i].getData());
    }
    this.data = d;
    return d;
}
///**
// * recycle children id
// * TODO rewrite with binary tree
// * @param child
// */
//ListNode.prototype.childAdd = function (child) {
//    var id;
//    for (var i = this.startid, children = this.children, l = children.length; i < l; i++) {
//        if ((id = this.getChildId(children[i])) > i) {
//            this.setChildId(child, id - 1);
//            this.children.splice(i, 0, child);
//            this.startid = i;
//            return;
//        }
//    }
//    this.setChildId(child, this.startid = l);
//    this.children.push(child);
//}
ListNode.prototype.childRemove = function (child) {
    var index = this.children.indexOf(child);
    if (index != -1) {
        this.children.splice(index, 1);
    }
}
ListNode.prototype.setChildId = function (c, id) {
    c.__id__ = id;
}
ListNode.prototype.getChildId = function (c) {
    return c.__id__;
}
