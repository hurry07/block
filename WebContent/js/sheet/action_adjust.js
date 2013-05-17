function AdjustAction(camera) {
    Action.call(this);
    this.camera = camera;
    this.target = null;
}
_extends(AdjustAction, Action);
AdjustAction.prototype.onRegister = function (manager) {
    this.onInit('split.down');
    this.on('root.move');
    this.on('root.up');
}
AdjustAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case 'split.down':
            this.start(event);
            break;
        case 'root.move':
            console.log(block.event.clientX, block.event.clientY);
            this.move(event);
            break;
        case 'root.up':
            this.stop(event);
            break;
    }
}
AdjustAction.prototype.stop = function (event) {
    var p = this.camera.toLocal(block.event.x, block.event.y);
    this.target.stopMove(p[0], p[1]);
    this.target = null;
    this.active = false;
}
AdjustAction.prototype.move = function (event) {
    var p = this.camera.toLocal(block.event.x, block.event.y);
    this.target.moveTo(p[0], p[1]);
}
AdjustAction.prototype.start = function (event) {
    var t = this.target;
    if (t) {
        t.stopMove();
    }

    var p = this.camera.toLocal(block.event.x, block.event.y);
    this.target = event.target.getFeature('adjust');
    this.target.startMove(p[0], p[1]);
    this.active = true;
}
