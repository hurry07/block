/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-9
 * Time: 上午9:58
 * To change this template use File | Settings | File Templates.
 */
/**
 * basic class of window's child
 * @constructor
 */
function Module() {
}
/**
 * @param manager WindowComponent
 */
Module.prototype.register = function (manager) {
    this.manager = manager;
    this.onRegister(manager);
}
Module.prototype.onRegister = function (manager) {
}
Module.prototype.applyEvent = function (event) {
}
/**
 * send customer event
 * @param event
 */
Module.prototype.dispatchEvent = function (event) {
    this.manager.handleEvent(event);
}
/**
 * add and remove event listing wiring
 * @param id
 */
Module.prototype.on = function (id) {
    this.manager.getEvents().on(id, this);
}
Module.prototype.off = function (id) {
    this.manager.getEvents().off(id, this);
}
/**
 * get data from manager
 * @param id[,id1[,id2...]]
 * @returns {*}
 */
Module.prototype.getParam = function (id) {
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
