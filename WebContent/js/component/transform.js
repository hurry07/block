/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-12
 * Time: 下午11:52
 * To change this template use File | Settings | File Templates.
 */
// ======================
// camera
// ======================
/**
 * similar to camera but much simpler,
 * the root's 0,0 is the area's left top corner and there's no transform applied to the root element
 *
 * @param area belong to a component
 * @param root view of a component
 * @constructor
 */
function Transform(area, root) {
    this.area = area;
    this.root = root.tag();
}
// matrix transform util methods
/**
 * transform form local coordinate to screen coordinate
 * @param g
 * @returns {mat2d}
 */
Transform.prototype.getWorldMatrix = function (g) {
    var matrix = this.getRootMatrix(g);
    mat2d.translate(matrix, matrix, vec2.clone([this.area.absx, this.area.absy]));
    return matrix;
}
/**
 * transform to root coordinate system
 * @param g
 * @returns {mat2d}
 */
Transform.prototype.getRootMatrix = function (g) {
    var matrix = this.getMatrix(g, this.root);
    mat2d.translate(matrix, matrix, vec2.clone([this.area.absx, this.area.absy]));
    return matrix;
}
Transform.prototype.getMatrix = function (from, to) {
    var svgM = from.getTransformToElement(to);
    return mat2d.clone([svgM.a, svgM.b, svgM.c, svgM.d, svgM.e, svgM.f]);
}
/**
 * apply matrix to a point and return the result
 *
 * @param matrix
 * @param p [x,y]
 */
Transform.prototype.transform = function (matrix, p) {
    p = vec2.clone(p);
    vec2.transformMat2d(p, p, matrix);
    return [p[0], p[1]];
}
/**
 * @param g
 * @param p
 * @returns {*}
 */
Transform.prototype.toWorld = function (g, p) {
    return this.transform(this.getWorldMatrix(g.tag()), p);
}
Transform.prototype.toLocal = function (x, y) {
    return [(x - this.area.absx), (y - this.area.absy)];
}
/**
 * @param g
 * @param p
 * @returns {*}
 */
Transform.prototype.getLocal = function (g, p) {
    return this.transform(this.getRootMatrix(g.tag()), p);
}
