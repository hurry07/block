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
    var y = 0;
    var height = this.prefer.row.height;
    children.each(function (row) {
        row.position(0, y);
        y += height;
    })
}