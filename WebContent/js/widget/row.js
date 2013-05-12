/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午5:07
 * To change this template use File | Settings | File Templates.
 */
function Row(p) {
    Node.call(this, p);
}
_extends(Row, Node);
Row.prototype.enter = function (data) {
    var cell;
    var x = 0;
    for (var i = -1, columns = this.columns, len = columns.length; ++i < len;) {
        var col = columns[i];
        cell = this.createCell(col);
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
/**
 * should be supplied by sheet
 *
 * @param column
 * @returns {Cell}
 */
Row.prototype.createCell = function (column) {
    return new Cell(this, column);
}
Row.prototype.createView = function () {
    return this.rootView().append('g').classed('row', true);
}
