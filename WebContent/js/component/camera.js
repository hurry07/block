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
 *
 * @param area is outer of viewbox
 * @param viewbox
 * @param root element of viewbox
 * @constructor
 */
function Camera(area, viewbox, root) {
    this.viewbox = viewbox;
    this.root = root.tag();
    this.area = area;

    // window size
    this.width = 0;
    this.height = 0;
    // coordinate scale
    this.scalef = 1;
    // coordinate start
    this.startx = 0;
    this.starty = 0;
}
Camera.prototype.apply = function (sx, sy) {
    if (arguments.length == 0) {
        sx = this.startx;
        sy = this.starty;
    }
    var w = this.width / this.scalef;
    var h = this.height / this.scalef;
    this.viewbox.attr('viewBox', sprintf('%f %f %f %f', sx, sy, w, h));
}
/**
 * drag end
 * @param mx
 * @param my
 */
Camera.prototype.move = function (mx, my) {
    this.startx -= mx / this.scalef;
    this.starty -= my / this.scalef;
    this.apply();
}
/**
 * during the drag movment
 * @param mx
 * @param my
 */
Camera.prototype.moving = function (mx, my) {
    var sx = this.startx - mx / this.scalef;
    var sy = this.starty - my / this.scalef;
    this.apply(sx, sy);
}
/**
 * when user resize the browser
 *
 * @param width
 * @param height
 */
Camera.prototype.resize = function (width, height) {
    this.width = width;
    this.height = height;
    this.viewbox.attr({width: this.width, height: this.height});
    this.apply();
}
/**
 * 对屏幕上指定的点缩放
 *
 * @param scalef
 * @param currentx
 * @param currenty
 */
Camera.prototype.scale = function (scalef, currentx, currenty) {
    this.scalef = scalef;
    if (arguments.length == 3) {
    }
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
        -this.startx + area.x * this.scalef,
        -this.starty + area.y * this.scalef]));
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
        (x - this.area.x) / this.scalef + this.startx,
        (y - this.area.y) / this.scalef + this.starty
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
BgCamera.prototype.apply = function (sx, sy) {
    if (arguments.length == 0) {
        sx = this.startx;
        sy = this.starty;
    }
    var w = this.width / this.scalef;
    var h = this.height / this.scalef;
    this.viewbox.attr('viewBox', sprintf('%f %f %f %f', sx, sy, w, h));
    this.bg.attr({x: sx, y: sy, width: w, height: h});
}
