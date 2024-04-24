"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.GaugesManager = exports.DamageCauseBy = void 0;
const PacketType_1 = require("../enums/PacketType"),
    bufferReader_1 = require("../utils/bufferReader"),
    Action_1 = require("../enums/Action"),
    itemsmanager_1 = require("../utils/itemsmanager");
var DamageCauseBy;
! function(t) {
    t[t.HURT = 0] = "HURT";
    t[t.COLD = 1] = "COLD";
    t[t.FOOD = 2] = "FOOD";
    t[t.WATER = 3] = "WATER";
    t[t.OXYGEN = 4] = "OXYGEN";
    t[t.WARM = 5] = "WARM"
}(DamageCauseBy = exports.DamageCauseBy || (exports.DamageCauseBy = {}));
class GaugesManager {
    sourcePlayer;
    food;
    cold;
    thirst;
    oxygen;
    warm;
    bandage;
    healTick;
    constructor(t) {
        this.sourcePlayer = t;
        this.food = 200;
        this.cold = 200;
        this.thirst = 200;
        this.oxygen = 200;
        this.warm = 0;
        this.bandage = 0;
        this.healTick = 0
    }
    tick() {
        this.healTick++;
        let t = 0,
            e = Action_1.Action.HURT;
        if (this.food <= 0) {
            this.food = 0;
            t += 10;
            t = Action_1.Action.HUNGER
        }
        if (this.thirst <= 0) {
            this.thirst = 0;
            t += 10;
            e = Action_1.Action.COLD
        }
        if (t > 0) {
            this.sourcePlayer.health -= t;
            this.sourcePlayer.action |= e;
            this.healthUpdate();
            this.sourcePlayer.updateHealth(null)
        } else {
            if (this.healTick >= 2) {
                if (this.food >= 40 && this.cold >= 40 && this.thirst >= 40 && this.warm < 175 && this.sourcePlayer.health < 200) {
                    let t = 21;
                    const e = itemsmanager_1.ItemUtils.getItemById(this.sourcePlayer.hat);
                    this.sourcePlayer.stateManager.isInBed && (t += 20);
                    if (null != e && null != e.data.healAdjust) t += e.data.healAdjust;
                    else if (this.bandage > 0) {
                        t = 40;
                        this.bandage--
                    }
                    this.sourcePlayer.health += t;
                    this.sourcePlayer.action |= Action_1.Action.HEAL
                }
                this.healTick = 0
            }
            this.sourcePlayer.health = Math.max(0, Math.min(200, this.sourcePlayer.health))
        }
    }
    healthUpdate() {
        this.sourcePlayer.health = Math.max(0, Math.min(200, this.sourcePlayer.health));
        const t = new bufferReader_1.BufferWriter(3);
        t.writeUInt8(PacketType_1.ServerPacketTypeBinary.GaugeLife, this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.sourcePlayer.health / 2), this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.bandage), this.sourcePlayer.id);
        this.sourcePlayer.controller.sendBinary(t.toBuffer())
    }
    update() {
        this.food = Math.min(200, Math.max(this.food, 0));
        this.cold = Math.min(200, Math.max(0, this.cold));
        this.warm = Math.min(200, Math.max(0, this.warm));
        this.oxygen = Math.min(200, Math.max(0, this.oxygen));
        this.thirst = Math.min(200, Math.max(0, this.thirst));
        this.sourcePlayer.health = Math.min(200, Math.max(0, this.sourcePlayer.health));
        const t = new bufferReader_1.BufferWriter(8);
        t.writeUInt8(PacketType_1.ServerPacketTypeBinary.Gauges, this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.sourcePlayer.health / 2), this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.food / 2), this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.cold / 2), this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.thirst / 2), this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.oxygen / 2), this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.warm / 2), this.sourcePlayer.id);
        t.writeUInt8(Math.floor(this.bandage), this.sourcePlayer.id);
        this.sourcePlayer.controller.sendBinary(t.toBuffer())
    }
}
exports.GaugesManager = GaugesManager;