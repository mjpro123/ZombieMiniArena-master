"use strict";
Object.prototype.deepClone = function() {
    const e = new WeakMap;
    return function t(r) {
        if (e.has(r)) return e.get(r);
        const o = Object.create(Object.getPrototypeOf(r));
        e.set(r, o);
        Object.getOwnPropertyNames(r).forEach((e => {
            const c = Object.getOwnPropertyDescriptor(r, e);
            c && "value" in c && "object" == typeof c.value && (c.value = t(c.value));
            Object.defineProperty(o, e, c)
        }));
        return o
    }(this)
};