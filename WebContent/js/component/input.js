/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:25
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// TextInput
// ==========================
function TextInput(div, area) {
    this.area = area;
    this.div = block.select(div);
    this.input = block.select(div.getElementsByTagName('input')[0])
        .on('change', this.submit, this)
        .on('input', this.submit, this)
        .on('blur', this.onblur, this)
}
TextInput.prototype.submit = function () {
    var a = this.adapter;
    if (a) {
        a.setText(this.input.tag().value);
    }
}
TextInput.prototype.onblur = function () {
    this.submit();
    var a = this.adapter;
    if (a) {
        a.endEdit(this.input);
    }
    this.div.style({
        'left': '-100px',
        'top': '-100px',
        'width': '50px',
        'height': '50px'});
    this.input.off('blur');
}
/**
 * @param adapter will interact with html text input tag
 *     {getNode, getText, setText}
 */
TextInput.prototype.show = function (adapter) {
    if (!adapter) {
        return;
    }

    // end previous edit
    var _adapter = this.adapter;
    _adapter && _adapter.endEdit(this.input);

    // reset editor
    this.adapter = adapter;
    var target = adapter.getTarget();
    this.div.style({
        'left': target[0] + 'px',
        'top': target[1] + 'px',
        'width': target[2] + 'px',
        'height': target[3] + 'px'});
    adapter.startEdit(this.input);

    // delay focus
    var _this = this;
    var thread = setInterval(function () {
        _this.input.tag().focus();
        _this.input.on('blur', _this.onblur, _this);
        clearInterval(thread);
    }, 0);
}
