/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:15
 * To change this template use File | Settings | File Templates.
 */
// =====================
// Link
// =====================
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
