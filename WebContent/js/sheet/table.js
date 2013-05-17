function TableView(p, view) {
    ListNode.call(this, p);
    this.view = view;
    this.header = this.createHead();
    this.header.bind(this.createHeader());
    this.rowsroot = Node.wrap(view.append('g').classed('data', true));
    this.splitroot = view.append('g').classed('split', true);
    this.splits = this.createSplitAll();
}
_extends(TableView, ListNode);
TableView.prototype.createHeader = function () {
    var header = {};
    this.columns.each(function (c) {
        header[c.name] = c.name;
    });
    return header;
}
TableView.prototype.createSplitAll = function () {
    var splits = [];
    var columns = this.columns;
    var h = this.prefer.row.height;
    var width = 0;
    for (var i = 0, length = this.columns.length; i < length; i++) {
        width += columns[i].width;
        var split = this.createSplit(this.splitroot, width, h);
        split.id = i;
        splits.push(split);
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
TableView.prototype.adjust = function (col, offset) {
    this.columns[col].width += offset;
    this.header.resize();
    this.getChildren().each(function (row) {
        row.node().resize();
    });
    var width = 0;
    for (var i = 0, length = this.columns.length; i < length; i++) {
        width += this.columns[i].width;
        this.splits[i].position(width, 0);
    }
}