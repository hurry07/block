/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午6:46
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// Field
// ==========================
function Field(p) {
    Node.call(this, p);
}
_node(Field, Node);
Field.prototype.targetType = 'field';
Field.prototype.createView = function () {
    return this.rootView().append('svg:g').classed('field', true)
}
Field.prototype.enter = function () {
    var p = Table.prototype.prefer;
    var fw = p.width;
    var fh = p.field.height;
    var fp = p.field.prefix;
    var i = ListNode.prototype.getChildId(this);
    var d = this.data;

    //.on('click', this.handleEdit)
    this.view
        .on('mousedown', this.handleDown, this)
        .on('mouseover', this.handleOver, this)
        .$t().translate(0, (fh * i)).end();

    this.view
        .append('svg:rect')
        .attr({'width': fw, 'height': fh});

    this.view
        .append('svg:text')
        .classed('fieldname', true)
        .attr({'x': fp, 'y': fh / 2, 'dy': 6})
        .text(d.name)
}
Field.prototype.update = function (dold, dnew) {
    var d = dnew;
    var ui = this.view;
    ui.select('text').text(d.name);
}
Field.prototype.handleClick = function (d) {
    uiMgr.handle({id: ActionTypes.MOUSE_CLICK, 'target': Node.getNode(d), 'id': 'name'});
}
Field.prototype.identifier = function (d) {
    return d.type + d.name;
}
Field.prototype.getLinkStart = function () {
    var p = Table.prototype.prefer;
    return this.camera.getLocal(this.view, [p.width, p.field.height / 2]);
}
Field.prototype.getLinkEnd = function () {
    var p = Table.prototype.prefer;
    return this.camera.getLocal(this.view, [0, p.field.height / 2]);
}
Field.prototype.getViewNode = function () {
    return this.view.tag();
}
Field.prototype.getName = function () {
    if (!this.table) {
        console.log(this.name);
    }
    return this.table.getName() + '.' + this.data.name;
}
// ----------------------
// interact with text input.
Field.prototype.beginInput = function (id, text) {
    text.value = this.data.name;
    this.view.classed('edit', true);
}
Field.prototype.endInput = function (id, text) {
    this.data.name = text.value;
    this.refresh();
    this.view.classed('edit', false);
}
Field.prototype.getSize = function (id) {
    var p = Table.prototype.prefer;
    var fw = p.width;
    var fh = p.field.height;
    return [0, 0, fw, fh];
}
Field.prototype.getNode = function () {
    return this.view.node();
}
/**
 * interact with right click
 * @returns {Array}
 */
Field.prototype.getMenu = function () {
    return [
        {keys: 'L', command: 'table.field.remove'}
    ];
}
Field.prototype.runMenuAction = function (action) {
    switch (action) {
        case 'table.field.remove':
            break;
    }
    console.log(action);
}

// ======================
// Link
// ======================
function Link(p) {
    Node.call(this, p);
    this.id = '';
}
_node(Link, Node);
Link.prototype.targetType = 'link';
Link.prototype.identifier = function (d) {
    return d.from.getId() + '->' + d.to.getId();
}
Link.prototype.cloneData = function (d) {
    return {from: d.from.clone(), to: d.to.clone()};
}
Link.prototype.createView = function () {
    return this.rootView().append('svg:g').classed('link', true);
}
/**
 * this.data {
 *     start(x,y),
 *     end(x,y)
 * }
 */
