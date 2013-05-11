/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午10:33
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// floating layout
// ==========================
function FrameLayout() {
    Area.call(this, 0, 0, 0, 0);
    this.children = [];
}
_extends(FrameLayout, Area);
/**
 *
 * @param area
 * @param type floating type fixed|relative|expand
 * @param param more parameter of certain type
 */
FrameLayout.prototype.add = function (area, type, param) {
    this.children.push({area: area, type: type || 'fixed', param: param});
}
FrameLayout.prototype.remove = function (child) {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            c.splice(i, 1);
            break;
        }
    }
}
FrameLayout.prototype.setWidth = function (w) {
    this._width = w;
    this.children.each(function (e) {
        switch (e.type) {
            case 'fixed':
                break;
            case 'relative':
                this.layoutRelative(e.area, e.param);
                break;
            case 'expand':
                e.area.size(this._width, this._height);
                e.area.position(this.x, this.y);
                break;
        }
    })
}
FrameLayout.prototype.layoutRelative = function (area, param) {
    // TODO not needed currently
}
