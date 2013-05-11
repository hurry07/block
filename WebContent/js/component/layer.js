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
    Module.call(this);
    this.active = true;
    this.view = view;
    this.camera = camera;
}
_extends(Layer, Module);
Layer.prototype.onSizeChange = function (area) {
    this.camera.resize(area);
}
