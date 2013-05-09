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
function Action() {
    Layer.call(this);
    this.active = false;
}
_extends(Action, Module);
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
/**
 * get data from manager
 * @param id[,id1[,id2...]]
 * @returns {*}
 */
Action.prototype.getParam = function (id) {
    var data = this.manager.getData();
    if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
            var id = arguments[i];
            if (data.has(id)) {
                return data.value(id);
            }
        }
    }
    return null;
}
/**
 * send customer event to window
 * @param event
 */
Action.prototype.dispatchEvent = function (event) {
    this.manager.handleEvent(event);
}
Action.prototype.onInit = function (id) {
    this.initEvent = id;
    this.on(id);
}
/**
 * add and remove event listing wiring
 * @param id
 */
Action.prototype.on = function (id) {
    this.manager.getEvents().on(id, this);
}
Action.prototype.off = function (id) {
    this.manager.getEvents().off(id, this);
}
