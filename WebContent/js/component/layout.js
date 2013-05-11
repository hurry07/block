/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:11
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// Area stands for a screen area, layout logic will interact with this interface
// ==========================
function Area(listener) {
    if (listener) {
        this.listener = listener;
    }
    this.x = this.y = 0;
    this._width = this._height = 0;
    this.absx = this.absy = 0;
    this.parentx = this.parenty = 0;
}
Area.prototype.init = function (x, y, w, h) {
    if (arguments.length == 4) {
        this.x = x;
        this.y = y;
        this._width = w;
        this._height = h;
        return this;
    }
    this.x = this.y = 0;
    if (arguments.length == 2) {
        this._width = x;
        this._height = y;
    }
    return this;
}
Area.prototype.addListener = function (lis) {
    this.listener = lis;
}
Area.prototype.size = function (w, h) {
    if (arguments.length == 0) {
        return [this.getWidth(), this.getHeight()];
    }
    this.setWidth(w);
    this.setHeight(h);
    this.onResize();
}
Area.prototype.position = function (x, y) {
    if (arguments.length == 0) {
        return [this.x , this.y];
    }
    this.x = x;
    this.y = y;
}
Area.prototype.parentPos = function (x, y) {
    this.parentx = x;
    this.parenty = y;
    this.absx = this.x + x;
    this.absy = this.y + y;
}
Area.prototype.setAbsPosition = function (parentx, parenty) {
    this.absx = parentx + this.x;
    this.absy = parentx + this.y;
}
Area.prototype.width = function (w) {
    if (arguments.length == 0) {
        return this.getWidth();
    }
    this.setWidth(w);
}
Area.prototype.getWidth = function () {
    return this._width;
}
Area.prototype.setWidth = function (w) {
    this._width = w;
}
Area.prototype.height = function (h) {
    if (arguments.length == 0) {
        return this.getHeight();
    }
    this.setHeight(h);
}
Area.prototype.getHeight = function () {
    return this._height;
}
Area.prototype.setHeight = function (h) {
    this._height = h;
}
Area.prototype.updateWidth = function (w) {
    this.size(w, this._height);
}
Area.prototype.updateHeight = function (h) {
    this.size(this._width, h);
}
Area.prototype.refresh = function () {
    this.width(this._width);
    this.height(this._height);
}
/**
 * notice current object's size has changed
 */
Area.prototype.onResize = function () {
    //console.log(this.x, this.y, this._width, this._height);
    if (this.listener) {
        this.listener.onResize();
    }
}
