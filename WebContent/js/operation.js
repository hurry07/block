/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-4-12
 * Time: 上午10:34
 * To change this template use File | Settings | File Templates.
 */
/**
 * object drag or move
 *
 * @param p point object that log the moving
 * @param g the moving object
 * @constructor
 */
function MoveAdapter(p, g) {
    this.position = p;
    this.g = g;
    this.offsetx = 0;
    this.offsety = 0;
}
MoveAdapter.prototype.startMove = function (x, y) {
    this.offsetx = this.position.x - x;
    this.offsety = this.position.y - y;
}
MoveAdapter.prototype.moveTo = function (x, y) {
    this.position.x = x + this.offsetx;
    this.position.y = y + this.offsety;
    this.g.attr('transform', 'translate('
        + (this.position.x = x + this.offsetx) + ','
        + (this.position.y = y + this.offsety) + ')');
}
MoveAdapter.prototype.stopMove = function (x, y) {
}
