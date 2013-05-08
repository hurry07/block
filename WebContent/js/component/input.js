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
function TextInput(div) {
    this.div = block.select(div);
    this.focus = false;
    this.input = block.select(div.getElementsByTagName('input')[0])
        .on('change', this.submit, this)
        .on('input', this.submit, this)
        .on('blur', this.onBlur, this)
        .on('focus', this.onFocus, this);
}
TextInput.prototype.submit = function () {
    console.log('TextInput.prototype.submit');
    var a = this.adapter;
    if (a) {
        a.setText(this.input.tag().value);
    }
}
TextInput.prototype.onBlur = function () {
    console.log('TextInput.prototype.hide');
    this.submit();
    var a = this.adapter;
    if (a) {
        a.endEdit(this.input);
    }
    this.div.style('visibility', 'hidden');
}
TextInput.prototype.onFocus = function () {
    console.log('TextInput.prototype.focus');
    this.div.style('visibility', 'visible');
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
    this.div.style('visibility', 'visible');
    //this.input.tag().focus();
    adapter.startEdit(this.input);
}
