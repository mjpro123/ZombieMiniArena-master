"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.isAgentBlackListed = void 0;
const blockedList = ["yusukedao", "electron"];

function isAgentBlackListed(e) {
    for (let t = 0; t < blockedList.length; t++) {
        const s = blockedList[t];
        if (e.toLowerCase().includes(s)) return !0
    }
    return !1
}
exports.isAgentBlackListed = isAgentBlackListed;