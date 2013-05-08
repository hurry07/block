/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午6:49
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// Link curve
// ==========================
function LinkTerminal() {
    this.type = this.Types.NONE;
}
LinkTerminal.prototype.table = function () {
    var t;
    if (t = arguments[0]) {
        if (this.mtable !== t) {
            delete this.mfield;
        }
        this.mtable = t;
        this.updatetype();
    } else {
        return this.mtable;
    }
}
LinkTerminal.prototype.getId = function () {
    var id;
    var t;
    if (t = this.table()) {
        id = t.getName();
    } else {
        id = '';
    }
    if (t = this.field()) {
        id += '.' + t.getName();
    }
    return id;
}
LinkTerminal.prototype.field = function () {
    var t;
    if (t = arguments[0]) {
        this.mfield = t;
        this.updatetype();
    } else {
        return this.mfield
    }
}
LinkTerminal.prototype.delfield = function () {
    delete this.mfield;
}
LinkTerminal.prototype.deltable = function () {
    delete this.mtable;
}
LinkTerminal.prototype.node = function () {
    return this.type != this.Types.NONE && (this.mfield || this.mtable);
}
LinkTerminal.prototype.updatetype = function () {
    if (this.mfield) {
        this.type = this.Types.FIELD;
    } else if (this.mtable) {
        this.type = this.Types.TABLE;
    }
}
LinkTerminal.prototype.reset = function () {
    delete this.mfield;
    delete this.mtable;
    this.type = this.Types.NONE;
}
LinkTerminal.prototype.Types = {
    TABLE: 'table',
    FIELD: 'field',
    NONE: 'none'
}
LinkTerminal.prototype.clone = function () {
    var t = new LinkTerminal();
    if (this.mtable) {
        t.mtable = this.mtable;
    }
    if (this.mfield) {
        t.mfield = this.mfield;
    }
    t.type = this.type;
    return t;
}
// ==========================
// LinkAction
// ==========================
function LinkAction(root) {
    Action.call(this);

    this.link = Link.create(Node.wrap(root));
    this.link.disablePointer();
    this.data = {
        from: new LinkTerminal(),
        to: new LinkTerminal()
    };
    this.link.bind(this.data);
}
_extends(LinkAction, Action);
LinkAction.prototype.onRegister = function (manager) {
    this.initEvent = ControlType.SVG_DOWN_END;
    this.on(ControlType.SVG_DOWN_END);
    this.on(ControlType.SVG_MOVE);
    this.on(ControlType.SVG_UP_END);
}
LinkAction.prototype.inactive = function () {
    this.active = false;
    this.data.from.reset();
    this.data.to.reset();
    this.link.hide();
}
LinkAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case ControlType.SVG_DOWN_END:
            this.inactive();

            // if user release the ctrl key, stop dragging
            if (UIManager.prototype.ctrlKey()) {
                break;
            }

            this.start(event);
            break;

        case ControlType.SVG_MOVE:
            if (UIManager.prototype.ctrlKey()) {
                this.inactive();
                break;
            }

            this.updateEnd(event);
            break;

        case ControlType.SVG_UP_END:
            this.addLink();
            break;
    }
}
LinkAction.prototype.addLink = function () {
    var d = this.data;
    var endt = d.to.table();
    if (endt) {
        uiMgr.addLink(d);
    }
    this.inactive();
}
LinkAction.prototype.updateEnd = function (event) {
    var d = this.data.to;

    var table = this.getParam(event, 'mouseover.table');
    if (table && table != this.data.from.table()) {
        d.table(table);
        var field = this.getParam(event, 'mouseover.field');
        if (field) {
            d.field(field);
        } else {
            d.delfield();
        }
    } else {
        d.reset();
    }

    var n = d.node();
    if (n) {
        this.dragend = camera.transformPoint(n.getViewNode(), n.getLinkEnd());
    } else {
        this.dragend = camera.toLocal(block.event.x, block.event.y);
    }

    this.link.updateCurve(this.dragstart, this.dragend);
    this.link.show();
}
LinkAction.prototype.start = function (event) {
    var d = this.data.from;
    d.reset();

    var table = this.getParam(event, 'mousedown.table');
    if (!table) {
        return;
    }

    d.table(table);
    var field = this.getParam(event, 'mousedown.field');
    if (field) {
        d.field(field);
    }
    d.updatetype();
    var n = d.node();
    this.dragstart = n.getLinkStart();

    this.active = true;
    this.fireEvent('link.begin', this.beginTable);
}
// ==========================
// DragControl
// ==========================
function DragAction() {
    Action.call(this);
    this.initEvent = 'root.downend';
}
_extends(DragAction, Action);
DragAction.prototype.onRegister = function (manager) {
    this.on('root.downend');
    this.on('root.move');
    this.on('root.move');
    this.on('root.up');
    this.on('link.begin');
}
DragAction.prototype.inactive = function () {
    this.active = false;
    var n = this.node;
    if (n) {
        n.stopMove(block.event.x, block.event.y);
        this.node = null;
    }
}
DragAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case 'root.downend':
            this.inactive();

            // if user release the ctrl key, stop dragging
            if (!UIManager.prototype.ctrlKey()) {
                break;
            }

            var target = this.getParam('mousedown.table');
            if (target) {
                this.node = target.getFeature('move');
                var p = this.camera.toLocal(block.event.x, block.event.y);
                this.node.startMove(p[0], p[1]);
                this.active = true;
                this.dispatchEvent({id: 'drag.begin'});
            }
            break;

        case 'root.move':
            if (!UIManager.prototype.ctrlKey()) {
                this.inactive();
                break;
            }
            var p = this.camera.toLocal(block.event.x, block.event.y);
            this.node.moveTo(p[0], p[1]);
            break;

        case 'root.up':
        case 'link.begin':
            this.inactive();
            break;
    }
}
// ==========================
// show right click menu
// ==========================
function MenuAction(root) {
    Action.call(this);

    this.initEvent = _r(ControlType.SVG_DOWN_END);
    this.focus = false;
    this.target = null;
    this.backmenu = new DefaltMenu();

    this.menu = Menu.create(Node.wrap(root), this);
}
_extends(MenuAction, Action);
MenuAction.prototype.onRegister = function (manager) {
    this.on(ControlType.SVG_DOWN_END);
    this.on(_r(ControlType.SVG_DOWN_END));
}
MenuAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case _r(ControlType.SVG_DOWN_END):
            this.popupMenu(event);
            break;
        case ControlType.SVG_DOWN_END:
            if (!this.focus) {
                this.stopMenu();
            }
            break;
    }
}
/**
 * popup right click menu
 * @param event
 */
