/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-9
 * Time: 上午12:28
 * To change this template use File | Settings | File Templates.
 */
function TableLayer(view, camera) {
    Layer.call(this, view, camera);

    var node = Node.wrap(view);
    this.links = new LinkCollection(node, view.select('.links'));
    this.tables = new TableCollection(node, view.select('.tables'));
}
_extends(TableLayer, Layer);
TableLayer.prototype.applyEvent = function (event) {
    switch (event.id) {
        case 'link.add':
            this.addLink(event.data);
            break;
    }
}
TableLayer.prototype.onRegister = function (manager) {
}
/**
 * @param data {from:LinkTerminal, to:LinkTerminal}
 */
TableLayer.prototype.addLink = function (data) {
    var link = this.links.bindChild(data);
    data.from.table().addLinkOut(link);
    data.to.table().addLinkIn(link);
}
/**
 * data binding function
 * @param data
 */
TableLayer.prototype.bind = function (data) {
    var ts = data.tables;
    var tables = this.tables;
    tables.bind(data.tables);

    // create link
    var link;
    var links = this.links;
    for (var i = 0, ls = data.links, len = ls.length; i < len; i++) {
        link = ls[i];
        var p1, p2;
        if ((p1 = tables.getLinkNode(link.start, 'link.start')) && (p2 = tables.getLinkNode(link.end, 'link.end'))) {
            link = links.bindChild({from: p1, to: p2});
            p1.table().addLinkOut(link);
            p2.table().addLinkIn(link);
        }
    }
}
TableLayer.prototype.getFeature = function (f) {
    switch (f) {
        case 'move':
            return this.getMoveFeature();
    }
    console.error('TableLayer:unsupported feature found:' + f);
    return null;
}
TableLayer.prototype.getMoveFeature = function () {
    var camera = this.camera;
    var startx, starty;
    return {
        startMove: function (x, y) {
            startx = x;
            starty = y;
        },
        moveTo: function (x, y) {
            camera.move(startx, starty, x, y);
        },
        stopMove: function (x, y) {
        }
    }
}
