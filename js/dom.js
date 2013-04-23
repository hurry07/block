/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-4-23
 * Time: 上午11:02
 * To change this template use File | Settings | File Templates.
 */
function SvgTag(node) {
    this.node = node;
}
/**
 * child tag name
 * @param name
 */
SvgTag.prototype.append = function (name) {
    name = d3.ns.qualify(name);
    if (name.local) {
        this.node.appendChild(document.createElementNS(name.space, name.local));
    } else {
        this.node.appendChild(document.createElementNS(this.node.namespaceURI, name));
    }
}
SvgTag.prototype.select = function (query) {
    return new SvgTag(this.node.querySelector(query));
}
SvgTag.prototype.selectAll = function (query) {
    return new SvgSelection(this.node.querySelectorAll(query));
}
SvgTag.prototype.__create_adapter__ = function () {
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
SvgTag.prototype.tag = function () {
    return this.node;
}
/**
 * return customer object that bind whit html tag
 * @returns {*}
 */
SvgTag.prototype.node = function () {
    return this.node.__node__;
}
SvgTag.prototype.style = function (name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
        // For style(object) or style(object, string), the object specifies the
        // names and values of the attributes to set or remove. The values may be
        // functions that are evaluated for each element. The optional string
        // specifies the priority.
        if (typeof name !== "string") {
            if (n < 2) value = "";
            for (priority in name) {
                this.each(d3_selection_style(priority, name[priority], value));
            }
            return this;
        }

        // For style(string), return the computed style value for the first node.
        if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);

        // For style(string, string) or style(string, function), use the default
        // priority. The priority is ignored for style(string, null).
        priority = "";
    }

    // Otherwise, a name, value and priority are specified, and handled as below.
    return this.each(d3_selection_style(name, value, priority));
};
function tag_selection_style(name, value, priority) {
    return value == null
        ? this.style.removeProperty(name)
        : this.style.setProperty(name, value, priority);
}

/**
 * taken from d3
 *
 * @param name
 * @param value
 * @returns {*}
 */
SvgTag.prototype.attr = function (name, value) {
    if (arguments.length < 2) {

        // For attr(string), return the attribute value for the first node.
        if (typeOf(name) === 'string') {
            var node = this.node;
            name = d3.ns.qualify(name);
            return name.local
                ? node.getAttributeNS(name.space, name.local)
                : node.getAttribute(name);
        }

        // For attr(object), the object specifies the names and values of the
        // attributes to set or remove. The values may be functions that are
        // evaluated for each element.
        for (value in name) {
            tag_attr.call(this.node, value, name[value]);
        }
        return this;
    }

    tag_attr.call(this.node, name, value);
    return this;
}
/**
 * @param name
 * @param value
 */
function tag_attr(name, value) {
    name = d3.ns.qualify(name);
    (value == null)
        ? (name.local ? this.removeAttributeNS(name.space, name.local) : this.removeAttribute(name))
        : (name.local ? this.setAttributeNS(name.space, name.local, value) : this.setAttribute(name, value));
}
/**
 * add event listener to an html tag
 * @param event
 * @param listener should has signature like fn(event, tag)
 * @param capture capture or not
 * @param bind
 * @returns {*}
 */
SvgTag.prototype.on = function (event, listener, capture, bind) {
    if (typeOf(listener) != 'function' || typeOf(event) != 'string') {
        return;
    }

    var events;
    if (!this.node.__events__) {
        events = this.node.__events__ = {};
    } else {
        events = this.node.__events__;
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
        this.node.addEventListener(type, pool, capture);
    }
    pool.add({name: name, fn: listener, bind: bind});
    return this;
}
SvgTag.prototype.off = function (event) {
    if (typeOf(event) != 'string') {
        return;
    }
    var events;
    if (!(events = this.node.__events__)) {
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
            this.node.removeEventListener(type, lis, false);
        }
        delete events[type];
    }
    if (lis = events[type + '_c']) {
        lis.remove(name);
        if (lis.count() == 0) {
            this.node.removeEventListener(type, lis, true);
        }
        delete events[type + '_c'];
    }
    var count = 0;
    for (i in events) {
        count++;
        break;
    }
    if (count == 0) {
        delete this.node.__events__;
    }
}

function SvgSelection(result) {
    this.nodes = [];
}