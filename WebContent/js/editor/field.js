/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:17
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
Field.prototype.identifier = function (d) {
    return d.type + d.name;
}
Field.prototype.getName = function () {
    return this.table.getName() + '.' + this.data.name;
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
Field.prototype.getFeature = function (id) {
    var p = Table.prototype.prefer;
    switch (id) {
        case 'link.start':
            return new LinkTerminal(this.table, this).setTarget(this.view, [p.width, p.field.height / 2]);
        case 'link.end':
            return new LinkTerminal(this.table, this).setTarget(this.view, [0, p.field.height / 2]);
    }
    console.error('Unsupported feature found:' + f);
    return null;
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
    }
    // createChild Table.fields.createChild
});
