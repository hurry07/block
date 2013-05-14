/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-12
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */
function Sheet(manager, id, prefer, columns) {
    columns.each(function (column) {
        column.height = prefer.row.height;
    })

    this.manager = manager;
    this.id = id;
    this.prefer = prefer;
    this.columns = columns;

    this.view = manager.view.append('g').classed('tabledata', true);
    this.table = this.createTable();
    this.table.bindHeader(this.createHeader());
}
Sheet.prototype.createHeader = function () {
    var header = {};
    this.columns.each(function (c) {
        header[c.name] = c.name;
    });
    return header;
}
Sheet.prototype.headerColumn = function () {
    var header = [];
    this.columns.each(function (c) {
        header.push({name: c.name, type: 'string', width: c.width, height: c.height});
    });
    return header;
}
Sheet.prototype.createTable = function () {
    var prefer = this.prefer;
    var columns = this.columns;
    var hColumns = this.headerColumn();
    var camera = this.manager.camera;

    // ====================== row
    // define subclasses that contain closure config data
    var handledown = this.listener('cell.down');
    var cell = _defineClass(Cell, {
        createView: function () {
            return this.rootView().append('g').classed('cell', true).on('mousedown', handledown, this);
        },
        getFeature: function (f) {
            switch (f) {
                case 'edit':
                    return new CellEdit(camera, this);
            }
        },
        prefer: prefer.cell
    });
    // define row class that contains column config in it
    var row = _defineClass(Row, {
        columns: columns,
        createCell: function (column) {
            var c = new cell(this, column);
            c.create();
            return c;
        },
        createView: function () {
            return this.rootView().append('g').classed('row', true);
        }
    });

    // ======================
    var headclick = this.listener('head.click');
    var headcell = _defineClass(Cell, {
        createView: function () {
            return this.rootView().append('g').classed('cell', true).on('click', headclick, this);
        },
        prefer: prefer.cell
    });
    var headrow = _defineClass(Row, {
        columns: hColumns,
        createCell: function (column) {
            var c = new headcell(this, column);
            c.create();
            return c;
        },
        createView: function () {
            return this.rootView().append('g').classed('header', true);
        }
    });

    // instance closure
    var table = _defineClass(TableView, {
        createChild: function () {
            var r = new row(this);
            r.create();
            return r;
        },
        createHead: function () {
            var r = new headrow(this);
            r.create();
            return r;
        },
        prefer: prefer
    })
    return new table(Node.wrap(this.view), this.view);
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
function CellEdit(camera, cell) {
    this.camera = camera;

    this.cell = cell;
    this.column = cell.column;
    this.data = cell.parentNode.data;
    this.text = this.data[this.column.name];
}
CellEdit.prototype.endEdit = function (input) {
    this.cell.text.style('visibility', 'visible');
    this.cell.bind(this.data[this.column.name] = this.text);
}
CellEdit.prototype.startEdit = function (input) {
    input.style({'font-size': '17px', 'text-indent': '4px'});
    input.tag().value = this.text;
    this.cell.text.style('visibility', 'hidden');
}
CellEdit.prototype.setText = function (t) {
    this.text = t;
}
CellEdit.prototype.getTarget = function () {
    var p = this.camera.getLocal(this.cell.view, [0, 0]);
    p.push(this.column.width, this.column.height);
    return p;
}
