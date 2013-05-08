/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-8
 * Time: 下午8:11
 * To change this template use File | Settings | File Templates.
 */
// ==========================
// Area stands for a screen area, layout logic will interact with this interface
// ==========================
function Area(listener) {
    if (listener) {
        this.listener = listener;
    }
    this.x = this.y = 0;
    this._width = this._height = 0;
}
Area.prototype.init = function (x, y, w, h) {
    if (arguments.length == 4) {
        this.x = x;
        this.y = y;
        this._width = w;
        this._height = h;
        return this;
    }
    this.x = this.y = 0;
    if (arguments.length == 2) {
        this._width = x;
        this._height = y;
    }
    return this;
}
Area.prototype.addListener = function (lis) {
    this.listener = lis;
}
Area.prototype.size = function (w, h) {
    if (arguments.length == 0) {
        return [this.getWidth(), this.getHeight()];
    }
    this.setWidth(w);
    this.setHeight(h);
    this.onResize();
}
Area.prototype.position = function (x, y) {
    if (arguments.length == 0) {
        return [this.x , this.y];
    }
    this.x = x;
    this.y = y;
}
Area.prototype.width = function (w) {
    if (arguments.length == 0) {
        return this.getWidth();
    }
    this.setWidth(w);
}
Area.prototype.getWidth = function () {
    return this._width;
}
Area.prototype.setWidth = function (w) {
    this._width = w;
}
Area.prototype.height = function (h) {
    if (arguments.length == 0) {
        return this.getHeight();
    }
    this.setHeight(h);
}
Area.prototype.getHeight = function () {
    return this._height;
}
Area.prototype.setHeight = function (h) {
    this._height = h;
}
Area.prototype.updateWidth = function (w) {
    this.size(w, this._height);
}
Area.prototype.updateHeight = function (h) {
    this.size(this._width, h);
}
Area.prototype.refresh = function () {
    this.width(this._width);
    this.height(this._height);
}
/**
 * notice current object's size has changed
 */
Area.prototype.onResize = function () {
    if (this.listener) {
        this.listener.onResize();
    }
}
// ==========================
// container type
// ==========================
function LinerLayout(d) {
    Area.call(this, 0, 0, 0, 0);
    this.direction = d || 'h';// horizontal
    this.children = [];
}
_extends(LinerLayout, Area);
LinerLayout.prototype.add = function (area, weight) {
    this.children.push({area: area, weight: weight || 0, w: area.width(), h: area.height()});
}
LinerLayout.prototype.remove = function (child) {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            c.splice(i, 1);
            break;
        }
    }
}
LinerLayout.prototype.childResize = function (child) {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            break;
        }
    }
}
LinerLayout.prototype.setWidth = function (w) {
    this._width = w;
    // all element lays in vertical direction
    if (this.direction == 'v') {
        this.children.each(function (e) {
            e.area.updateWidth(w);
        })
        return;
    }

    var h = this.getHeight();
    this.layout(w, 'width',
        function (child, p) {
            child.size(p, h);
        },
        function (child, p) {
            child.position(p, 0);
        });
}
LinerLayout.prototype.setHeight = function (h) {
    this._height = h;
    // children layout from left to right
    if (this.direction == 'h') {
        this.children.each(function (e) {
            e.area.updateHeight(h);
        })
        return;
    }

    var w = this.getWidth();
    this.layout(h, 'height',
        function (child, p) {
            child.size(w, p);
        },
        function (child, p) {
            child.position(0, p);
        });
}
LinerLayout.prototype.layout = function (size, f, sizef, pos) {
    var weight = 0;
    var prefer = 0;// prefer size
    var weighted = 0;// weighted size
    var fixed = 0;// fix size
    this.children.each(function (e) {
        if (e.weight == 0) {
            prefer += e.w;
            fixed += e.area[f]();
        } else {
            weighted += e.area[f]();
            weight += e.weight;
        }
    });

    var coor = 0;
    var every = 0;
    if (prefer < size) {
        every = (size - prefer) / weight;
    }
    this.children.each(function (e) {
        if (e.weight == 0) {
            if (size > coor + e.w) {
                pos(e.area, coor);
                sizef(e.area, e.w);
                coor += e.w;
            } else {
                pos(e.area, coor);
                sizef(e.area, size - coor);
                coor = size;
            }
        } else {
            pos(e.area, coor);
            sizef(e.area, e.weight * every);
            coor += e.weight * every;
        }
    });
}
// ==========================
// floating layout
// ==========================
function FrameLayout() {
    Area.call(this, 0, 0, 0, 0);
    this.children = [];
}
_extends(FrameLayout, Area);
/**
 *
 * @param area
 * @param type floating type fixed|relative|expand
 * @param param more parameter of certain type
 */
FrameLayout.prototype.add = function (area, type, param) {
    this.children.push({area: area, type: type || 'fixed', param: param});
}
FrameLayout.prototype.remove = function (child) {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            c.splice(i, 1);
            break;
        }
    }
}
FrameLayout.prototype.setWidth = function (w) {
    this._width = w;
    this.children.each(function (e) {
        switch (e.type) {
            case 'fixed':
                break;
            case 'relative':
                this.layoutRelative(e.area, e.param);
                break;
            case 'expand':
                e.area.size(this._width, this._height);
                e.area.position(this.x, this.y);
                break;
        }
    })
}
FrameLayout.prototype.layoutRelative = function (area, param) {
    // TODO not needed currently
}
