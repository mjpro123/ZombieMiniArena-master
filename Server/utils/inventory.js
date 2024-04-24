"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const { ItemIds } = require("../enums/ItemIds");
const PacketType_1 = require("../enums/PacketType");
const bufferReader_1 = require("./bufferReader");
class Inventory {
    items;
    maxSize;
    sourcePlayer;
    constructor(sourcePlayer, maxSize) {
        this.items = new Map();
        this.maxSize = maxSize;
        this.sourcePlayer = sourcePlayer;
    }
    getBag() {
        this.sourcePlayer.controller.sendBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.GetBag]));
    }
    containsItem(itemID, count = 1) {
        const item = this.items.get(itemID);
        if (!item && item != 0)
            return false;
        return item >= count;
    }
    isInventoryFull(item) {
        return !this.items.has(item) && (this.items.size == this.maxSize);
    }

    removeAllItem(target) {
        const inv = target.inventory.toArray()
        for (let i = 0; i < inv.length; i++) {
            target.inventory.removeItem(inv[i][0], inv[i][1])
        }
    }

    addItems(item, count) {
        const maxItem = 65000;

        for (let i = 0; i < count; i += maxItem) {
            const max = Math.min(maxItem, count - i);

            if (!this.items.has(item) && this.items.size >= this.maxSize) {
                this.sourcePlayer.controller.sendBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.InventoryIsFull]));
                return;
            }

            this.items.set(item, (this.items.get(item) ?? 0) + max);

            const writer = new bufferReader_1.BufferWriter(6);
            writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.Gather, this.sourcePlayer.id);
            writer.writeUInt8(0, this.sourcePlayer.id);
            writer.writeUInt16(item, this.sourcePlayer.id);
            writer.writeUInt16(max, this.sourcePlayer.id);
            this.sourcePlayer.controller.sendBinary(writer.toBuffer());
        }
    }

    addItem(item, count) {
        if (count >= 65000) {
            this.addItems(item, count)
            return;
        }
        if (isNaN(count) || count < 0) {
            count = 1;
        }
        if (!this.items.has(item) && (this.items.size >= this.maxSize)) {
            this.sourcePlayer.controller.sendBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.InventoryIsFull]));
            return;
        }
        this.items.set(item, (this.items.get(item) ?? 0) + count);
        const writer = new bufferReader_1.BufferWriter(6);
        writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.Gather, this.sourcePlayer.id);
        writer.writeUInt8(0, this.sourcePlayer.id);
        writer.writeUInt16(item, this.sourcePlayer.id);
        writer.writeUInt16(count, this.sourcePlayer.id);
        this.sourcePlayer.controller.sendBinary(writer.toBuffer());
    }
    countItem(item) {
        return this.items.get(item) ?? 0;
    }
    removeItem(item, count, shouldUpdate = true) {
        const total = (this.items.get(item) ?? 0) - count;
        if (total <= 0) {
            this.items.delete(item);
        }
        else
            this.items.set(item, total);
        if (shouldUpdate)
            this.sourcePlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.DecreaseItem, item, count]);
    }
    serialize() {
        let array = [];
        Array.from(this.items.entries()).forEach(([item, count]) => {
            array[item] = count;
        });
        return array;
    }
    toArray() {
        return Array.from(this.items);
    }
}
exports.Inventory = Inventory;