"use strict";
var __importDefault = this && this.__importDefault || function(t) {
    return t && t.__esModule ? t : {
        default: t
    }
};
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.PacketObscure = void 0;
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class PacketObscure {
    connection;
    lastDropItemPacket = -1;
    totalPacketsIn = 0;
    lastPacketRestore = -1;
    violates = 0;
    isBanned = !1;
    constructor(t) {
        this.connection = t
    }
    updateViolates() {}
    updatePacketData() {
        const t = performance.now();
        this.totalPacketsIn++;
        if (t - this.lastPacketRestore >= 1e3) {
            this.lastPacketRestore = t;
            this.totalPacketsIn = 0
        }
        return !0
    }
    watchDropPacket(t) {
        if (t - this.lastDropItemPacket <= serverconfig_json_1.default.other.dropCooldown) return !1;
        this.lastDropItemPacket = t;
        return !0
    }
}
exports.PacketObscure = PacketObscure;