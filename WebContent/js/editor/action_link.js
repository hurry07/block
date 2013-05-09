/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:19
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// LinkAction
// ==========================
function LinkAction(view, camera, tables) {
    Action.call(this);

    this.view = view;
    this.camera = camera;
    this.tables = tables;

    this.link = Link.create(Node.wrap(view));
    this.link.disablePointer();
    this.link.bind({from: new LinkTerminal(), to: new LinkTerminal()});
}
_extends(LinkAction, Action);
LinkAction.prototype.onRegister = function (manager) {
    this.onInit('root.downend');
    this.on('root.move');
    this.on('root.up');
    this.on('drag.begin');
}
LinkAction.prototype.inactive = function () {
    this.active = false;
    this.endnode = null;
}
LinkAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case 'root.downend':
            this.inactive();

            // if user release the ctrl key, stop dragging
            if (ctrlKey(block.event)) {
                break;
            }
            this.start(event);
            break;

        case 'root.move':
            if (ctrlKey(block.event)) {
                this.inactive();
                break;
            }
            this.update(event);
            break;

        case 'root.up':
            this.end();
            break;
    }
}
LinkAction.prototype.end = function () {
    var start = this.startnode;
    var end = this.endnode;
    if (this.active && end) {
        this.tables.addLink({from: start, to: end});
    }
    this.inactive();
}
LinkAction.prototype.update = function (event) {
    // if target table is start table, end link action
    var node = this.getParam('mouseover.table');
    var x = block.event.x, y = block.event.y;
    if (!node || node === this.startnode.table()) {
        this.endnode = null;
        this.link.updateCurve(this.startpoint, this.camera.toLocal(x, y));
        return;
    }

    // if start end are from different tables
    node = this.getParam('mouseover.field') || node;
    if (!this.endnode || this.endnode.node() !== node) {
        this.endnode = node.getFeature('link.end');
    }
    this.link.updateCurve(this.startpoint, this.endnode.transform(this.camera));
}
LinkAction.prototype.start = function (event) {
    var node = this.getParam('mousedown.field', 'mousedown.table');
    if (!node) {
        return;
    }
    this.startnode = node.getFeature('link.start');
    this.startpoint = this.startnode.transform(this.camera);
    this.active = true;
    this.link.show();
    this.dispatchEvent({id: 'link.begin'});
}
