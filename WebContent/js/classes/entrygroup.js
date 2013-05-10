/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-10
 * Time: 下午11:04
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// group of Entry
// ==========================
function EntryGroup(container, parent, title) {
    Node.call(this, parent);

    this.container = container;

    this._expand = true;
    var p = this.prefer;

    this.view = parent.view.append('svg:g');

    // title
    this.title = this.view.append('g')
        .classed('expand', true)
        .on('click', this.expand, this);
    this.titlebg = this.title.append('svg:rect')
        .attr({width: p.width, height: p.title});
    this.text = this.title.append('svg:text')
        .attr({x: p.width / 2, y: p.title, dy: -6})
        .text(title);

    // decorate
    this.topline = this.title.append('path')
        .attr('d', sprintf('M0,%f l%f,0', this.prefer['topline-stroke-width'] / 2, p.width))
        .classed('topline', true);

    // children
    this.items = new this.components(this, this.view.append('g').classed('comps', true));
}
_extends(EntryGroup, Node);
/**
 * anonymous container class
 * @type {*}
 */
EntryGroup.prototype.components = Node.createContainer(Entry, {
    constructor: function (p, view) {
        ListNode.call(this, p);
        this.view = view;
        this._height = 0;
    },
    width: function (w) {
        this.getChildren().each(function (node) {
            node.node().width(w);
        });
    },
    position: function (x, y) {
        this.view.attr('transform', sprintf('translate(%f,%f)', x, y));
    },
    filter: function (key) {
        var children = this.getChildren();
        var nodes = children.nodes();
        nodes.each(function (node) {
            node._id = node.node().match(key);
        });

        for (var i = 0, l1 = nodes.length - 1; i < l1; i++) {
            for (var j = i + 1, l2 = nodes.length; j < l2; j++) {
                if (nodes[i]._id < nodes[j]._id) {
                    var n = nodes[i];
                    nodes[i] = nodes[j];
                    nodes[j] = n;
                }
            }
        }

        var height = Entry.prototype.prefer.height;
        var count = 0;
        nodes.each(function (node) {
            var n = node.node();
            n.position(0, height * count);
            n.show();
            count++;
        });
        this._height = count * height;
    },
    height: function () {
        return this._height;
    },
    show: function () {
        this.view.classed('fold', false);
    },
    hide: function () {
        this.view.classed('fold', true);
    }
});
EntryGroup.prototype.filter = function (text) {
    this.items.filter(text);
}
EntryGroup.prototype.direct(function (data) {
    this.items.bind(data);
    this.items.position(0, this.prefer.title);
    this.items.filter('');
});
EntryGroup.prototype.expand = function () {
    this._expand = !this._expand;
    if (this._expand) {
        this.items.show();
    } else {
        this.items.hide();
    }
    this.container.layout();
}
EntryGroup.prototype.prefer = {
    width: 200,
    title: 28,
    minwidth: 100,
    'topline-stroke-width': 2
}
EntryGroup.prototype.position = function (x, y) {
    this.view.attr('transform', sprintf('translate(%f,%f)', x, y));
}
EntryGroup.prototype.height = function (w) {
    return this.prefer.title + (this._expand ? this.items.height() : 0);
}
EntryGroup.prototype.width = function (w) {
    this.titlebg.attr('width', w);
    this.topline.attr('d', sprintf('M0,0 l%f,0', w));
    this.text.attr('x', w / 2);

    this.items.width(w);
}
