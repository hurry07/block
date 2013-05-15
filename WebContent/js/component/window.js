/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午7:05
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// Event Wiring
// ==========================
function EventBus() {
    this.config = new DataMap();
}
/**
 * add action with a name
 * @param name
 * @param action
 */
EventBus.prototype.on = function (name, action) {
    var ls = this.config.value(name);
    if (!ls) {
        this.config.value(name, [action]);
    } else if (ls.indexOf(action) == -1) {
        ls.push(action);
    }
}
EventBus.prototype.off = function (name, action) {
    var vs = this.config.value(name);
    var i = !vs ? -1 : vs.indexOf(action);
    if (i != -1) {
        vs.splice(i, 1);
        if (vs.length == 0) {
            this.config.del(name);
        }
    }
}
EventBus.prototype.fireEvent = function (event) {
    var listeners = this.config.value(event.id);
    if (listeners) {
        for (var i = -1, len = listeners.length; ++i < len;) {
            listeners[i].applyEvent(event);
        }
    }
}
/**
 * run event on an Action
 * @param action
 * @param event
 */
EventBus.prototype.runEvent = function (action, event) {
    (action.initEvent == event.id || action.isActive()) && action.onEvent(event);
}
// ==========================
// Component of tool
// ==========================
/**
 * a part of the whole editor
 * @constructor
 */
function WindowComponent(view) {
    this.view = view;

    // the area field make it possible be managed by global layout controller
    this.area = this.createArea();

    // event and listener wiring
    this.eventbus = new EventBus();
    this.compdata = new DataMap();

    // editor's function will be brought up by actions
    this.actions = [];
    this.layers = [];
}
WindowComponent.prototype.createArea = function () {
    return new Area(this);
}
WindowComponent.prototype.close = function () {
}
/**
 * react to window resize event
 */
WindowComponent.prototype.onResize = function () {
    // put component to new position
    this.view.$t().translate(this.area.absx, this.area.absy).end();
    // resize all layers
    for (var i = -1, L = this.layers, len = L.length; ++i < len;) {
        L[i].onSizeChange(this.area);
    }
}
/**
 * when container binding to parent window
 * @param manager
 */
WindowComponent.prototype.onRegister = function (manager) {
    this.manager = manager;
}
WindowComponent.prototype.getArea = function () {
    return this.area;
}
/**
 * interact with action
 * @returns {*}
 */
WindowComponent.prototype.getEvents = function () {
    return this.eventbus;
}
WindowComponent.prototype.getData = function () {
    return this.compdata;
}
/**
 * all user event should be collected to event bus
 * @param event
 */
WindowComponent.prototype.handleEvent = function (event) {
}
WindowComponent.prototype.addAction = function (action) {
    this.actions.push(action);
    action.register(this);
}
WindowComponent.prototype.addLayer = function (layer) {
    this.layers.push(layer);
    layer.register(this);
}
/**
 * return an temp event listener which will send event to WindowComponent
 * @param id
 * @returns {Function}
 */
WindowComponent.prototype.listen = function (id) {
    var comp = this;
    return function (event, target) {
        comp.handleEvent({id: id, target: this});
    }
}
WindowComponent.prototype.listenId = function (id) {
    var comp = this;
    return function (event, target) {
        comp.handleEvent({id: id});
    }
}
