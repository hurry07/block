// ==========================
// render basic
// ==========================
/**
 * describe a drawable area
 *
 * @param w
 * @param h
 * @param view
 * @constructor
 */
function Sprite(w, h, view) {
    this.width = w;
    this.height = h;
    this.view = view;
    this.scalex = this.scaley = 1;
    this.x = this.y = 0;
    this.centerx = this.centery = 0;
}
Sprite.prototype.update = function () {
    this.view.attr('transform', sprintf('translate(%f,%f) scale(%f,%f)',
        this.x - this.width * this.centerx * this.scalex,
        this.y - this.height * this.centery * this.scaley,
        this.scalex,
        this.scaley));
}
Sprite.prototype.setScale = function (sx, sy) {
    if (arguments.length == 1) {
        sy = sx;
    }
    this.scalex = sx;
    this.scaley = sy;
    this.update();
}
Sprite.prototype.setCenter = function (cx, cy) {
    this.centerx = cx;
    this.centery = cy;
    this.update();
}
/**
 * {x, y}
 */
Sprite.prototype.setPositon = function (x, y) {
    this.x = x;
    this.y = y;
    this.update();
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
Node.prototype.direct = function (fn) {
    return this.bindIdentity = this.bindUpdate = this.bindEnter = this.bind = fn;
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
    return this.view;
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
 * interact with Action, return will use as an Action adapter
 * @param id
 * @returns {null}
 */
Node.prototype.getFeature = function (id) {
    return null;
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
    var func = _getOwnProperty(prop, 'constructor') || function (p, view) {
        ListNode.call(this, p);
        this.view = view;
    }
    return _extends(func, ListNode, prop);
}
