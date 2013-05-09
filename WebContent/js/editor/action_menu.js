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
function MenuAction(view, camera) {
    Action.call(this);

    this.view = view;
    this.camera = camera;

    this.focus = false;
    this.target = null;
    this.backmenu = new DefaultMenu();

    this.menu = Menu.create(Node.wrap(view), this);
}
_extends(MenuAction, Action);
MenuAction.prototype.onRegister = function (manager) {
    this.onInit('root.downend');
    this.on('root.downend');
}
MenuAction.prototype.onEvent = function (event) {
    if (eventBt(block.event, 2)) {
        this.popupMenu(event);
    } else {
        if (!this.focus) {
            this.stopMenu();
        }
    }
}
/**
 * popup right click menu
 */
MenuAction.prototype.popupMenu = function () {
    this.focus = false;

    // if table menu
    var target = this.getParam('mousedown.link', 'mousedown.field', 'mousedown.table') || this.backmenu;
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
