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
    this.camera = new Transform(this.area, this.view);

    var sheet1 = this.testSheet();
    sheet1.bind([
        {name: 'jack1', age: 23, city: 'hangzhou'},
        {name: 'frank', age: 23, city: 'hangzhou'},
        {name: 'panda', age: 23, city: 'hangzhou'},
        {name: '=_=', age: 23, city: 'hangzhou'},
        {name: ':D', age: 23, city: 'hangzhou'},
        {name: 'test 1', age: 23, city: 'hangzhou'},
        {name: 'test 2', age: 23, city: 'hangzhou'},
    ]);
}
_extends(ValueComp, WindowComponent);
ValueComp.prototype.testSheet = function () {
    var prefer = {
        row: {height: 18},
        cell: {dy: -4, x: 4}
    };
    var columns = [
        {type: 'string', name: 'name', width: 70},
        {type: 'string', name: 'age', width: 40},
        {type: 'string', name: 'city', width: 100}
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
    this.input.show(event.target.getFeature('edit'));
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
