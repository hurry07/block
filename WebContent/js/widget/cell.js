/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-12
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */
/**
 * is render of text
 * @param p
 * @param column
 * @constructor
 */
function Cell(p, column) {
    Node.call(this, p);
    this.column = column;
}
_extends(Cell, Node);
Cell.prototype.createView = function () {
    return this.rootView().append('g').classed('cell', true);
}
Cell.prototype.enter = function (data) {
    this.rect = this.view.append('rect');
    this.text = this.view.append('text').attr({x: this.prefer.x, 'dy': this.prefer.dy, 'xml:space': 'preserve'}).text('' + data);
}
Cell.prototype.update = function (dold, data) {
    this.text.text('' + data);
}
Cell.prototype.resize = function (w, h) {
    this.rect.attr({width: w, height: h});
    this.text.attr({x: this.prefer.x, y: h});
}
Cell.prototype.height = function (h) {
    this.text.attr({x: this.prefer.x, y: h});
}
Cell.prototype.width = function (w) {
    this.rect.attr({width: w, height: h});
}
Cell.prototype.position = function (x, y) {
    this.view.$t().translate(x, y).end();
}
function CellEdit(camera, cell) {
    this.camera = camera;

    this.cell = cell;
    this.column = cell.column;
    this.data = cell.parentNode.data;
    this.text = this.data[this.column.name];
}
CellEdit.prototype.endEdit = function (input) {
    this.cell.text.style('visibility', 'visible');
    this.cell.bind(this.data[this.column.name] = this.text);
}
CellEdit.prototype.startEdit = function (input) {
    input.style({'font-size': '17px', 'text-indent': '4px'});
    input.tag().value = this.text;
    this.cell.text.style('visibility', 'hidden');
}
CellEdit.prototype.setText = function (t) {
    this.text = t;
}
CellEdit.prototype.getTarget = function () {
    var p = this.camera.getLocal(this.cell.view, [0, 0]);
    p.push(this.column.width, this.column.height);
    return p;
}
