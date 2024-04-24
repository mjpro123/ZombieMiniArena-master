"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
exports.MapObject = void 0;
const PacketType_1 = require("../enums/PacketType"),
    bufferReader_1 = require("../utils/bufferReader"),
    Utils_1 = require("../utils/Utils"),
    ResourceUtils_1 = require("../utils/ResourceUtils");
class MapObject {
    x;
    y;
    radius;
    type;
    id;
    raw_type;
    size;
    ghost = !0;
    parentEntity;
    lastUpdate;
    inStorage;
    isFly = !1;
    nextDiff_;
    isSolid = !0;
    constructor(e, t, i, r, s, n) {
        this.x = t;
        this.y = i;
        this.radius = r;
        this.type = e;
        this.id = -2;
        this.raw_type = s;
        this.size = n;
        this.lastUpdate = performance.now();
        this.inStorage = 0;
        this.nextDiff_ = this.nextUpdate();
    }
    updateDiff(e, t) {
        return e - t;
    }
    setParentEntity(e) {
        this.parentEntity = e;
    }
    nextUpdate() {
        return 100;
    }
    update() {
        const e = performance.now();
        if (this.updateDiff(e, this.lastUpdate) >= this.nextDiff_) {
            this.nextDiff_ = this.nextUpdate();
            this.add_item();
            this.lastUpdate = performance.now();
        }
    }
    add_item() {
        const e = ResourceUtils_1.ResourceUtils.getLimitResources(this.type, this.size),
            t = ResourceUtils_1.ResourceUtils.getRandomAddMaxMin(this.type, this.size);
        this.inStorage = Math.min(e, Math.max(0, this.inStorage + Utils_1.Utils.randomMaxMin(t[0], t[1])));
    }
    updateParent() {
        this.parentEntity.info = this.inStorage;
    }
    receiveHit(e, skip) {
        this.update();
        const t = e.gameServer,
            i = new bufferReader_1.BufferWriter(10),
            r = Utils_1.Utils.indexFromMapObject(this.raw_type);
        if (!r || r.i < 0) return;
        i.writeUInt16(PacketType_1.ServerPacketTypeBinary.ResourceHitten);
        i.writeUInt16(this.x / 100);
        i.writeUInt16(this.y / 100);
        i.writeUInt16(e.angle);
        i.writeUInt16(r.i + (r.needSize ? this.size : 0));
        const s = t.queryManager.queryPlayers(this.x, this.y, 2e3);
        for (let e = 0; e < s.length; e++) {
            s[e].controller.sendBinary(i.toBuffer());
        }
        if (skip) return;
        if (this.inStorage >= 1) {
            let t = ResourceUtils_1.ResourceUtils.readShouldMine(this.type, e);
            if (-1 == t && !skip) {
                const t = new bufferReader_1.BufferWriter(1);
                t.writeUInt8(PacketType_1.ServerPacketTypeBinary.WrongTool);
                e.controller.sendBinary(t.toBuffer());
                return;
            }
            let i = ResourceUtils_1.ResourceUtils.getResourceItem(this.type);
            if (e.inventory.isInventoryFull(i) && !skip) {
                e.controller.sendBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.InventoryIsFull]));
                return;
            }
            let r = this.inStorage < t ? this.inStorage : t;
            this.inStorage -= r;
            e.gameProfile.score += r * ResourceUtils_1.ResourceUtils.readScoreFrom(this.type);
            e.inventory.addItem(i, r);
        } else if (!skip) {
            const t = new bufferReader_1.BufferWriter(1);
            t.writeUInt8(PacketType_1.ServerPacketTypeBinary.ResourceIsEmpty);
            e.controller.sendBinary(t.toBuffer());
        }
    }
}
exports.MapObject = MapObject;