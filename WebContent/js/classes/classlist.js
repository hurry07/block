/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午6:58
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// items in left
// ==========================
/**
 * {id: 'int', init: 'edit.name' }
 */
function Component(p) {
    Node.call(this, p);
}
_node(Component, Node);
Component.prototype.prefer = {
    width: 200,
    height: 24,
    prefix: 8
}
Component.prototype.getName = function () {
    return this.id;
}
Component.prototype.createView = function () {
    return this.rootView().append('svg:g')
        .classed('comp', true);
}
Component.prototype.enter = function (data) {
    var w = this.prefer.width;
    var h = this.prefer.height;
    var pre = this.prefer.prefix;

    this.bg = this.view.append('svg:rect')
        .attr({width: w, height: h});
    this.text = this.view.append('svg:text')
        .attr({x: pre, y: h, dy: -6})
        .text(data.id);
    this.topline = this.view.append('path')
        .attr('d', sprintf('M0,0 l%f,0', w))
        .classed('topline', true);
}
Component.prototype.update = function (data) {
    this.text.text(data.id);
}
Component.prototype.show = function () {
    this.view.classed({'show': true, 'hide': false});
}
Component.prototype.hide = function () {
    this.view.classed({'show': false, 'hide': true});
}
Component.prototype.match = function (text) {
    if (!text || text.length == 0) {
        this.text.text(this.data.id);
        return 0;
    } else {
        var id = 0;
        this.text.childNodes().remove();
        var start = 0;
        var end = -1;
        var index = 0;
        var content = this.data.id;
        for (var i = 0, l = text.length; i < l; i++) {
            var c = text.charAt(i);
            if ((index = content.indexOf(c, end)) != -1) {
                if (index > end) {
                    if (end > start) {
                        id += (1 << (end - start + 1));
                        this.text.append('tspan').classed('light', true).text(content.substring(start, end));
                        start = end;
                    }
                    if (index > start) {
                        //id -= (1 << (index - start));
                        this.text.append('tspan').text(content.substring(start, index));
                        start = index;
                    }
                }
                end = index + 1;
            } else {
                break;
            }
        }
        if (end > start) {
            id += (1 << (end - start + 1));
            this.text.append('tspan').classed('light', true).text(content.substring(start, end));
            start = end;
        }
        if (content.length > start) {
            if (start > 0) {
                //id -= (1 << (content.length - start));
                this.text.append('tspan').text(content.substring(start));
            } else {
                id = 0;
                this.text.text(content);
            }
        }
        return id;
    }
}
Component.prototype.width = function (w) {
    this.bg.attr('width', w);
    this.topline.path().M(0, 0).l(w, 0).end();
}
Component.prototype.position = function (x, y) {
    this.view.attr('transform', sprintf('translate(%f,%f)', x, y));
}
// ==========================
// group of Component
// ==========================
function ComponentGroup(container, parent, title) {
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
_extends(ComponentGroup, Node);
/**
 * anonymous container class
 * @type {*}
 */
ComponentGroup.prototype.components = Node.createContainer(Component, {
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

        var height = Component.prototype.prefer.height;
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
ComponentGroup.prototype.filter = function (text) {
    this.items.filter(text);
}
ComponentGroup.prototype.direct(function (data) {
    this.items.bind(data);
    this.items.position(0, this.prefer.title);
    this.items.filter('');
});
ComponentGroup.prototype.expand = function () {
    this._expand = !this._expand;
    if (this._expand) {
        this.items.show();
    } else {
        this.items.hide();
    }
    this.container.layout();
}
ComponentGroup.prototype.prefer = {
    width: 200,
    title: 28,
    minwidth: 100,
    'topline-stroke-width': 2
}
ComponentGroup.prototype.position = function (x, y) {
    this.view.attr('transform', sprintf('translate(%f,%f)', x, y));
}
ComponentGroup.prototype.height = function (w) {
    return this.prefer.title + (this._expand ? this.items.height() : 0);
}
ComponentGroup.prototype.width = function (w) {
    this.titlebg.attr('width', w);
    this.topline.attr('d', sprintf('M0,0 l%f,0', w));
    this.text.attr('x', w / 2);

    this.items.width(w);
}
function CompTitle(view) {
    var p = this.prefer;
    this.view = view.append('rect')
        .classed('title', true)
        .attr({width: 200, height: p.height});
}
CompTitle.prototype.width = function (w) {
    this.view.attr('width', w);
}
CompTitle.prototype.height = function () {
    return this.prefer.height;
}
CompTitle.prototype.position = function (x, y) {
    this.view.attr({x: x, y: y});
}
CompTitle.prototype.prefer = {
    height: 12
}
/**
 * @param root parent node
 * @constructor
 */
function ClassManage(root) {
    // init as window component
    WindowComponent.call(this, root.append('g').classed('classes', true), {width: this.prefer.width});

    this.bg = this.view.append('rect')
        .classed('bg', true)
        .attr({width: this.prefer.width, height: 0});
    this.root = Node.wrap(this.view);

    // title search box
    this.title = new CompTitle(this.view);

    this.search = new SearchBox(this.view);
    this.search.input.on('mousedown', this.showSearch, this);
    this.search.button.on('click', this.showHistory, this);

    this.key = '';

    // create default groups
    var items = this._default = new ComponentGroup(this, this.root, 'DEFAULT');
    items.bind(config.types);
    this.customers = [new ComponentGroup(this, this.root, 'CUSTOMER')];
    this.customers[0].bind(config.types);

    this.children = collection(
        this.title,
        this.search,
        this._default,
        this.customers);
    this.comps = collection(
        this._default,
        this.customers);

    // init components's position
    this.layout();
}
//_extends(ClassManage, Action);
_extends(ClassManage, WindowComponent);
ClassManage.prototype.createArea = function () {
    return new Area(this).init(this.prefer.width, 0);
}
ClassManage.prototype.onResize = function () {
    this.view.attr('transform', sprintf('translate(%f,%f)', this.area.x, this.area.y));

    var w = this.area.width();
    this.bg.attr({width: w, height: this.area.height()});
    this.children.iter(function (e) {
        e.width(w);
    });
}
/**
 * return an area that will be resized
 * @returns {Area}
 */
ClassManage.prototype.getArea = function () {
    return this.area;
}
ClassManage.prototype.component = function (pkg) {
    return new Component(this, this.root, pkg);
}
ClassManage.prototype.showSearch = function () {
    // TODO send customer event to svg root element is better
    uiMgr.getGlobal('inputSearch').show(this);
}
ClassManage.prototype.showHistory = function () {
    console.log('showHistory');
}
ClassManage.prototype.prefer = {
    width: 180
}
// ----------------
/**
 * order items on user input
 * @param text
 */
ClassManage.prototype.filter = function (text) {
    this.comps.iter(function (e) {
        e.filter(text);
    });
    this.layout();
}
ClassManage.prototype.layout = function () {
    var h = 0;
    this.children.iter(function (e) {
        e.position(0, h);
        h += e.height();
    });
}
// ----------------
// interact with input
ClassManage.prototype.setText = function (t) {
    var o = this.key;
    this.key = t;
    if (o != t) {
        this.search.text.text(t);
        this.filter(t);
    }
}
/**
 * inter act with edit action
 */
ClassManage.prototype.endEdit = function (input) {
    this.search.text.style('visibility', 'visible');
}
ClassManage.prototype.startEdit = function (input) {
    input.style({'font-size': '22px', 'text-indent': '4px'});
    input.tag().value = this.key;
    this.search.text.style('visibility', 'hidden');
}
ClassManage.prototype.getTarget = function () {
    var node = this.search.inputBg;
    var matrix = Camera.prototype.getMatrix(node.tag(), this.view.tag());
    var p = Camera.prototype.transform(matrix, [0, 0]);
    p.push(node.attr('width'), node.attr('height'));
    return p;
}
