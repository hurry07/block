/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-9
 * Time: 上午12:28
 * To change this template use File | Settings | File Templates.
 */
function TableLayer(view, camera) {
    Layer.call(this, view, camera);

    // tables
    var node = Node.wrap(view);
    this.tables = new TableCollection(node, view);
    this.links = new LinkCollection(node, view);
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
    this.on('link.add');
}
TableLayer.prototype.addLink = function (data) {
}