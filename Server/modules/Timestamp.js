"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
class Timestamp {
    start;
    time;
    end;
    constructor(time) {
        this.start = Date.now();
        this.time = time;
        this.end = this.start + time;
    }
}
exports.Timestamp = Timestamp;