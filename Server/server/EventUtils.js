"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.getNodeParams = void 0;

function getNodeParams(e) {
    const t = e.split("-"),
        o = [];
    for (let e = 1; e < t.length; e++) o.push(t[e]);
    return o
}
exports.getNodeParams = getNodeParams;