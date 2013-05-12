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
    var columns = this.columns;
    var sheet = this;

    // define subclasses that contain closure config data
    var handledown = this.listener('cell.down');
    var cell = _defineClass(Cell, {
        createView: function () {
            return this.rootView().append('g').classed('cell', true).on('mousedown', handledown, this);
        },
        getFeature: function (f) {
            switch (f) {
                case 'edit':
                    return new EditFeature(this, sheet.view);
            }
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
        createCell: function (column) {
            return cell.create(this, column);
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
Sheet.prototype.listener = function (id) {
    var manager = this.manager;
    var sheet = this;

    return function () {
        manager.handleEvent({id: 'cell.down', sheet: sheet.id, target: this});
    }
}
/**
 * the adapter between cell and a text input
 *
 * @param cell
 * @param view
 * @constructor
 */
function EditFeature(cell, view) {
    this.cell = cell;
    this.view = view;
}
EditFeature.prototype.endEdit = function (input) {
    this.search.cell.style('visibility', 'visible');
    //this.search.text.style('fill', 'inherit');
}
EditFeature.prototype.startEdit = function (input) {
    input.style({'font-size': '22px', 'text-indent': '4px'});
    input.tag().value = this.key;
    this.cell.text.style('visibility', 'hidden');
    //this.search.text.style('fill', 'transparent');
}
EditFeature.prototype.getTarget = function () {
    var node = this.cell.view;
    var matrix = Camera.prototype.getMatrix(node.tag(), this.view.tag());
    var p = Camera.prototype.transform(matrix, [0, 0]);
    p.push(node.attr('width'), node.attr('height'));
    return p;
}
