/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午7:00
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// right menu
// ==========================
function SearchBox(view) {
    var p = this.prefer;

    var w = 200;
    var v = this.view = view.append('g')
        .classed('search', true);

    this.bg = v.append('rect')
        .classed('bg', true)
        .attr({width: w, height: p.height});

    // input
    this.input = v.append('g')
        .classed('key', true)
        .attr('transform', sprintf('translate(%f,%f)', p.padding, p.padding));
    this.inputBg = this.input.append('rect')
        .classed('inputbg', true)
        .attr({
            width: w - p.height - p.padding,
            height: p.height - 2 * p.padding
        });
    this.text = this.input.append('text')
        .attr({'x': p.indent, 'y': p.height, dy: p.dy})
        .text('');

    this.button = v.append('rect')
        .classed('button', true)
        .attr({
            width: p.height - 2 * p.padding,
            height: p.height - 2 * p.padding,
            x: w - p.height + p.padding,
            y: p.padding
        })
        .on('click', function () {
            console.log('click');
        });
}
SearchBox.prototype.getInputSize = function () {
    return [0, 0, 0, this.prefer.height];
}
SearchBox.prototype.prefer = {
    height: 28,
    padding: 2,
    indent: 4,
    dy: -9
}
SearchBox.prototype.width = function (w) {
    var p = this.prefer;
    this.bg.attr('width', w);
    this.inputBg.attr('width', w - p.height - p.padding);
    this.button.attr('x', w - p.height + p.padding);
}
SearchBox.prototype.position = function (x, y) {
    this.view.attr('transform', sprintf('translate(%f,%f)', x, y));
}
SearchBox.prototype.height = function () {
    return this.prefer.height;
}
