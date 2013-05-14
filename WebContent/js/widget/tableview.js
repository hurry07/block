/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午5:03
 * To change this template use File | Settings | File Templates.
 */
function TableView(p, view) {
    ListNode.call(this, p);
    this.view = view;
    this.header = this.createHead();
}
_extends(TableView, ListNode);
/**
 * should supply by ValueComp
 * @returns {Row}
 */
TableView.prototype.createChild = function () {
    return new Row(this);
}
TableView.prototype.updateEnd = function (children) {
    this.header.position(0, 0);
    var y = 0;
    var height = y = this.prefer.row.height;
    children.each(function (row) {
        row.position(0, y);
        y += height;
    })
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