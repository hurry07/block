/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午6:46
 * To change this template use File | Settings | File Templates.
 */
// ======================
// Table
// ======================
function Table(p) {
    Node.call(this, p);
    this.linkout = [];
    this.linkin = [];
    this.type = '{';
}
_node(Table, Node);
Table.prototype.addLinkOut = function (link) {
    this.linkout.push(link);
}
Table.prototype.addLinkIn = function (link) {
    this.linkin.push(link);
}
Table.prototype.hasLink = function (link) {
    var id = Link.prototype.identifier(link);
    for (var i = 0, links = this.linkout , l = links.length; i < l; i++) {
        if (links[i].getId() == id) {
            return true;
        }
    }
    return false;
}
Table.prototype.rmLinkOut = function (link) {
    var i = this.linkout.indexOf(link);
    if (i != -1) {
        this.linkout.splice(i, 1);
    }
}
Table.prototype.rmLinkIn = function (link) {
    var i = this.linkin.indexOf(link);
    if (i != -1) {
        this.linkin.splice(i, 1);
    }
}
Table.prototype.targetType = 'table';
/**
 * table 的几种类型 {} [float|int|boolean|double|char] [{}] [{}*]
 * @type {Array}
 */
Table.prototype.types = ['view', 'map', 'table', 'array'];
Table.prototype.prefer = {
    header: {
        height: 45,
        prefix: 8
    },
    field: {
        height: 24,
        prefix: 4
    },
    footer: {
        height: 18
    },
    width: 150
};
Table.prototype.getName = function () {
    return this.data.name;
}
Table.prototype.createView = function () {
    return this.rootView().append('svg:g');
}
Table.prototype.getIcon = function (t) {

}
Table.prototype.enter = function (d) {
    var p = this.prefer.header;
    var w = this.prefer.width;

    // view
    this.view.attr('transform', 'translate(' + d.position.x + ',' + d.position.y + ')')
        .classed('table', true)
        .classed(d.type, true)
        .on('mousedown', this.handleDown, true, this);

    // header
    this.header = this.view
        .append('svg:g')
        .on('mousedown', this.handleDown, this)
        .on('mouseover', this.handleOver, true, this)
    this.header.append('svg:rect')
        .attr('width', this.prefer.width)
        .attr('height', p.height)
        .classed('header', true);

    // title
    this.title = this.header.append('svg:text')
        .attr({x: p.prefix, y: p.height / 2, dy: 8})
        .classed('headername', true)
        .text(d.name);

    // fields bg
    var fieldsBg = this.view.append('svg:g')
        .attr("transform", 'translate(0,' + p.height + ')')
        .classed('fields', true)
        .on('mousedown', this.handleDown, true, this)
        .on('mouseover', this.handleOver, true, this)

    // fields
    var fields = this.fields = new Fields(this, fieldsBg);
    var table = this;

    // use closure to bind table instance to filed created
    this.fields.createChild = function () {
        var c = Field.create(fields);
        c.table = table;
        return c;
    }
    this.fields.bind(d.fields);

    // footer
    p = this.prefer.footer;
    this.footer = this.view.append('svg:rect')
        .attr('width', w)
        .attr('height', p.height)
        .attr('y', this.getHeight() - p.height)
        .on('mousedown', this.handleDown, this)
        .classed('footer', true);
}
Table.prototype.update = function (dold, dnew) {
    var d = dnew;

    this.title.text(d.name);

    this.fields.bind(dnew.fields);

    var p = this.footer;
    this.footer
        .attr('y', this.getHeight() - p.height)
        .classed('footer', true);
};
Table.prototype.getHeight = function () {
    var d = this.data;
    var p = this.prefer;
    return d.fields.length * p.field.height + p.header.height + p.footer.height;
};
Table.prototype.isTable = function (t) {
    return this.types.indexOf(t) != -1;
};
Table.prototype.hasField = function (f) {
    if (!f) {
        return false;
    }
    for (var i = 0, fs = this.data.fields, l = fs.length; i < l; i++) {
        if (fs[i] === f.data) {
            return true;
        }
    }
    return false;
};
Table.prototype.getField = function (name) {
    return this.fields.getField(name);
};
Table.prototype.getLinkEnd = function () {
    var p = this.prefer;
    return  this.camera.getLocal(this.view, [0, p.header.height / 2]);
};
// interact with menu
Table.prototype.getMenu = function () {
    return [
        {keys: '', command: 'table.remove'},
        {keys: 'R', command: 'table.rename'},
        {keys: 'F', command: 'table.field.add'}
    ];
}
Table.prototype.runMenuAction = function (action) {
    switch (action) {
        case 'table.remove':
            break;
        case 'table.rename':
            break;
        case 'table.add.field':
            break;
    }
    console.log(action);
}
Table.prototype.getMoveFeature = function () {
    var table = this;
    var links = [].concat(this.linkout).concat(this.linkin);
    return new (_extends(function () {
        MoveAdapter.call(this, table.data.position, table.view);
    }, MoveAdapter, {
        startMove: function (x, y) {
            MoveAdapter.prototype.startMove.call(this, x, y);
            table.view.classed('focus', true);
        },
        moveTo: function (x, y) {
            MoveAdapter.prototype.moveTo.call(this, x, y);
            // update link terminate when moving the table
            for (var i = 0, l = links.length; i < l; i++) {
                links[i].refresh();
            }
        },
        stopMove: function (x, y) {
            table.view.classed('focus', false);
        }
    }))();
}
/**
 * interact with global function
 * @param f
 * @returns {*}
 */