Link.prototype.enter = function (d) {
    if (this.pointerdis) {
        this.view.attr('pointer-events', 'none');
    }

    this.curve = this.view
        .append('svg:path')
        .classed('curve', true)
        .on('mousedown', this.handleDown, this);
    this.start = this.view.append('svg:circle')
        .classed('start', true)
        .attr('r', 9)
    this.end = this.view
        .append('svg:g');
    this.end.append('svg:path')
        .classed('end', true)
        .attr('d', this.endArc())

    this.id = this.identifier(d);

    this.update(d);
}
Link.prototype.exit = function () {
    console.log('Link.prototype.exit');
}
Link.prototype.handleDown = listenEvent(ActionTypes.MOUSE_DOWN);
Link.prototype.getId = function () {
    return this.id;
}
Link.prototype.update = function (d) {
    var n1, n2;
    if ((n1 = d.from.node()) && (n2 = d.to.node())) {
        this.show();

        var p1 = n1.getLinkStart();
        var p2 = n2.getLinkEnd();
        this.start.attr('cx', p1[0]).attr('cy', p1[1]);
        this.end.transform().translate(p2[0], p2[1]).end();

        this.updateCurve(p1, p2);
    } else {
        this.hide();
    }
}
Link.prototype.export = function () {
    var n1, n2, d = this.getData();
    var data = {};
    if ((n1 = d.from.node()) && (n2 = d.to.node())) {
        data.start = n1.getName();
        data.end = n2.getName();
        data.type = 'single';
    }
    return data;
}
Link.prototype.updateCurve = function (p1, p2) {
    var gx = p2[0] - p1[0];
    var gy = p2[1] - p1[1];
    var c = Math.max(-Math.min(gx, gy), Math.max(gx, gy)) / 4;

    var path = this.curve.path().M(p1[0], p1[1]);
    if (gx > 0) {
        path.q(c, 0, gx / 2, gy / 2);
        path.t(gx / 2, gy / 2);
    } else {
        path.q(-c, 0, gx / 2 - c, gy / 2);
        path.t(gx / 2 + c, gy / 2);
    }
    path.end();
    this.start.attr('cx', p1[0]).attr('cy', p1[1]);
    this.end.transform().translate(p2[0], p2[1]).end();
}
Link.prototype.endArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(10)
    .startAngle(-Math.PI)
    .endAngle(0);
Link.prototype.exit = function (d) {
    this.view.remove();
}
Link.prototype.hide = function () {
    this.view.style('visibility', 'hidden');
}
Link.prototype.show = function () {
    this.view.style('visibility', 'visible');
}
Link.prototype.disablePointer = function () {
    this.pointerdis = true;
}
/**
 * menu adapter
 */
Link.prototype.getMenu = function () {
    return [
        {keys: 'L', command: 'link.remove'}
    ];
}
Link.prototype.runMenuAction = function (action) {
    switch (action) {
        case 'link.remove':
            break;
    }
    console.log(action);
}

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
    this.fields = new Fields(this, fieldsBg);
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
/**
 * get relative start to this table
 */
Table.prototype.getLinkStart = function () {
    var p = this.prefer;
    return this.camera.getLocal(this.view, [p.width, p.header.height / 2]);
};
Table.prototype.getLinkEnd = function () {
    var p = this.prefer;
    return  this.camera.getLocal(this.view, [0, p.header.height / 2]);
};
Table.prototype.getViewNode = function () {
    return this.view.tag();
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
    switch (f) {
        case 'move':
            return this.getMoveFeature();
        default :
            console.error('Unsupported feature found:' + f);
            return null;
    }
}
Table.prototype.export = function () {
    var td = this.data;
    td.fields = this.fields.export();// update field
    return td;
}
// ==========================
// container types
// ==========================
var Fields = Node.createContainer(Field, {
    getField: function (name) {
        var f;
        this.getChildren().iterator(function (node) {
            if (node.node().getData().name == name) {
                f = node.node();
                return false;
            }
        });
        return f;
    },
    export: function () {
        var data = [];
        this.getChildren().each(function (node) {
            data.push(node.node().getData())
        });
        return data;
    },
    createChild: function () {
        var child = new Field(this);
        child.create();
        child.table = this.parentNode;// bind table
        return child;
    }
});

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
// ==========================
// Links
// ==========================
function LinkCollection(p, view) {
    ListNode.call(this, p);
    this.view = view;
}
Node.createContainer(Link, {
    constructor: LinkCollection
});
LinkCollection.prototype.createChild = function () {
    return Link.create(this);
}
LinkCollection.prototype.identifier = Link.identifier;
LinkCollection.prototype.getChildren = function () {
    return this.view.selectAll('g > .link');
}
LinkCollection.prototype.export = function () {
    var data = [];
    this.getChildren().each(function (link) {
        data.push(link.node().export());
    })
    return data;
}
