"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.IP = void 0;
class IP {
    ip;
    connectionCount;
    connectionTimestamp;
    constructor(o) {
        this.ip = o;
        this.connectionCount = 0;
        this.connectionTimestamp = performance.now()
    }
}
exports.IP = IP;