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
    this.onInit('root.downend');
    this.on('root.move');
    this.on('root.up');
    this.on('drag.begin');
}
LinkAction.prototype.inactive = function () {
    this.active = false;
    this.data.from.reset();
    this.data.to.reset();
    this.link.hide();
}
LinkAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case 'root.downend':
            this.inactive();

            // if user release the ctrl key, stop dragging
            if (UIManager.prototype.ctrlKey()) {
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
