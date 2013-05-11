/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午3:55
 * To change this template use File | Settings | File Templates.
 */
    // ==========================
    // UI Manager
    // ==========================
function UIManager(svg) {
    this.svg = svg;

    // ui drawing layers
    this.layers = {
        panels: svg.append('svg:g').classed('pPanel', true),
        editor: svg.append('svg:g').classed('pEditor', true),
        message: svg.append('svg:g').classed('pMessage', true)
    };

    // hold the whole ui layout
    this.areas = new LinerLayout();
    // all registered actions
    this.actions = {};
    // all parts
    this.components = {};
    // event dispatcher config
    this.eventbus = new EventBus();

    // hold html adapter
    this.global = {
        inputSearch: new TextInput(document.getElementById('search'))
    };

    this.init();
}
UIManager.prototype.findComponent = function (name) {
    return this.components[name];
}
/**
 * return an temp event listener which will send event to WindowComponent
 * @param id
 * @returns {Function}
 */
UIManager.prototype.listenEvent = function (id) {
    var comp = this;
    return function (event, target) {
        comp.handleEvent({id: id, target: this});
    }
}
UIManager.prototype.getEventBus = function (key) {
    return this.eventbus;
}
UIManager.prototype.findWidget = function (key) {
    return this.global[key];
}
UIManager.prototype.init = function () {
    // add tool components
    this.addComponent('classes', new ClassManage(this.layers.panels));
    this.addComponent('editor', new EditArea(this.layers.editor));

    // manage components's size and position
    this.areas.add(this.components['classes'].getArea(), 0);
    this.areas.add(this.components['editor'].getArea(), 1);
}
UIManager.prototype.bindDatas = function (data) {
    this.components['editor'].bind(data.entities);
}
UIManager.prototype.addComponent = function (name, comp) {
    this.components[name] = comp;
    comp.onRegister(this);
}
UIManager.prototype.loseFocus = function () {
    block.selectAll('.focus')
        .classed('focus', false);
}
UIManager.prototype.onFocus = function (param) {
//    this.input.close();
//    var d = param.target.data;
//    if (Table.prototype.isTable(d.type) != -1) {
//        tables.order();
//    }
}
UIManager.prototype.export = function () {
    var save = {};
    save.entities = this.exportEntity();
    return save;
}
UIManager.prototype.exportEntity = function () {
    var data = {};
    data.tables = this.tables.export();
    data.links = this.links.export();
    return data;
}
UIManager.prototype.onResize = function (w, h) {
    // the whole export of svg visiable area
    this.svg.attr('viewBox', '0 0 ' + w + ' ' + h)
        .attr('width', w)
        .attr('height', h);
    // separated panel resize
    this.areas.size(w, h);
}
