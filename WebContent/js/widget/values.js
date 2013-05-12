/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午10:25
 * To change this template use File | Settings | File Templates.
 */
/**
 *
 * @param root
 * @constructor
 */
function ValueComp(root) {
    WindowComponent.call(this, root);

    // @param columns [{type:string,name:name,width:150,height:18}]
    this.prefer = {
        columns: [
            {type: 'string', name: 'name', width: 150, height: 18},
            {type: 'string', name: 'age', width: 80, height: 18}
        ],
        init: {height: 18}
    };

    var _this = this;
    this.table = new TableView(Node.wrap(this.view), this.view.append('g').classed('tabledata', true));
    this.table.createChild = function () {
        return Row.create(_this.table, _this.prefer, _this);
    }
    this.celldown = this.listen('cell.down');

    this.bind([
        {name: 'test1', age: 23},
        {name: 'test2', age: 22},
        {name: 'test3', age: 21}
    ]);
}
_extends(ValueComp, WindowComponent);
/**
 *
 * @param data
 */
ValueComp.prototype.bind = function (data) {
    this.table.bind(data);
}
ValueComp.prototype.handleEvent = function (event) {
    console.log(event);
}
/**
 * used as cell create adapter
 *
 * @param row
 * @param name
 * @param type
 * @returns {Cell}
 */
ValueComp.prototype.createCell = function (row, name, type) {
    if (type) {
    }
    var cell = Cell.create(row, name);
    cell.view.on('mousedown', this.celldown, cell);
    return cell;
}
/**
 * react to window resize event
 */
ValueComp.prototype.onResize = function () {
    // put component to new position
    this.view.$t().translate(this.area.absx, this.area.absy).end();
    // resize all layers
    for (var i = -1, L = this.layers, len = L.length; ++i < len;) {
        L[i].onSizeChange(this.area);
    }
}
