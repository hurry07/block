/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-10
 * Time: 下午11:02
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// items in left
// ==========================
/**
 * {id: 'int', init: 'edit.name' }
 */
function Entry(p) {
    Node.call(this, p);
}
_node(Entry, Node);
Entry.prototype.prefer = {
    width: 200,
    height: 24,
    prefix: 8
}
Entry.prototype.getName = function () {
    return this.id;
}
Entry.prototype.createView = function () {
    return this.rootView().append('svg:g')
        .classed('comp', true);
}
Entry.prototype.enter = function (data) {
    var w = this.prefer.width;
    var h = this.prefer.height;
    var pre = this.prefer.prefix;

    this.bg = this.view.append('svg:rect')
        .attr({width: w, height: h});
    this.text = this.view.append('svg:text')
        .attr({x: pre, y: h, dy: -6})
        .text(data.id);
    this.topline = this.view.append('path')
        .attr('d', sprintf('M0,0 l%f,0', w))
        .classed('topline', true);
}
Entry.prototype.update = function (data) {
    this.text.text(data.id);
}
Entry.prototype.show = function () {
    this.view.classed({'show': true, 'hide': false});
}
Entry.prototype.hide = function () {
    this.view.classed({'show': false, 'hide': true});
}
Entry.prototype.match = function (text) {
    if (!text || text.length == 0) {
        this.text.text(this.data.id);
        return 0;
    } else {
        var id = 0;
        this.text.childNodes().remove();
        var start = 0;
        var end = -1;
        var index = 0;
        var content = this.data.id;
        for (var i = 0, l = text.length; i < l; i++) {
            var c = text.charAt(i);
            if ((index = content.indexOf(c, end)) != -1) {
                if (index > end) {
                    if (end > start) {
                        id += (1 << (end - start + 1));
                        this.text.append('tspan').classed('light', true).text(content.substring(start, end));
                        start = end;
                    }
                    if (index > start) {
                        //id -= (1 << (index - start));
                        this.text.append('tspan').text(content.substring(start, index));
                        start = index;
                    }
                }
                end = index + 1;
            } else {
                break;
            }
        }
        if (end > start) {
            id += (1 << (end - start + 1));
            this.text.append('tspan').classed('light', true).text(content.substring(start, end));
            start = end;
        }
        if (content.length > start) {
            if (start > 0) {
                //id -= (1 << (content.length - start));
                this.text.append('tspan').text(content.substring(start));
            } else {
                id = 0;
                this.text.text(content);
            }
        }
        return id;
    }
}
Entry.prototype.width = function (w) {
    this.bg.attr('width', w);
    this.topline.path().M(0, 0).l(w, 0).end();
}
Entry.prototype.position = function (x, y) {
    this.view.attr('transform', sprintf('translate(%f,%f)', x, y));
}
