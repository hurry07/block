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

    this.view
        // collect background event
        .on('mousemove', this.listenId('root.move'))
        .on('mousedown.start', this.listenId('root.downstart'), true)
        .on('mouseup', this.listenId('root.up'), true)
        .call(function (view) {
            view.append('svg').call(function (svg) {
                svg.append('g').call(function (g) {
                    g.append('rect')
                        // background is not parent Tag od tables area, so mouseover from tables will not propagate to it
                        .on('mouseover', this.listenId('bg.over'))
                        .on('mouseout', this.listenId('bg.out'))
                        .attr('fill', 'url(#gridPattern)')
                    g.append('g')
                        .classed('entity', true)
                        .call(function (entity) {
                            entity.append('g').classed('links', true);
                            entity.append('g').classed('tables', true);
                        });
                    g.append('g')
                        .classed('pAssistant', true);
                }, this);
            }, this);
            view.append('svg').call(function (svg) {
                svg.append('g')
                    .classed('pMenu', true);
            }, this);
        }, this);

    var exports = this.view.selectAll('svg');
    this.initTables(exports.nodes()[0]);
    this.initMenus(exports.nodes()[1]);

    // move tables by click tables background
    this.view.on('mousedown.end', this.listen('root.downend'), this.tables)
}
_extends(EditArea, WindowComponent);
EditArea.prototype.getFeature = function (id) {
    console.log('EditArea', id);
}
EditArea.prototype.initTables = function (svg) {
    var root = svg.select('svg > g');
    var camera = new BgCamera(this.area, svg, root, root.select('g > rect'));

    Table.prototype.camera = camera;
    Table.prototype.handleDown = this.listen('table.down');
    Table.prototype.handleOver = this.listen('table.over');

    Field.prototype.camera = camera;
    Field.prototype.handleDown = this.listen('field.down');
    Field.prototype.handleOver = this.listen('field.over');

    Link.prototype.camera = camera;
    Link.prototype.handleDown = this.listen('link.down');

    this.addLayer(this.tables = new TableLayer(root.select('.entity'), camera));
    this.addAction(new DragAction(camera));
    this.addAction(new LinkAction(root.select('.pAssistant'), camera, this.tables));
}
EditArea.prototype.initMenus = function (svg) {
    var camera = new Camera(this.area, svg, svg.select('svg > g'));
    this.addAction(new MenuAction(svg.select('.pMenu'), camera));
}
EditArea.prototype.onRegister = function (manager) {
}
//EditArea.prototype.onResize = function () {
//    WindowComponent.prototype.onResize.call(this);
//    this.tables.camera.scale(0.5, 0, 0);
//    this.tables.camera.moveToScreen(100, 100, 380, 200);
//    this.tables.camera.scaleToScreen(2, 100 + 180, 50);
//}
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
    if (event.id == 'root.move') {
        console.log(block.eventToLocal(event.target));
    }
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
// data binding function
EditArea.prototype.bind = function (data) {
    this.tables.bind(data);
}
