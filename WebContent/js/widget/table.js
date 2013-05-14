function Split(root, x, h) {
    this.x = x;
    this.h = h;
    this.line = root.append('line').attr({x1: x, y1: 0, x2: x, y2: h});
    this.rect = root.append('rect').attr({width: this.prefer.width, height: h, x: x - this.prefer.width / 2});
}
Split.prototype.position = function (x) {
    this.x = x;
    this.line.attr({x1: x, y1: 0, x2: x, y2: this.h});
    this.rect.attr('x', x - this.prefer.width / 2);
}
Split.prototype.height = function (h) {
    this.h = h;
    this.line.attr({x1: this.x, y1: 0, x2: this.x, y2: h});
}
Split.prototype.prefer = {
    width: 6
}
function TableView(p, view) {
    ListNode.call(this, p);
    this.view = view;
    this.header = this.createHead();
    this.rowsroot = Node.wrap(view.append('g').classed('data', true));
    this.splitroot = view.append('g').classed('split', true);
    this.splits = this.createSplitAll();
}
_extends(TableView, ListNode);
TableView.prototype.createSplitAll = function () {
    var splits = [];
    var columns = this.columns;
    var h = this.prefer.row.height;
    var width = 0;
    var s;
    for (var i = 0, length = this.columns.length - 1; i < length; i++) {
        width += columns[i].width;
        splits.push(s = new Split(this.splitroot, width, h));
        this.onSplitCreate(s);
    }
    return splits;
}
/**
 * should supply by ValueComp
 * @returns {Row}
 */
TableView.prototype.createChild = function () {
    return new Row(this.rowsroot);
}
TableView.prototype.updateEnd = function (children) {
    var y = 0;
    var height = this.prefer.row.height;

    this.header.position(0, 0);
    this.rowsroot.view.$t().translate(0, height).end();
    children.each(function (row) {
        row.position(0, y);
        y += height;
    })

    y += height;
    this.splits.each(function (split) {
        split.height(y);
    });
}
TableView.prototype.exit = function () {
    ListNode.prototype.exit.call(this);
    this.header.remove();
}
TableView.prototype.getChildren = function () {
    return this.view.selectAll('.row');
}
TableView.prototype.bindHeader = function (data) {
    this.header.bind(data);
}
