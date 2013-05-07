/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-7
 * Time: 上午10:28
 * To change this template use File | Settings | File Templates.
 */

// code cost much time but not used, save it here for future search
/**
 * get a local to world (browser coordinate) matrix
 *
 * @param g
 * @param camera
 * @returns {mat2d}
 */
WindowComponent.prototype.getWorldMatrix = function (root, g, camera) {
    var svgM = g.tag().getTransformToElement(root.tag());

    var matrix = mat2d.create();
    var area = this.area;

    // apply camera transform
    mat2d.multiply(matrix, matrix, mat2d.clone([svgM.a, svgM.b, svgM.c, svgM.d, svgM.e, svgM.f]));
    if (camera) {
        mat2d.translate(matrix, matrix, vec2.clone([area.x * 2, area.y * 2]));
    } else {
        mat2d.translate(matrix, matrix, vec2.clone([area.x, area.y]));
    }
    return matrix;
}
/**
 * get a matrix that will transform inner element to coordinate relative to current component
 * do not consider camera's system.
 *
 * @param root
 * @param g
 * @param camera is an svg element
 * @returns {mat2d}
 */
WindowComponent.prototype.getLocalMatrix = function (root, g, camera) {
    var svgM = g.tag().getTransformToElement(root.tag());

    var matrix = mat2d.create();
    var area = this.area;

    // apply child transform
    mat2d.multiply(matrix, matrix, mat2d.clone([svgM.a, svgM.b, svgM.c, svgM.d, svgM.e, svgM.f]));
    if (camera) {
        mat2d.translate(matrix, matrix, vec2.clone([
            camera.startx * camera.scalef + area.x,
            camera.starty * camera.scalef + area.y]));
        mat2d.scale(matrix, matrix, vec2.clone([1 / camera.scalef, 1 / camera.scalef]));
    }
    return matrix;
}
/**
 * apply matrix to a point and return the result
 *
 * @param matrix
 * @param p [x,y]
 */
WindowComponent.prototype.transform = function (matrix, p) {
    p = vec2.clone(p);
    vec2.transformMat2d(p, p, matrix);
    return [p[0], p[1]];
}
WindowComponent.prototype.worldTransform = function (root, g, p, camera) {
    return this.transform(this.getWorldMatrix(root, g, camera), p);
}
WindowComponent.prototype.localTransform = function (root, g, p, camera) {
    return this.transform(this.getLocalMatrix(root, g, camera), p);
}
