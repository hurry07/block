/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:18
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// DragControl
// ==========================
function DragAction() {
    Action.call(this);
}
_extends(DragAction, Action);
DragAction.prototype.onRegister = function (manager) {
    this.onInit('root.downend');
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
            if (!ctrlKey(block.event)) {
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
            if (!ctrlKey(block.event)) {
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
