function Split(root, x, h) {
    this.x = x;
    this.h = h;
    this.view = root.append('g').$t().translate(x, 0).end().classed('split', true);
    this.line = this.view.append('rect').attr({width: this.prefer.linewidth, height: h}).classed('line', true);
    this.rect = this.view.append('rect').attr({width: this.prefer.width, height: h, x: -this.prefer.width / 2}).classed('block', true);
}
Split.prototype.position = function (x) {
    this.x = x;
    this.view.$t().translate(x, 0).end();
}
Split.prototype.height = function (h) {
    this.h = h;
    this.line.attr('height', h)
}
Split.prototype.prefer = {
    width: 6,
    linewidth: 0.5
}
function SplitDrag(table, split, camera) {
    this.table = table;
    this.split = split;
    this.camera = camera;
    this.startx = split.x;
}
SplitDrag.prototype.startMove = function (x, y) {
    var p = this.camera.toLocal(x, y);
    this.startx = x;
}
SplitDrag.prototype.moveTo = function (x, y) {
    var p = this.camera.toLocal(x, y);
    this.split.position(x);
}
SplitDrag.prototype.stopMove = function (x, y) {
    this.split.position(x);
    this.table.adjust(this.split.id, x - this.startx);
}
