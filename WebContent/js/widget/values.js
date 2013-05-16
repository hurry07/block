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

    this.view.on('mousemove', this.listen('root.move'), this);
    this.view.on('mouseup', this.listen('root.up'), this);

    this.sheets = {};
    this.input = null;
    this.camera = new Transform(this.area, this.view);

    this.addAction(new AdjustAction(this.camera));

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
        cell: {dy: -2, x: 4}
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
    switch (event.id) {
        case 'cell.down':
            this.editCell(event);
            break;
        case 'split.down':
            this.moveColumn(event);
            break;
    }
    this.eventbus.fireEvent(event);
}
ValueComp.prototype.editCell = function (event) {
    this.input.show(event.target.getFeature('edit'));
}
ValueComp.prototype.moveColumn = function (event) {
    console.log(event.target.getFeature('adjust'));
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
function AdjustAction(camera) {
    Action.call(this);
    this.camera = camera;
    this.target = null;
}
_extends(AdjustAction, Action);
AdjustAction.prototype.onRegister = function (manager) {
    this.onInit('split.down');
    this.on('root.move');
    this.on('root.up');
}
AdjustAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case 'split.down':
            this.start(event);
            break;
        case 'root.move':
            console.log(block.event.clientX, block.event.clientY);
            this.move(event);
            break;
        case 'root.up':
            this.stop(event);
            break;
    }
}
AdjustAction.prototype.stop = function (event) {
    var p = this.camera.toLocal(block.event.x, block.event.y);
    this.target.stopMove(p[0], p[1]);
    this.target = null;
    this.active = false;
}
AdjustAction.prototype.move = function (event) {
    var p = this.camera.toLocal(block.event.x, block.event.y);
    this.target.moveTo(p[0], p[1]);
}
AdjustAction.prototype.start = function (event) {
    var t = this.target;
    if (t) {
        t.stopMove();
    }

    var p = this.camera.toLocal(block.event.x, block.event.y);
    this.target = event.target.getFeature('adjust');
    this.target.startMove(p[0], p[1]);
    this.active = true;
}
