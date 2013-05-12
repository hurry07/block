/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-5-11
 * Time: 下午10:34
 * To change this template use File | Settings | File Templates.
 */
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
    if (arguments.length == 1) {
        weight = 1;
    }
    this.children.push({area: area, weight: weight, width: area.width(), height: area.height()});
    return this;
}
LinerLayout.prototype.remove = function (child) {
    for (var i = 0, c = this.children, len = c.length; i < len; i++) {
        if (c[i].area === child) {
            c.splice(i, 1);
            break;
        }
    }
    return this;
}
LinerLayout.prototype.position = function (x, y) {
    //console.log('LinerLayout.position:', x, y);
    if (arguments.length == 0) {
        return [this.x , this.y];
    }
    this.x = x;
    this.y = y;
    this.parentPos(this.parentx, this.parenty);
}
LinerLayout.prototype.parentPos = function (x, y) {
    //console.log('LinerLayout.parentPos:', x, y);
    this.parentx = x;
    this.parenty = y;
    var absx = this.absx = this.x + x;
    var absy = this.absy = this.y + y;
    this.children.each(function (e) {
        e.area.parentPos(absx, absy);
    })
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
LinerLayout.prototype.layout = function (size, field, sizef, pos) {
    var weight = 0;
    var prefer = 0;// prefer size
    var weighted = 0;// weighted size
    var fixed = 0;// fix size
    this.children.each(function (e) {
        if (e.weight == 0) {
            prefer += e[field];
            fixed += e.area[field]();
        } else {
            weighted += e.area[field]();
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
            if (size > coor + e[field]) {
                pos(e.area, coor);
                sizef(e.area, e[field]);
                coor += e[field];
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
