/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午6:49
 * To change this template use File | Settings | File Templates.
 */
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
    //this.addAction('link', new LinkAction(this.layers.assistant));
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

    Link.prototype.handleDown = this.listen('link.down');

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

        // log link event
        case 'link.down':
            this.compdata.value('mousedown.link', event.target);
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
