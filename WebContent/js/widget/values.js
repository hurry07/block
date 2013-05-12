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

    this.sheets = {};
    this.input = null;

    var sheet1 = this.testSheet();
    sheet1.bind([
        {name: 'test1', age: 23},
        {name: 'test2', age: 22},
        {name: 'test3', age: 21}
    ]);
}
_extends(ValueComp, WindowComponent);
ValueComp.prototype.testSheet = function () {
    var prefer = {
        row: {height: 18}
    };
    var columns = [
        {type: 'string', name: 'name', width: 150, height: 18},
        {type: 'string', name: 'age', width: 80, height: 18}
    ];
    return this.addSheet('sheet1', prefer, columns);
}
ValueComp.prototype.addSheet = function (id, prefer, columns) {
    return  this.sheets[id] = this.createSheet(id, prefer, columns);
}
ValueComp.prototype.createSheet = function (id, prefer, columns) {
    return new Sheet(this, id, prefer, columns);
}
ValueComp.prototype.onRegister = function (manager) {
    this.input = new TextInput(manager.findWidget('table.edit'));
}
ValueComp.prototype.handleEvent = function (event) {
    console.log(event);
    switch (event.id) {
        case 'cell.down':
            this.editCell(event);
            break;
    }
}
ValueComp.prototype.editCell = function (event) {
    console.log(event);
//    var adapter = event.target.getFeature('edit');
//    this.input.show(adapter);
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
