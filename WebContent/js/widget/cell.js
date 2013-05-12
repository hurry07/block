/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-12
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */
function Cell(p, name) {
    Node.call(this, p);
    this.name = name;
}
_extends(Cell, Node);
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
