/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-9
 * Time: 下午9:36
 * To change this template use File | Settings | File Templates.
 */
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
ListNode.prototype.enter = ListNode.prototype.update = function (data) {
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
ListNode.prototype.refresh = function () {
    var children = this.getChildren();
    for (var i = -1, eles = this.getChildren(), len = eles.length; ++i < len;) {
        children[i].refresh();
    }
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
