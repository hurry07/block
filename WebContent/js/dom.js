var block = {};

(function () {
    /**
     * @param name
     * @param value
     */
    function __tag_attr(name, value) {
//        if (value == NaN || (value + '').indexOf('NaN') != -1) {
//            console.log('error');
//        }
        name = d3.ns.qualify(name);
        (value == null)
            ? (name.local ? this.removeAttributeNS(name.space, name.local) : this.removeAttribute(name))
            : (name.local ? this.setAttributeNS(name.space, name.local, value) : this.setAttribute(name, value));
    }

    function __tag_style(name, value, priority) {
        return value == null
            ? this.style.removeProperty(name)
            : this.style.setProperty(name, value, priority);
    }

    /**
     * simplify setting of transform
     * @param node SvgSelect
     * @constructor
     */
    function SvgTransform(node) {
        this.node = node;
        this.attrs = [];
    };
    SvgTransform.prototype.matrix = function (a, b, c, d, e, f) {
        this.attrs.push('matrix(' + Array.prototype.slice.call(arguments, 0).join(' ') + ')');
        return this;
    }
    SvgTransform.prototype.translate = function (x, y) {
        this.attrs.push('translate(' + x + ',' + ( y || 0) + ')');
        return this;
    }
    SvgTransform.prototype.scale = function (x, y) {
        this.attrs.push('scale(' + x + ',' + (y === 0 ? y : (y || x)) + ')');
        return this;
    }
    SvgTransform.prototype.rotate = function (a) {
        if (arguments.length == 1) {
            this.attrs.push('rotate(' + a + ')');
        } else {
            this.attrs.push('rotate(' + a + ',' + arguments[1] + ',' + arguments[1] + ')');
        }
        return this;
    }
    SvgTransform.prototype.skewX = function (x) {
        this.attrs.push('skewX(' + x + ')', x);
        return this;
    }
    SvgTransform.prototype.skewY = function (y) {
        this.attrs.push('skewY(' + x + ')', y);
        return this;
    }
    SvgTransform.prototype.end = function () {
        return this.node.attr('transform', this.attrs.join(' '));
    }

    /**
     * utils for path::d easily setup
     * @param node
     * @constructor
     */
    function SvgPath(node) {
        this.node = node;
        this.attrs = [];
    };
    /**
     * M moveto
     * L lineto
     * T smooth quadratic Belzier curveto
     */
    (function (str) {
        str += str.toLowerCase();
        str.split('').each(function (c) {
            SvgPath.prototype[c] = function (x, y) {
                this.attrs.push(c + Array.prototype.slice.call(arguments, 0).join(' '));
                return this;
            }
        })
    })('MLT');
    /**
     * H horizontal lineto
     * @param x
     * @constructor
     */
    SvgPath.prototype.H = function (x) {
        this.attrs.push('H' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    SvgPath.prototype.h = function (x) {
        this.attrs.push('h' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    /**
     * V vertical lineto
     * @param y
     * @constructor
     */
    SvgPath.prototype.V = function (y) {
        this.attrs.push('V' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    SvgPath.prototype.v = function (y) {
        this.attrs.push('v' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    /**
     * curveto
     * @constructor
     */
    SvgPath.prototype.C = function (x1, y1, x2, y2, x, y) {
        this.attrs.push('C' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    SvgPath.prototype.c = function (x1, y1, x2, y2, x, y) {
        this.attrs.push('c' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    /**
     * smooth curveto
     * @constructor
     */
    SvgPath.prototype.S = function (x2, y2, x, y) {
        this.attrs.push('S' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    SvgPath.prototype.s = function (x2, y2, x, y) {
        this.attrs.push('s' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    /**
     * quadratic Belzier curve
     * @constructor
     */
    SvgPath.prototype.Q = function (x1, y1, x, y) {
        this.attrs.push('Q' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
    SvgPath.prototype.q = function (x1, y1, x, y) {
        this.attrs.push('q' + Array.prototype.slice.call(arguments, 0).join(' '));
        return this;
    }
//    /**
//     * elliptical Arc ? not under stand TODO
//     * @constructor
//     */
//    SvgPath.prototype.A = function () {
//        return this;
//    }
    /**
     * closepath
     * @constructor
     */
    SvgPath.prototype.z = SvgPath.prototype.Z = function () {
        this.attrs.push('Z');
        return this;
    }
    SvgPath.prototype.end = function () {
        return this.node.attr('d', this.attrs.join(' '));
    }

    /**
     * Created with JetBrains WebStorm.
     * User: jie
     * Date: 13-4-23
     * Time: 上午11:02
     * To change this template use File | Settings | File Templates.
     */
    function SvgSelect(tag) {
        this.htmltag = tag;
    };
    /**
     * child tag name
     * @param name
     */
    SvgSelect.prototype.append = function (name) {
        name = d3.ns.qualify(name);
        if (name.local) {
            return new SvgSelect(this.htmltag.appendChild(document.createElementNS(name.space, name.local)));
        } else {
            return new SvgSelect(this.htmltag.appendChild(document.createElementNS(this.htmltag.namespaceURI, name)));
        }
    }
    SvgSelect.prototype.insert = function (name, before) {
        name = d3.ns.qualify(name);
        return new SvgSelect(
            this.htmltag.insertBefore(
                name.local
                    ? document.createElementNS(name.space, name.local)
                    : document.createElementNS(this.htmltag.namespaceURI, name),
                this.htmltag.querySelector(before)
            )
        );
    }
    SvgSelect.prototype.select = function (query) {
        return new SvgSelect(this.htmltag.querySelector(query));
    }
    SvgSelect.prototype.selectAll = function (query) {
        return new SvgSelection(this.htmltag.querySelectorAll(query));
    }
    SvgSelect.prototype.__create_adapter__ = function () {
        var fns = [];

        function add(declare) {
            for (var i = 0; i < fns.length; i++) {
                var f = fns[i];
                if (f.name == declare.name) {
                    return;
                }
            }
            fns.push(declare);
        }

        function remove(name) {
            for (var i = 0; i < fns.length; i++) {
                var f = fns[i];
                if (f.name == name) {
                    fns.splice(i, 1);
                    return;
                }
            }
        }

        function listener(event) {
            block.event = event;
            for (var i = 0; i < fns.length; i++) {
                var f = fns[i];
                if (f.bind) {
                    f.fn.call(f.bind, event, this);
                } else {
                    f.fn.call(this, event, this);
                }
            }
        }

        function count() {
            return fns.length;
        }

        listener.add = add;
        listener.remove = remove;
        listener.count = count;

        return listener;
    }
    SvgSelect.prototype.tag = function () {
        return this.htmltag;
    }
    SvgSelect.prototype.childNodes = function () {
        return new SvgSelection(this.htmltag.childNodes);
    }
    /**
     * return customer object that bind whit html tag
     * @returns {*}
     */
    SvgSelect.prototype.node = function () {
        if (arguments[0]) {
            this.htmltag.__node__ = arguments[0];
        } else {
            return this.htmltag.__node__;
        }
    }
    /**
     * take from d3js
     *
     * @param name
     * @param value
     * @param priority
     * @returns {*}
     */
    SvgSelect.prototype.style = function (name, value, priority) {
        var n = arguments.length;
        if (n < 3) {
            // For style(object) or style(object, string), the object specifies the
            // names and values of the attributes to set or remove. The values may be
            // functions that are evaluated for each element. The optional string
            // specifies the priority.
            if (typeof name !== "string") {
                if (n < 2) value = "";
                for (priority in name) {
                    __tag_style.call(this.tag(), priority, name[priority], value);
                }
                return this;
            }

            // For style(string), return the computed style value for the first node.
            if (n < 2) {
                return window.getComputedStyle(this.tag(), null).getPropertyValue(name);
            }

            // For style(string, string) or style(string, function), use the default
            // priority. The priority is ignored for style(string, null).
            priority = "";
        }

        // Otherwise, a name, value and priority are specified, and handled as below.
        __tag_style.call(this.tag(), name, value, priority);
        return this;
    };
    SvgSelect.prototype.$t = SvgSelect.prototype.transform = function () {
        return new SvgTransform(this);
    }
    SvgSelect.prototype.$d = SvgSelect.prototype.path = function () {
        return new SvgPath(this);
    }
    SvgSelect.prototype.$ = function (c) {
        switch (c) {
            case 't':
                return this.transform();
            case 'd':
                return this.path();
        }
    }
    /**
     * taken from d3
     *
     * @param name
     * @param value
     * @returns {*}
     */
    SvgSelect.prototype.attr = function (name, value) {
        if (arguments.length < 2) {

            // For attr(string), return the attribute value for the first node.
            if (typeOf(name) === 'string') {
                var tag = this.tag();
                name = d3.ns.qualify(name);
                return name.local
                    ? tag.getAttributeNS(name.space, name.local)
                    : tag.getAttribute(name);
            }

            // For attr(object), the object specifies the names and values of the
            // attributes to set or remove. The values may be functions that are
            // evaluated for each element.
            for (value in name) {
                __tag_attr.call(this.tag(), value, name[value]);
            }
            return this;
        }

        __tag_attr.call(this.tag(), name, value);
        return this;
    }
    SvgSelect.prototype.text = function () {
        if (arguments.length == 0) {
            return this.htmltag.textContent;
        } else {
            var v;
            if (typeOf(v = arguments[0]) != 'string') {
                this.htmltag.textContent = '';
            } else {
                this.htmltag.textContent = v;
            }
            return this;
        }
    }
    /**
     * add event listener to an html tag
     * @param event
     * @param listener should has signature like fn(event, tag)
     * @param capture capture or not
     * @param bind
     * @returns {*}
     */
    SvgSelect.prototype.on = function (event, listener, capture, bind) {
        if (typeOf(listener) != 'function' || typeOf(event) != 'string') {
            return;
        }

        var events;
        if (!this.htmltag.__events__) {
            events = this.htmltag.__events__ = {};
        } else {
            events = this.htmltag.__events__;
        }

        var type = event;
        var name = '';
        var i = event.indexOf(".");
        if (i > 0) {
            type = event.substring(0, i);
            name = event.substring(i + 1);
        }

        if (arguments.length == 3) {
            if (typeOf(capture) != 'boolean') {
                bind = capture || null;
                capture = false;
            } else {
                bind = null;
            }
        } else if (arguments.length == 4) {
            if (typeOf(capture) != 'boolean') {
                capture = false;
            }
            if (!bind) {
                bind = null;
            }
        }

        var key = type + (capture ? '_c' : '');
        var pool;
        if (!(pool = events[key])) {
            pool = events[key] = this.__create_adapter__();
            this.htmltag.addEventListener(type, pool, capture);
        }
        pool.add({name: name, fn: listener, bind: bind});
        return this;
    }
    SvgSelect.prototype.off = function (event) {
        if (typeOf(event) != 'string') {
            return;
        }
        var events;
        if (!(events = this.htmltag.__events__)) {
            return;
        }

        var type = event;
        var name = '';
        var i = event.indexOf(".");
        if (i > 0) {
            type = event.substring(0, i);
            name = event.substring(i + 1);
        }

        var lis;
        if (lis = events[type]) {
            lis.remove(name);
            if (lis.count() == 0) {
                this.htmltag.removeEventListener(type, lis, false);
            }
            delete events[type];
        }
        if (lis = events[type + '_c']) {
            lis.remove(name);
            if (lis.count() == 0) {
                this.htmltag.removeEventListener(type, lis, true);
            }
            delete events[type + '_c'];
        }
        var count = 0;
        for (i in events) {
            count++;
            break;
        }
        if (count == 0) {
            delete this.htmltag.__events__;
        }
    }

    function removeTag(tag) {
        var p;
        if (p = tag.parentNode) {
            p.removeChild(tag);
        }
    }

    /**
     * remove current node from parent
     */
    SvgSelect.prototype.remove = function () {
        var node = this.tag();
        var query;
        if (query = arguments[0]) {
            for (var i = 0, nodes = this.tag().querySelectorAll(query), l = nodes.length; i < l; i++) {
                removeTag(nodes[i]);
            }
            // if current object was not removed
            if (node.parentNode) {
                return;
            }
        }

        delete  node.__node__;
        removeTag(node);
    }

    /**
     * ======================
     * taken from d3js  start
     *
     * @param name
     * @param value
     * @returns {*}
     */
    SvgSelect.prototype.classed = function (name, value) {
        if (arguments.length < 2) {
            // For classed(string), return true only if the first node has the specified
            // class or classes. Note that even if the browser supports DOMTokenList, it
            // probably doesn't support it on SVG elements (which can be animated).
            if (typeof name === "string") {
                var node = this.tag(),
                    n = (name = name.trim().split(/^|\s+/g)).length,
                    i = -1;
                if (value = node.classList) {
                    while (++i < n) if (!value.contains(name[i])) return false;
                } else {
                    value = node.getAttribute("class");
                    while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
                }
                return true;
            }

            // For classed(object), the object specifies the names of classes to add or
            // remove. The values may be functions that are evaluated for each element.
            for (value in name) {
                d3_selection_classed.call(this.tag(), value, name[value]);
            }
            return this;
        }

        // Otherwise, both a name and a value are specified, and are handled as below.
        d3_selection_classed.call(this.tag(), name, value);
        return this;
    };

    var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

    function requote(s) {
        return s.replace(d3_requote_re, "\\$&");
    };

    function d3_selection_classedRe(name) {
        return new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
    }

    // Multiple class names are allowed (e.g., "foo bar").
    function d3_selection_classed(name, value) {
        name = name.trim().split(/\s+/).map(d3_selection_classedName);
        var n = name.length;
        if (typeOf(value) === 'boolean') {
            var i = -1;
            while (++i < n) {
                name[i](this, value);
            }
        }
    }

    function d3_collapse(s) {
        return s.trim().replace(/\s+/g, " ");
    }

    function d3_selection_classedName(name) {
        var re = d3_selection_classedRe(name);
        return function (node, value) {
            if (c = node.classList) {
                return value ? c.add(name) : c.remove(name);
            }
            var c = node.getAttribute("class") || "";
            if (value) {
                re.lastIndex = 0;
                if (!re.test(c)) {
                    node.setAttribute("class", d3_collapse(c + " " + name));
                }
            } else {
                node.setAttribute("class", d3_collapse(c.replace(re, " ")));
            }
        };
    }

    // taken from d3js end
    block.tag = SvgSelect;

    /**
     * wrap a css query result
     *
     * @param result
     * @constructor
     */
    function SvgSelection(result) {
        this.selnodes = [];
        if (result && result.length) {
            for (var i = 0, l = result.length; i < l; i++) {
                this.selnodes.push(new SvgSelect(result[i]));
            }
        }
    }

    /**
     * fn should has signature like (d, d, nodes)
     * @param fn
     * @param bind
     */
    SvgSelection.prototype.each = function (fn, bind) {
        this.selnodes.each(fn, bind);
    }
    SvgSelection.prototype.sort = function (fn) {
        this.selnodes.sort(fn);
    }
    SvgSelection.prototype.order = function () {
        for (var g = this.selnodes, i = g.length - 1, next = g[g.length - 1].tag(), node; --i >= 0;) {
            if (node = g[i]) {
                node = node.tag();
                if (next && next !== node.nextSibling)
                    next.parentNode.insertBefore(node, next);
                next = node;
            }
        }
    }
    SvgSelection.prototype.nodes = function () {
        return this.selnodes;
    }
    SvgSelection.prototype.filter = function (fn, bind) {
        var results = [];
        for (var value, i = 0, nodes = this.selnodes, l = nodes.length; i < l; i++) {
            value = nodes[i];
            if (fn.call(bind, value, i, this)) {
                results.push(value);
            } else {
                value.remove();
            }
        }
        this.selnodes = results;
    }

    SvgSelection.prototype.iterator = function (fn, bind) {
        for (var value, i = 0, nodes = this.selnodes, l = nodes.length; i < l; i++) {
            value = nodes[i];
            if (fn.call(bind, value, i, this) === false) {
                break;
            }
        }
    }
    SvgSelection.prototype.remove = function () {
        this.selnodes.each(function (node) {
            node.remove();
        })
        delete this.selnodes;
    }
    SvgSelection.prototype.node = function (i) {
        var n;
        return (n = this.selnodes[i]) && n.node();
    }

    block.selection = SvgSelection;
    block.select = function (dom) {
        if (!dom) {
            return null;
        }
        if (typeOf(dom) == 'string') {
            return new SvgSelect(document.querySelector(dom));
        }
        if (this.isHtmlTag(dom)) {
            return new SvgSelect(dom);
        }
        return null;
    }
    block.selectAll = function (query) {
        return new SvgSelection(document.querySelectorAll(query));
    }

    block.Node = window.Node;
    function isHtmlTag(tag) {
        return  tag && tag instanceof this.Node;
    }

    block.isHtmlTag = isHtmlTag;
})();