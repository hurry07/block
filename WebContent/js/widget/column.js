/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午5:07
 * To change this template use File | Settings | File Templates.
 */
function Cell(name) {
}
_node(Cell, Node);
Cell.prototype.createView = function () {
    return this.rootView().append('g').classed('cell', true);
}
Cell.prototype.enter = function () {
    this.rect = this.view.append('rect');
    this.text = this.view.append('text');
}
Cell.prototype.resize = function (w, h) {
    this.view.attr({width: w, height: h});
}
Cell.prototype.position = function (x, y) {
    this.view.attr({width: x, height: y});
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
 * @constructor
 */
function Row(p, prefer) {
    Node.call(this, p, prefer);
    this.prefer = prefer;
}
_node(Row, Node);
Row.prototype.createView = function () {
    return this.rootView().append('g');
}
Row.prototype.enter = function (data) {
    for (var i = -1, columns = this.prefer.columns, len = columns.length; ++i < len;) {
        var col = this.createCell(columns[i]);
        col.bind(data[columns[i].name]);
    }
}
Row.prototype.order = function (prefer) {

}
Row.prototype.getChildren = function () {
    return this.view.selectAll('g > .cell');
}
Row.prototype.createCell = function (prefer) {
    switch (prefer.type) {
        case 'time':
            return new Cell(this.view);
    }
}