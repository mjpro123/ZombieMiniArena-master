"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdPool = void 0;
class IdPool {
    maxId;
    currentId;
    ids;
    constructor(startId, length) {
        this.maxId = startId + length;
        this.currentId = startId;
        this.ids = new Set();
    }
    createId() {
        if (this.currentId >= this.maxId) {
            return 0;
        }
        let id = this.currentId;
        while (this.ids.has(id)) {
            id++;
            if (id >= this.maxId) {
                id = 0;
            }
            if (id === this.currentId) {
                return 0;
            }
        }
        this.ids.add(id);
        return id;
    }
    deleteId(id) {
        this.ids.delete(id);
    }
}
exports.IdPool = IdPool;