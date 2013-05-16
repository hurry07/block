function TitleWidget(view) {
    this.view = view;
}
TitleWidget.prototype.append = function(str) {
    var child = this.view.append('g');
    child.append('rect');
    child.append('text').text(str);
    return child;
}
function TabWidget(view) {
    WindowComponent.call(this, view);
    this.title = new TitleWidget(this.view.append('g').classed('title', true));
    this.children = {};
}
_extends(TabWidget, WindowComponent);
TabWidget.prototype.add = function (name, id, child) {
    //var label = this.
}
TabWidget.prototype.prefer = {
    height: 20
}
TabWidget.prototype.onResize = function () {
    this.view.$t().translate(this.area.absx, this.area.absy).end();
}
TabWidget.prototype.createArea = function () {
    var area = new LinerLayout('v');
    return area;
}