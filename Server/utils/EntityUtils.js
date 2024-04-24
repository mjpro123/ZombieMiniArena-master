"use strict";
var __importDefault = this && this.__importDefault || function(t) {
    return t && t.__esModule ? t : {
        default: t
    }
};
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.getEntity = exports.EntityAbstractType = void 0;
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json")),
    EntityType_1 = require("../enums/EntityType"),
    entityList = serverconfig_json_1.default.entities;
var EntityAbstractType;
! function(t) {
    t[t.LIVING = 0] = "LIVING";
    t[t.STATIC = 1] = "STATIC";
    t[t.UPDATABLE = 2] = "UPDATABLE";
    t[t.DEFAULT = 3] = "DEFAULT"
}(EntityAbstractType = exports.EntityAbstractType || (exports.EntityAbstractType = {}));

function getEntity(t) {
    let e = null;
    for (const i in entityList) EntityType_1.EntityType[i.toUpperCase()] === t && (e = entityList[i]);
    return e
}
exports.getEntity = getEntity;