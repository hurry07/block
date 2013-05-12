/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-12
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */
function Sheet(manager, id, prefer, columns) {
    this.manager = manager;
    this.id = id;
    this.prefer = prefer;
    this.columns = columns;

    this.view = manager.view.append('g').classed('tabledata', true);
    this.table = this.createTable();
}
Sheet.prototype.createTable = function () {
    var prefer = this.prefer;
    var manager = this.manager;
    var columns = this.columns;

    // define subclasses that contain closure config data
    var handledown = this.listen('cell.down');
    var cell = _defineClass(Cell, {
        handleDown: manager.listen('cell.down'),
        createView: function () {
            return this.rootView().append('g').classed('cell', true).on('mousedown', handledown, this);
        }
    });
    cell.create = function (p, name) {
        var c = new cell(p, name);
        c.create();
        return c;
    }

    // define row class that contains column config in it
    var row = _defineClass(Row, {
        columns: columns,
        createCell: function (name, type) {
            return cell.create(this, name);
        }
    });
    row.create = function (p) {
        var r = new row(p);
        r.height = prefer.row.height;
        r.create();
        return r;
    }

    // instance closure
    var table = new TableView(Node.wrap(this.view), this.view);
    table.createChild = function () {
        return row.create(this);
    }
    return table;
}
Sheet.prototype.bind = function (data) {
    this.table.bind(data);
}
Sheet.prototype.listen = function (id) {
    var comp = this;
    var manager = this.manager;
    return function (event, target) {
        manager.handleEvent({id: id, sheet: comp.id, target: this});
    }
}