var config = {};

/**
 * all menu labels, international will happened here.
 */
config.i18n = new (_defineClass(DataMap, {
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

            this.value('table.remove', 'Remove Table');
            this.value('table.rename', 'Rename Table');
            this.value('table.field.add', 'Add Field');
            this.value('table.field.remove', 'Remove Field');

            this.value('link.remove', 'Remove Link');

            this.value('class.include', 'Include in classes');
            this.value('class.exclude', 'Exclude from classes');
            this.value('class.delete', 'Delete');
        }
    },
    string: function (key) {
        return (this.value(key) || '');
    }
}))('en');
config.string = function (key) {
    return this.i18n.string(key);
}

/**
 * all raw types
 *
 * @type {Array}
 */
config.types = [
    {id: 'int', init: 'edit.name' },
    {id: 'long', init: 'edit.name' },
    {id: 'short', init: 'edit.name' },
    {id: 'byte', init: 'edit.name' },
    {id: 'char', init: 'edit.name' } ,
    {id: 'float', init: 'edit.name' },
    {id: 'double', init: 'edit.name' },
    {id: 'boolean', init: 'edit.name' },
    {id: 'string', init: 'edit.name' }
]