/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-4-21
 * Time: 下午1:39
 * To change this template use File | Settings | File Templates.
 */
var i18n = new (_defineClass(DataMap, {
    constructor: function (lang) {
        DataMap.call(this);
        this.init(lang);
    },
    init: function (lang) {
        if (!this.lang || this.lang != lang) {
            this.lang = lang;
            this.data({});

            this.value('global.add.table', 'Add Table');
            this.value('global.export', 'Export');
            this.value('global.save', 'Save');

            this.value('table.remove', 'Remove');
            this.value('table.rename', 'Rename');
            this.value('table.add.field', 'Add Field');

            this.value('link.remove', 'Remove');
        }
    },
    string: function (key) {
        return (this.value(key) || '');
    }
}))('en');
