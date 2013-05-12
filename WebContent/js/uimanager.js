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
        editor: svg.append('svg:g').classed('pEditor', true),
        values: svg.append('svg:g').classed('pValues', true),
        panels: svg.append('svg:g').classed('pPanel', true),
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
        inputSearch: new TextInput(document.getElementById('search')),
        'table.edit': document.getElementById('table.edit')
    };

    this.init();
}
UIManager.prototype.findComponent = function (name) {
    return this.components[name];
}
UIManager.prototype.getEventBus = function (key) {
    return this.eventbus;
}
UIManager.prototype.findWidget = function (key) {
    return this.global[key];
}
UIManager.prototype.init = function () {
    // add tool components
    this.addComponent('editor', new EditArea(this.layers.editor));
    this.addComponent('classes', new ClassManage(this.layers.panels));
    this.addComponent('values', new ValueComp(this.layers.values));

    // manage components's size and position
    this.areas.add(this.components['classes'].getArea(), 0);
    this.areas.add(new LinerLayout('v')
        .add(this.components['editor'].getArea(), 1)
        .add(this.components['values'].getArea().init(0, 0, 0, 200), 0)
    );
}
UIManager.prototype.bindDatas = function (data) {
    this.components['editor'].bind(data.entities);
}
UIManager.prototype.addComponent = function (name, comp) {
    this.components[name] = comp;
    comp.onRegister(this);
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
