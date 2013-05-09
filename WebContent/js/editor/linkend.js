/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午10:37
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// Link end point
// ==========================
function LinkTerminal(table, field) {
    switch (arguments.length) {
        case 2:
            this._table = table;
            this._field = field;
            this.type = this.Types.FIELD;
            break;
        case 1:
            this._table = table;
            this.type = this.Types.TABLE;
            break;
        case 0:
            this.type = this.Types.NONE;
            break;
    }
}
LinkTerminal.prototype.setTarget = function (target, point) {
    this._target = target;
    this._point = point;
    return this;
}
/**
 * translate to local point in certain camera
 * @param camera
 * @returns {*}
 */
LinkTerminal.prototype.transform = function (camera) {
    return camera.getLocal(this._target, this._point);
}
LinkTerminal.prototype.isNull = function () {
    return this.type == this.Types.NONE;
}
LinkTerminal.prototype.Types = {
    TABLE: 'table',
    FIELD: 'field',
    NONE: 'none'
}
LinkTerminal.prototype.node = function () {
    switch (this.type) {
        case this.Types.FIELD:
            return this._field;
        case this.Types.TABLE:
            return this._table;
    }
    return null;
}
LinkTerminal.prototype.table = function () {
    return this._table;
}
LinkTerminal.prototype.getId = function () {
    switch (this.type) {
        case this.Types.FIELD:
            return this._field.getName();
        case this.Types.TABLE:
            return this._table.getName();
    }
    return '';
}
LinkTerminal.prototype.reset = function () {
    delete this._field;
    delete this._table;
    delete this._target;
    delete this._point;
    this.type = this.Types.NONE;
}
LinkTerminal.prototype.clone = function () {
    switch (this.type) {
        case this.Types.FIELD:
            return new LinkTerminal(this._table, this._field).setTarget(this._target, this._point);
        case this.Types.TABLE:
            return new LinkTerminal(this._table).setTarget(this._target, this._point);
    }
    return new LinkTerminal();
}
