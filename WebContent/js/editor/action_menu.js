/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:21
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// show right click menu
// ==========================
function MenuAction(root) {
    Action.call(this);

    this.focus = false;
    this.target = null;
    this.backmenu = new DefaltMenu();

    this.menu = Menu.create(Node.wrap(root), this);
}
_extends(MenuAction, Action);
MenuAction.prototype.onRegister = function (manager) {
    this.onInit('root.downend');
    this.on('root.downend');
}
MenuAction.prototype.onEvent = function (event) {
    switch (event.id) {
        case 'root.downend_r':
            this.popupMenu(event);
            break;
        case 'root.downend':
            if (!this.focus) {
                this.stopMenu();
            }
            break;
    }
}
/**
 * popup right click menu
 * @param event
 */
MenuAction.prototype.popupMenu = function (event) {
    this.focus = false;

    // if table menu
    var target = this.checkTarget(event, 'mousedown.link', 'mousedown.field', 'mousedown.table');
    target = target || this.backmenu;

    var local = this.camera.toLocal(block.event.x, block.event.y);

    // change position
    if (target === this.target) {
        this.menu.showprevious(local[0], local[1]);
        return;
    }
    this.target = target;
    this.menu.show(local[0], local[1], target.getMenu());
    this.active = true;
}
MenuAction.prototype.checkTarget = function (event) {
    var t;
    for (var i = 1, l = arguments.length; i < l; i++) {
        if (t = this.getParam(event, arguments[i])) {
            return t;
        }
    }
    return null;
}
MenuAction.prototype.onMenuClick = function (command) {
    this.target.runMenuAction(command);
    this.stopMenu();
}
MenuAction.prototype.onMenuDown = function () {
    this.focus = true;
}
MenuAction.prototype.stopMenu = function () {
    this.menu.hide();
    this.target = null;
}
