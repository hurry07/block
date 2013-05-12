/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午10:25
 * To change this template use File | Settings | File Templates.
 */
/**
 *
 * @param root
 * @constructor
 */
function ValueComp(root) {
    WindowComponent.call(this, root);

    var prefer = {
        row: {height: 18}
    };
    var columns = [
        {type: 'string', name: 'name', width: 150, height: 18},
        {type: 'string', name: 'age', width: 80, height: 18}
    ];
    this.sheet1 = this.createSheet('sheet1', prefer, columns);
    this.sheet1.bind([
        {name: 'test1', age: 23},
        {name: 'test2', age: 22},
        {name: 'test3', age: 21}
    ]);
}
_extends(ValueComp, WindowComponent);
ValueComp.prototype.createSheet = function (id, prefer, columns) {
    return new Sheet(this, id, prefer, columns);
}
ValueComp.prototype.handleEvent = function (event) {
    console.log(event);
}
/**
 * react to window resize event
 */
ValueComp.prototype.onResize = function () {
    // put component to new position
    this.view.$t().translate(this.area.absx, this.area.absy).end();
    // resize all layers
    for (var i = -1, L = this.layers, len = L.length; ++i < len;) {
        L[i].onSizeChange(this.area);
    }
}
