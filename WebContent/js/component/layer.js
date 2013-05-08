/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-9
 * Time: 上午12:28
 * To change this template use File | Settings | File Templates.
 */
/**
 * @param view
 * @param camera
 * @constructor
 */
function Layer(view, camera) {
    this.active = true;
    this.view = view;
    this.camera = camera;
}
Layer.prototype.onSizeChange = function (width, height) {
    this.camera.resize(width, height);
}
Layer.prototype.applyEvent = function (event) {
    this.onEvent(event);
}
/**
 * @param manager WindowComponent
 */
Layer.prototype.register = function (manager) {
    this.manager = manager;
    this.onRegister(manager);
}
Layer.prototype.onRegister = function (manager) {
}
Layer.prototype.applyEvent = function (event) {
}
/**
 * send customer event
 * @param event
 */
Layer.prototype.dispatchEvent = function (event) {
    this.manager.handleEvent(event);
}
/**
 * add and remove event listing wiring
 * @param id
 */
Layer.prototype.on = function (id) {
    this.manager.getEvents().on(id, this);
}
Layer.prototype.off = function (id) {
    this.manager.getEvents().off(id, this);
}
/**
 * get data from manager
 * @param id[,id1[,id2...]]
 * @returns {*}
 */
Layer.prototype.getParam = function (id) {
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
