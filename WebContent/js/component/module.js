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
