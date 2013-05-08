/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:50
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// Action is an status machine, it listen to eventbus
// and can dispatch its own event to the bus
// ==========================
function Action(view, camera) {
    Layer.call(this, view, camera);
    this.active = false;
}
_extends(Action, Layer);
Action.prototype.onInit = function (id) {
    this.initEvent = id;
    this.on(id);
}
Action.prototype.isActive = function () {
    return this.active;
}
/**
 * handle event
 * @param event
 */
Action.prototype.onEvent = function (event) {
}
Action.prototype.applyEvent = function (event) {
    (this.initEvent == event.id || this.active) && this.onEvent(event);
}
