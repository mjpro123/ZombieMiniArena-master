"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.TotemFactory = void 0;
class TotemFactory {
    sourceEntity;
    constructor(t) {
        this.sourceEntity = t
    }
    isTeammate(t) {
        return this.sourceEntity.data.find((e => e.id == t))
    }
}
exports.TotemFactory = TotemFactory;