MenuAction.prototype.popupMenu = function (event) {
    this.focus = false;

    // if table menu
    var target = this.checkTarget(event, 'mousedown.link', 'mousedown.field', 'mousedown.table');
    target = target || this.backmenu;

    var local = this.camera.toLocal(block.event.x, block.event.y);

    // change position
    if (target === this.target) {
        this.menu.showprevious(local[0], local[1]);
        return;
    }
    this.target = target;
    this.menu.show(local[0], local[1], target.getMenu());
    this.active = true;
}
MenuAction.prototype.checkTarget = function (event) {
    var t;
    for (var i = 1, l = arguments.length; i < l; i++) {
        if (t = this.getParam(event, arguments[i])) {
            return t;
        }
    }
    return null;
}
MenuAction.prototype.onMenuClick = function (command) {
    this.target.runMenuAction(command);
    this.stopMenu();
}
MenuAction.prototype.onMenuDown = function () {
    this.focus = true;
}
MenuAction.prototype.stopMenu = function () {
    this.menu.hide();
    this.target = null;
}
// ==========================
// Edit Area
// ==========================
/**
 * @param root of the editor area
 * @constructor
 */
function EditArea(root) {
    // root container of table area
    WindowComponent.call(this, root);

    // collect background event
    this.view
        .on('mousemove', this.listenId('root.move'))
        .on('mousedown.start', this.listenId('root.downstart'), true)
        .on('mousedown.end', this.listenId('root.downend'))
        .on('mouseup', this.listenId('root.up'), true)

    // table window clip window
    this.initTables();
    // init svg layers that will used for drag and drop
    this.initLayers();

    //TODO test
//    this.graphic.camera.move(-50, -40);
//    this.graphic.camera.scale(2);
}
_extends(EditArea, WindowComponent);
// ==========================
// global managed methods
EditArea.prototype.onRegister = function (manager) {
}
EditArea.prototype.onResize = function () {
    var a = this.area;
    this.view.$t().translate(a.x, a.y).end();
    this.cameras.each(function (e) {
        e.resize(a.width(), a.height());
    });
}

