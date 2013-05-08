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
function LinkAction(view, camera) {
    Action.call(this, view, camera);

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
            this.updateEnd(event);
            break;

        case 'root.up':
            this.addLink();
            break;
    }
}
LinkAction.prototype.addLink = function () {
    var start = this.startnode;
    var end = this.endnode;
    if (this.active && end) {
        this.dispatchEvent({id: 'link.setup', data: {from: start, to: end}});
    }
    this.inactive();
}
LinkAction.prototype.updateEnd = function (event) {
    var node = this.getParam('mousedown.field', 'mousedown.table');
    if (node) {
        if (!this.endnode || this.endnode.node() !== node) {
            this.endnode = node.getFeature('link.end');
        }
        this.link.updateCurve(this.startpoint, this.endnode.transform(this.camera));
    } else {
        this.link.updateCurve(this.startpoint, this.camera.toLocal(block.event.x, block.event.y));
        this.endnode = null;
    }
    this.link.show();
}
LinkAction.prototype.start = function (event) {
    var node = this.getParam('mousedown.field', 'mousedown.table');
    if (!node) {
        return;
    }
    this.startnode = node.getFeature('link.start');
    this.startpoint = this.startnode.transform(this.camera);
    this.active = true;
    this.dispatchEvent({id: 'link.begin'});
}
