/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午6:58
 * To change this template use File | Settings | File Templates.
 */
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
    var items = this._default = new EntryGroup(this, this.root, 'DEFAULT');
    items.bind(config.types);
    this.customers = [new EntryGroup(this, this.root, 'CUSTOMER')];
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
    return new Entry(this, this.root, pkg);
}
ClassManage.prototype.showSearch = function () {
    // TODO send customer event to svg root element is better
    this.manager.findWidget('inputSearch').show(this);
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
