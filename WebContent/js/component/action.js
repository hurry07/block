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
    this.active = false;
    this.events = [];
}
/**
 * @param manager WindowComponent
 */
Action.prototype.register = function (manager) {
    this.manager = manager;
    this.onRegister(manager);
}
Action.prototype.onInit = function (id) {
    this.initEvent = id;
    this.on(id);
}
Action.prototype.onRegister = function (manager) {
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
/**
 * send customer event
 * @param event
 */
Action.prototype.dispatchEvent = function (event) {
    this.manager.handleEvent(event);
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
/**
 * get data from manager
 * @param id
 * @returns {*}
 */
Action.prototype.getParam = function (id) {
    var data = this.manager.getData();
    if (data.has(id)) {
        return data.value(id);
    }
    return null;
}