Table.prototype.getFeature = function (f) {
    var p = this.prefer;
    switch (f) {
        case 'move':
            return this.getMoveFeature();
        case 'link.start':
            return new LinkTerminal(this).setTarget(this.view.tag(), [p.width, p.header.height / 2]);
        case 'link.end':
            return new LinkTerminal(this).setTarget(this.view.tag(), [0, p.header.height / 2]);
    }
    console.error('Unsupported feature found:' + f);
    return null;
}
Table.prototype.export = function () {
    var td = this.data;
    td.fields = this.fields.export();// update field
    return td;
}
// ==========================
// schema layer
// ==========================
function TableCollection(p, view) {
    ListNode.call(this, p);
    this.view = view;
    this.tables = new d3.map();
}
_extends(TableCollection, ListNode);
TableCollection.prototype.updateEnd = function (children) {
    var map = new d3.map();
    children.each(function (t) {
        map.set(t.getData().name, t);
    });
    this.tables = map;
}
/**
 * find link end point
 *
 * @param nodeid
 * @returns {*}
 */
TableCollection.prototype.getLinkNode = function (nodeid) {
    var tables = this.tables;
    var parts = (nodeid || '').split('.');
    if (parts.length == 0) {
        return null;
    }
    var table = tables.get(parts[0]);
    if (!table) {
        return null;
    }

    var p = new LinkTerminal();
    p.table(table);

    if (parts.length == 2) {
        var field = table.getField(parts[1]);
        if (!field) {
            return null;
        } else {
            p.field(field);
        }
    }
    p.updatetype();
    return p;
}
/**
 * sort links and tables
 * @param table current focus table
 */
TableCollection.prototype.order = function (table) {
    var tables = this.view.selectAll('g.entity > g');
    var nodes = tables.nodes();
    var z = 0;
    var t;
    var tnode;
    for (var i = 0, l = nodes.length; i < l; i++) {
        if ((t = nodes[i].node()) instanceof Table) {
            if (t === table) {
                nodes.push(tnode = nodes[i]);
                nodes.splice(i, 1);
                i--;
                l--;
            } else {
                nodes[i].zindex = z++;
            }
        }
    }
    tnode && (tnode.zindex = z);
    tables.order();
}
TableCollection.prototype.getChildren = function () {
    return this.view.selectAll('g > .table');
}
TableCollection.prototype.createChild = function () {
    return Table.create(this);
}
TableCollection.prototype.identifier = Table.identifier;
TableCollection.prototype.export = function () {
    var data = [];
    this.getChildren().each(function (node) {
        data.push(node.node().export());
    });
    return data;
}
