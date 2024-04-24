"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.IdPool = void 0;
class IdPool {
    pool;
    id_list;
    currentId;
    constructor(t = 1) {
        this.pool = [];
        this.id_list = [];
        this.currentId = t
    }
    nextId() {
        let t = this.pool.pop() ?? this.currentId++;
        if (this.id_list.includes(t)) return this.nextId();
        this.id_list.push(t);
        return t
    }
    lookNextId() {
        return 0 == this.pool.length ? this.currentId + 1 : this.pool[this.pool.length - 1]
    }
    dispose(t) {
        this.pool.push(t);
        this.id_list = this.id_list.filter((s => s != t))
    }
}
exports.IdPool = IdPool;