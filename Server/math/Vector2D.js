"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.Vector2 = void 0;
class Vector2 {
    static build_vector(t, r) {
        return {
            x: Math.cos(t) * r,
            y: Math.sin(t) * r
        }
    }
    static add_vector(t, r) {
        t.x += r.x;
        t.y += r.y
    }
    static get_std_angle(t, r) {
        return this.get_angle({
            x: 1,
            y: 0
        }, this.get_vector(t, r))
    }
    static get_angle(t, r) {
        return Math.acos(this.scalar_product(t, r) / (this.norm(t) * this.norm(r))) * this.sign(this.cross_product(t, r))
    }
    static scalar_product(t, r) {
        return t.x * r.x + t.y * r.y
    }
    static norm(t) {
        return Math.sqrt(t.x * t.x + t.y * t.y)
    }
    static sign(t) {
        return t < 0 ? -1 : 1
    }
    static cross_product(t, r) {
        return t.x * r.y - t.y * r.x
    }
    static get_vector(t, r) {
        return {
            x: t.x - r.x,
            y: t.y - r.y
        }
    }
}
exports.Vector2 = Vector2;
class Vector2D {
    x;
    y;
    constructor(t, r) {
        this.x = t;
        this.y = r
    }
    static fromAngle(t) {
        return new Vector2D(Math.cos(t), Math.sin(t))
    }
    add(t) {
        this.x += t.x;
        this.y += t.y;
        return this
    }
    sub(t) {
        this.x -= t.x;
        this.y -= t.y;
        return this
    }
    mult(t) {
        this.x *= t;
        this.y *= t;
        return this
    }
    div(t) {
        this.x /= t;
        this.y /= t;
        return this
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    normalize() {
        return this.length > 0 ? this.div(this.length) : this
    }
    setLength(t) {
        return this.normalize().mult(t)
    }
    copy() {
        return new Vector2D(this.x, this.y)
    }
    distance(t) {
        return this.copy().sub(t).length
    }
    angle(t) {
        const r = t.copy().sub(this);
        return Math.atan2(r.y, r.x)
    }
    dot(t) {
        return this.x * t.x + this.y * t.y
    }
    direction(t, r) {
        return this.copy().add(Vector2D.fromAngle(t).mult(r))
    }
}
exports.default = Vector2D;