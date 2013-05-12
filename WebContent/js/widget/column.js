/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午5:07
 * To change this template use File | Settings | File Templates.
 */
function Cell(p, name) {
    Node.call(this, p);
    this.name = name;
}
_node(Cell, Node);
Cell.prototype.createView = function () {
    return this.rootView().append('g').classed('cell', true);
}
Cell.prototype.enter = function (data) {
    this.rect = this.view.append('rect');
    this.text = this.view.append('text').text('' + data);
}
Cell.prototype.update = function (data) {
    this.text.text(data);
}
Cell.prototype.resize = function (w, h) {
    this.rect.attr({width: w, height: h});
    this.text.attr({x: 0, y: h});
}
Cell.prototype.position = function (x, y) {
    this.view.$t().translate(x, y).end();
}
/**
 * hide text
 */
Cell.prototype.startEdit = function () {
}
/**
 * show text
 */
Cell.prototype.endEdit = function () {
}
/**
 *
 * @param p
 * @param prefer
 * @param adapter cell create adapter
 * @constructor
 */
function Row(p, prefer, adapter) {
    Node.call(this, p);
    this.prefer = prefer;
    this.height = prefer.init.height;
    this.adapter = adapter;
}
_node(Row, Node);
Row.prototype.createView = function () {
    return this.rootView().append('g').classed('row', true);
}
Row.prototype.enter = function (data) {
    var cell;
    var x = 0;
    for (var i = -1, columns = this.prefer.columns, len = columns.length; ++i < len;) {
        var col = columns[i];
        cell = this.adapter.createCell(this, col.name, col.type);
        cell.bind(data[col.name]);
        cell.resize(col.width, this.height);
        cell.position(x, 0);
        x += col.width;
    }
}
Row.prototype.update = function (data) {
    var columns = this.prefer.columns;
    for (var i = -1, cells = this.view.childNodes, len = cells.length; ++i < len;) {
        cells[i].update(data[columns[i].name]);
    }
}
Row.prototype.order = function (prefer) {
}
Row.prototype.position = function (x, y) {
    this.view.$t().translate(x, y).end();
}
