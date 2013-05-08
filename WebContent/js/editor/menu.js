/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午6:48
 * To change this template use File | Settings | File Templates.
 */
// ======================
// Menu
// ======================
function Menu(p, action) {
    Node.call(this, p);
    this.action = action;
}
_node(Menu, Node);
Menu.prototype.prefer = {
    width: 170,
    height: 20,
    splitheight: 5,
    padding: 4
}
Menu.prototype.createView = function () {
    return this.rootView()
        .append('svg:g')
        .classed('menu', true)
        .on('mousedown', this.handleDown, this);
}
Menu.prototype.bind = function (data) {
    this.view.remove('g > *');

    var p = this.prefer;
    var menuy = 0;
    for (var i = 0, l = data.length; i < l; i++) {
        var item = data[i];

        if (item.split) {
            var cy = menuy + p.splitheight / 2;
            this.view.append('svg:rect')
                .attr('width', p.width)
                .attr('height', p.splitheight)
                .attr('y', menuy)
                .classed('split', true);
            this.view.append('svg:path')
                .attr('d', 'M' + p.padding + ',' + cy + 'L' + (p.width - p.padding) + ',' + cy);
            menuy += p.splitheight;
        } else {
            item.action = this.action;
            var g = this.view.append('svg:g')
                .attr('transform', 'translate(' + 0 + ',' + menuy + ')')
                .classed('item', true)
                .on('click', this.handleClick, item);
            g.append('svg:rect')
                .attr('width', p.width)
                .attr('height', p.height)
            g.append('svg:text')
                .attr('x', p.padding)
                .attr('y', p.height - 4)
                .text(item.title || config.string(item.command));
            menuy += p.height;
        }
    }

    this.view.insert('svg:rect', ':first-child')
        .attr('width', p.width)
        .attr('height', menuy)
        .classed('background', true)
    this.height = menuy;
}
Menu.prototype.handleClick = function (d) {
    this.action.onMenuClick(this.command);
}
Menu.prototype.handleDown = function () {
    if (block.event.button == 2) {
        block.event.stopPropagation();
    }
    this.action.onMenuDown();
}
Menu.prototype.show = function (x, y, items) {
    this.bind(items);
    this.showprevious(x, y);
}
Menu.prototype.showprevious = function (x, y) {
    this.view.attr('transform', 'translate(' + x + ',' + y + ')');
    this.view.style('visibility', 'visible');
}
Menu.prototype.hide = function () {
    this.view.style('visibility', 'hidden');
}
/**
 * menu when you click at an empty space
 * @constructor
 */
function DefaltMenu() {
}
DefaltMenu.prototype.getMenu = function () {
    return [
        {keys: 'A', command: 'global.add.table'},
        {keys: '', command: 'global.export'},
        {keys: '', command: 'global.save'}
    ];
}
DefaltMenu.prototype.runMenuAction = function (action) {
    switch (action) {
        case 'global.add.table':
            break;
        case 'global.export':
        case 'global.save':
            var exp = uiMgr.export();
            d3.xhr('res/data.json?save=true').post(JSON.encode(exp), function () {
                console.log('upload success', arguments);
            });
            console.log(JSON.encode(exp));
            break;
    }
    console.log(action);
}