// ==========================
// data binding function
EditArea.prototype.bind = function (data) {
    var ts = data.tables;
    var tables = this.graphic.tables;
    tables.bind(data.tables);

    // create link
    var link;
    var links = this.graphic.links;
    for (var i = 0, ls = data.links, len = ls.length; i < len; i++) {
        link = ls[i];
        var p1, p2;
        if ((p1 = tables.getLinkNode(link.start)) && (p2 = tables.getLinkNode(link.end))) {
            link = links.bindChild({from: p1, to: p2});
            p1.table().addLinkOut(link);
            p2.table().addLinkIn(link);
        }
    }
}
// ==========================
// functions setup
EditArea.prototype.initLayers = function () {
    var t = this.layers = {};

    var viewbox = this.view.append('svg');
    var root = t.root = viewbox.append('g').classed('tools', true);
    var camera = t.camera = new Camera(this.area, viewbox, root);
    this.cameras.push(camera);

    t.assistant = root.append('svg:g').classed('pAssistant', true);
    t.menu = root.append('svg:g').classed('pMenu', true);

    // add actions
    MenuAction.prototype.camera = camera;
    LinkAction.prototype.camera = camera;
    this.addAction('link', new LinkAction(this.layers.assistant));
    this.addAction('menu', new MenuAction(this.layers.menu));
}
EditArea.prototype.initTables = function () {
    var t = this.graphic = {};

    var viewbox = this.view.append('svg');
    var root = t.root = viewbox.append('g').classed('entity', true);

    // background is not parent Tag od tables area, so mouseover from tables will not propagate to it
    t.background = root.append('svg:rect').attr('fill', 'url(#gridPattern)')
        .on('mouseover', this.listenId('bg.over'))
        .on('mouseout', this.listenId('bg.out'));
    var camera = t.camera = new BgCamera(this.area, viewbox, root, t.background);
    this.cameras.push(camera);

    // bind listener to current component
    Table.prototype.camera = camera;
    Table.prototype.handleDown = this.listen('table.down');
    Table.prototype.handleOver = this.listen('table.over');

    Field.prototype.camera = camera;
    Field.prototype.handleDown = this.listen('field.down');
    Field.prototype.handleOver = this.listen('field.over');

    // tables
    var node = Node.wrap(root);
    t.tables = new TableCollection(node, root);
    t.links = new LinkCollection(node, root);

    // add actions
    DragAction.prototype.camera = camera;
    this.addAction('drag', new DragAction());
}
// ==========================
// handle event
EditArea.prototype.handleEvent = function (event) {
    switch (event.id) {
        // reset table event
        case 'bg.over':
            this.compdata.clean('mouseover');
            break;
        case 'bg.out':
            this.compdata.clean('mouseover');
            break;
        case 'root.downstart':
            this.compdata.clean('mousedown');
            break;

        // log table event
        case 'table.down':
            this.compdata.del('mousedown.field');
            this.compdata.value('mousedown.table', event.target);
            break;
        case 'field.down':
            this.compdata.value('mousedown.field', event.target);
            break;

        case 'table.over':
            this.compdata.del('mouseover.field');
            this.compdata.value('mouseover.table', event.target);
            break;
        case 'field.over':
            this.compdata.value('mouseover.field', event.target);
            break;

        // root.up
        // root.downend
        // root.move
        default :
            this.eventbus.fireEvent(event);
            break;
    }

    this.eventbus.fireEvent(event);
//    if (event.id != 'root.move') {
//        console.log('---------------------');
//        console.log(event);
//        console.log('--------');
//        this.compdata.log([
//            'mousedown.field',
//            'mousedown.table',
//            'mouseover.field',
//            'mouseover.table']);
//        //console.log(event, this.compdata);
//    }
}
