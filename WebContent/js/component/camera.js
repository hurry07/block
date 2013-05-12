/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:09
 * To change this template use File | Settings | File Templates.
 */
// ======================
// camera
// ======================
/**
 * matrix transform util class
 *
 * @param area belong to a component
 * @param viewbox svg element
 * @param root svg's g child
 * @constructor
 */
function Camera(area, viewbox, root) {
    this.area = area;
    this.viewbox = viewbox
    this.root = root.tag();

    // coordinate scale
    this.scalef = 1;
    // coordinate start
    this.startx = 0;
    this.starty = 0;
}
/**
 * apply the latest size to svg element
 */
Camera.prototype.apply = function () {
    var sx = this.startx;
    var sy = this.starty;
    var w = this.area.width() / this.scalef;
    var h = this.area.height() / this.scalef;
    this.viewbox.attr('viewBox', sprintf('%f %f %f %f', sx, sy, w, h));
}
/**
 * make local x,y shows on screenx,screeny
 * @param x
 * @param y
 * @param screenx
 * @param screeny
 */
Camera.prototype.moveToScreen = function (x, y, screenx, screeny) {
    if (arguments.length == 2) {
        // move startx,starty relative to current position
        this.startx -= x / this.scalef;
        this.starty -= y / this.scalef;
    } else {
        this.startx = x - (screenx - this.area.absx) / this.scalef;
        this.starty = y - (screeny - this.area.absy) / this.scalef;
    }
    this.apply();
}
/**
 * move in local coordinate
 * @param x
 * @param y
 * @param tox
 * @param toy
 */
Camera.prototype.move = function (x, y, tox, toy) {
    if (arguments.length == 2) {
        // move startx,starty relative to current position
        this.startx -= x;
        this.starty -= y;
    } else {
        this.startx += x - tox;
        this.starty += y - toy;
    }
    this.apply();
}
/**
 * 对屏幕上指定的点缩放
 *
 * @param scalef
 * @param centerx scale center in screen coordinate
 * @param centery
 */
Camera.prototype.scaleToScreen = function (scalef, centerx, centery) {
    if (arguments.length == 3) {
        var local = this.toLocal(centerx, centery);
        this.scalef = scalef;
        this.moveToScreen(local[0], local[1], centerx, centery);
    } else {
        this.scalef = scalef;
        this.apply();
    }
}
/**
 * scale in local coordinate
 * @param scalef
 * @param centerx
 * @param centery
 */
Camera.prototype.scale = function (scalef, centerx, centery) {
    if (arguments.length == 3) {
        var p = this.scalef / scalef;
        this.scalef = scalef;
        this.move(centerx, centery, centerx * p, centery * p);
    } else {
        this.scalef = scalef;
        this.apply();
    }
}
/**
 * when user resize the browser
 */
Camera.prototype.resize = function (area) {
    this.viewbox.attr({width: this.area.width(), height: this.area.height()});
    this.apply();
}
// matrix transform util methods
/**
 * transform form local coordinate to screen coordinate
 * @param g
 * @returns {mat2d}
 */
Camera.prototype.getWorldMatrix = function (g) {
    var matrix = this.getRootMatrix(g);

    mat2d.translate(matrix, matrix, vec2.clone([
        -this.startx + this.area.absx * this.scalef,
        -this.starty + this.area.absy * this.scalef]));
    mat2d.scale(matrix, matrix, vec2.clone([1 / this.scalef, 1 / this.scalef]));
    return matrix;
}
/**
 * transform to root coordinate system
 * @param g
 * @returns {mat2d}
 */
Camera.prototype.getRootMatrix = function (g) {
    return this.getMatrix(g, this.root);
}
Camera.prototype.getMatrix = function (from, to) {
    var svgM = from.getTransformToElement(to);
    return mat2d.clone([svgM.a, svgM.b, svgM.c, svgM.d, svgM.e, svgM.f]);
}
/**
 * apply matrix to a point and return the result
 *
 * @param matrix
 * @param p [x,y]
 */
Camera.prototype.transform = function (matrix, p) {
    p = vec2.clone(p);
    vec2.transformMat2d(p, p, matrix);
    return [p[0], p[1]];
}
/**
 * @param g
 * @param p
 * @returns {*}
 */
Camera.prototype.toWorld = function (g, p) {
    return this.transform(this.getWorldMatrix(g.tag()), p);
}
Camera.prototype.toLocal = function (x, y) {
    return [
        (x - this.area.absx) / this.scalef + this.startx,
        (y - this.area.absy) / this.scalef + this.starty
    ];
}
/**
 * @param g
 * @param p
 * @returns {*}
 */
Camera.prototype.getLocal = function (g, p) {
    return this.transform(this.getRootMatrix(g.tag()), p);
}
/**
 * camera with a background
 *
 * @param area
 * @param viewbox
 * @param root
 * @param bg is a child of root element
 * @constructor
 */
function BgCamera(area, viewbox, root, bg) {
    Camera.call(this, area, viewbox, root);
    this.bg = bg;
}
_extends(BgCamera, Camera);
BgCamera.prototype.apply = function () {
    var sx = this.startx;
    var sy = this.starty;
    var w = this.area.width() / this.scalef;
    var h = this.area.height() / this.scalef;
    this.viewbox.attr('viewBox', sprintf('%f %f %f %f', sx, sy, w, h));
    this.bg.attr({x: sx, y: sy, width: w, height: h});
}
