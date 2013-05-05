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
    return this.view;
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
        children.filter(function (tag) {
            return tag.node() != null;
        })

        var reuse = children.nodes();
        children = [];
        var child;
        for (var i = 0; i < n; i++) {
            d = data[i];
            if (r < reuse.length) {
                child = reuse[r].node()
                this.setChildId(child, i);
                child.bindUpdate(d);
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
    return child;
}
// ==========================
// Area stands for a screen area, layout logic will interact with this interface
// ==========================
function Area(x, y, w, h) {
    if (arguments.length == 4) {
        this.x = x;
        this.y = y;
        this._width = w;
        this._height = h;
    } else {
        this.x = this.y = 0;
        this._width = this._height = 0;
    }
}
Area.prototype.size = function (w, h) {
    if (arguments.length == 0) {
        return [this.getWidth(), this.getHeight()];
    }
    this.setWidth(w);
    this.setHeight(h);
}
Area.prototype.position = function (x, y) {
    if (arguments.length == 0) {
        return [this.x , this.y];
    }
    this.x = x;
    this.y = y;
}
Area.prototype.width = function (w) {
    if (arguments.length == 0) {
        return this.getWidth();
    }
    this.setWidth(w);
}
Area.prototype.getWidth = function () {
    return this._width;
}
Area.prototype.setWidth = function (w) {
    this._width = w;
}
Area.prototype.height = function (h) {
    if (arguments.length == 0) {
        return this.getHeight();
    }
    this.setHeight(h);
}
Area.prototype.getHeight = function () {
    return this._height;
}
Area.prototype.setHeight = function (h) {
    this._height = h;
}
Area.prototype.childResize = function (h) {
}
Area.prototype.refresh = function () {
    this.width(this._width);
    this.height(this._height);
}
/**
 * notice current object's size has changed
 */
Area.prototype.resize = function () {
    var p = this.parent;
    if (p) {
        p.childResize(this);
    }
}
// ==========================
// container type
// ==========================
function LinerLayout(d) {
    Area.call(this, 0, 0, 0, 0);
    this.direction = d || 'h';// horizontal
    this.children = [];
}
_extends(LinerLayout, Area);
LinerLayout.prototype.add = function (area, weight) {
    this.children.push({area: area, weight: weight || 0, w: area.width(), h: area.height()});
}
LinerLayout.prototype.remove = function (child) {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            c.splice(i, 1);
            break;
        }
    }
}
LinerLayout.prototype.childResize = function (child) {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            break;
        }
    }
}
LinerLayout.prototype.setWidth = function (w) {
    this.width = w;
    var h = this.h;
    // all element lays in vertical direction
    if (this.direction == 'v') {
        this.children.each(function (e) {
            e.area.size(w, h);
        })
        return;
    }

    var height = this.getHeight();
    this.layout(w, 'width',
        function (child, p) {
            child.size(p, height);
        },
        function (child, p) {
            child.position(p, 0);
        });
}
LinerLayout.prototype.setHeight = function (h) {
    this.height = h;
    var w = this.width;
    // children layout from left to right
    if (this.direction == 'h') {
        this.children.each(function (e) {
            e.area.size(w, h);
        })
        return;
    }

    var width = this.getWidth();
    this.layout(h, 'height',
        function (child, p) {
            child.size(width, p);
        },
        function (child, p) {
            child.position(0, p);
        });
}
LinerLayout.prototype.layout = function (size, f, sizef, pos) {
    var weight = 0;
    var prefer = 0;// prefer size
    var weighted = 0;// weighted size
    var fixed = 0;// fix size
    this.children.each(function (e) {
        if (e.weight == 0) {
            prefer += e.w;
            fixed += e.area[f]();
        } else {
            weighted += e.area[f]();
            weight += e.weight;
        }
    });

    var coor = 0;
    var every = 0;
    if (prefer < size) {
        every = (size - prefer) / weight;
    }
    this.children.each(function (e) {
        if (e.weight == 0) {
            if (size > coor + e.w) {
                pos(e.area, coor);
                sizef(e.area, e.w);
                coor += e.w;
            } else {
                pos(e.area, coor);
                sizef(e.area, size - coor);
                coor = size;
            }
        } else {
            pos(e.area, coor);
            sizef(e.area, e.weight * every);
            coor += e.weight * every;
        }
    });
}
// ==========================
// floating layout
// ==========================
function FrameLayout() {
    Area.call(this, 0, 0, 0, 0);
    this.children = [];
}
_extends(FrameLayout, Area);
/**
 * @param area
 * @param type floating type fixed|relative|expand
 */
FrameLayout.prototype.add = function (area, type, param) {
    this.children.push({area: area, type: type || 'fixed', param: param});
}
FrameLayout.prototype.remove = function () {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            c.splice(i, 1);
            break;
        }
    }
}
FrameLayout.prototype.setWidth = function (w) {
    this.width = w;
    this.children.each(function (e) {
        switch (e.type) {
            case 'fixed':
                break;
            case 'relative':
                this.layoutRelative(e.area, e.param);
                break;
            case 'expand':
                e.area.size(this._width, this._height);
                e.area.position(this.x, this.y);
                break;
        }
    })
}
FrameLayout.prototype.layoutRelative = function (area, param) {
    // TODO not needed currently
}