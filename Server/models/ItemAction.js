"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAction = void 0;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const ItemIds_1 = require("../enums/ItemIds");
const itemsmanager_1 = require("../utils/itemsmanager");
const trades_json_1 = __importDefault(require("../settings/trades.json"));
const PacketType_1 = require("../enums/PacketType")
class ItemAction {
    sourcePlayer;
    lastHelmetEquip;
    lastSwordEquip;
    constructor(sourcePlayer) {
        this.sourcePlayer = sourcePlayer;
        this.lastHelmetEquip = -1;
        this.lastSwordEquip = -1;
        this.lastBowEquip = -1;
    }
    manageAction(itemId) {
        let now = performance.now();
        if (itemId == ItemIds_1.ItemIds.HAND) {
            if (now - this.lastSwordEquip < 6500)
                return;
            if (now - this.lastBowEquip < 4500)
                return;
            this.sourcePlayer.right = ItemIds_1.ItemIds.HAND;
            this.sourcePlayer.updateInfo();
            return;
        }
        const item = itemsmanager_1.ItemUtils.getItemById(itemId);
        if (!item)
            return;
        switch (item.type) {
            case itemsmanager_1.ItemType.EQUIPPABLE: {
                if (item.meta_type == itemsmanager_1.ItemMetaType.SWORD) {
                    if (now - this.lastSwordEquip < 5000)
                        return;
                    this.lastSwordEquip = now;
                }
                if (item.meta_type == itemsmanager_1.ItemMetaType.BOW) {
                    if (now - this.lastBowEquip < 3000)
                        return;
                    this.lastBowEquip = now;
                }
                switch (item.meta_type) {
                    case itemsmanager_1.ItemMetaType.BOW:
                    case itemsmanager_1.ItemMetaType.SHIELD:
                    case itemsmanager_1.ItemMetaType.WRENCHABLE:
                    case itemsmanager_1.ItemMetaType.SHOVEL:
                    case itemsmanager_1.ItemMetaType.PICKAXE:
                    case itemsmanager_1.ItemMetaType.HAMMER:
                    case itemsmanager_1.ItemMetaType.SWORD: {
                        if (item.meta_type != itemsmanager_1.ItemMetaType.SWORD && now - this.lastSwordEquip < 5000)
                            return;
                        if (item.meta_type != itemsmanager_1.ItemMetaType.BOW && now - this.lastBowEquip < 3000)
                            return;
                        this.sourcePlayer.right = item.id;
                        this.sourcePlayer.updateInfo();
                        this.sourcePlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.COOLDOWN, 1000 / 5000])
                        break;
                    }
                    case itemsmanager_1.ItemMetaType.RIDING: {
                        if (item.id == this.sourcePlayer.extra && this.sourcePlayer.isOwner) {
                            this.sourcePlayer.extra = 0;
                            this.sourcePlayer.max_speed = 24;
                            this.sourcePlayer.ridingType = null;
                            this.sourcePlayer.isFly = false;
                            this.sourcePlayer.allowedChange = true;
                        } else
                        if (item.id == this.sourcePlayer.extra) {
                            if (this.sourcePlayer.speed > 5)
                                return;
                            this.sourcePlayer.extra = 0;
                            this.sourcePlayer.max_speed = 24;
                            this.sourcePlayer.ridingType = null;
                            this.sourcePlayer.isFly = false;
                            this.sourcePlayer.allowedChange = true;
                        }
                        else {
                            if (this.sourcePlayer.allowedChange) {
                                this.sourcePlayer.speed = 0;
                                this.sourcePlayer.directon = 0;
                                this.sourcePlayer.extra = item.id;
                                this.sourcePlayer.max_speed = item.data.maxSpeed;
                                this.sourcePlayer.speed = item.data.startSpeed;
                                this.sourcePlayer.ridingType = item.data.VehiculeType;
                            }
                        }
                        break;
                    }
                    case itemsmanager_1.ItemMetaType.HAT: {
                        //if(now - this.lastHelmetEquip < 5000) return;
                        if (itemId == this.sourcePlayer.hat) {
                            this.sourcePlayer.hat = 0;
                            this.sourcePlayer.updateInfo();
                            return;
                        }
                        this.sourcePlayer.hat = item.id;
                        this.sourcePlayer.updateInfo();
                        if (item.data.withoutCooldown)
                            return;
                        this.lastHelmetEquip = now;
                        break;
                    }
                }
                break;
            }
            case itemsmanager_1.ItemType.FOOD: {
                for (let trade of trades_json_1.default) {
                    if (trade.type == itemsmanager_1.ItemMetaType.CONSUME) {
                        if (ItemIds_1.ItemIds[trade.taken] == item.id) {
                            this.sourcePlayer.health += trade.regen_health;
                            if (trade.teleport.length > 0) {
                                this.sourcePlayer.x = trade.teleport[0] * 100
                                this.sourcePlayer.y = trade.teleport[1] * 100
                            }
                            for (let i = 0; i < trade.received.length; i++) {
                                this.sourcePlayer.inventory.addItem(ItemIds_1.ItemIds[trade.received[i][0]], trade.received[i][1])
                            }
                        }
                    }
                }
                switch (item.meta_type) {
                    case itemsmanager_1.ItemMetaType.REGENERABLE: {
                        if (this.sourcePlayer.gaugesManager.bandage >= 50) {
                            return;
                        }
                        this.sourcePlayer.inventory.removeItem(itemId, 1);
                        this.sourcePlayer.gaugesManager.bandage += 5;
                        this.sourcePlayer.gaugesManager.bandage = Math.min(50, this.sourcePlayer.gaugesManager.bandage);
                        this.sourcePlayer.gaugesManager.update();
                        break;
                    }
                    case itemsmanager_1.ItemMetaType.HEAL_FOOD: {
                        this.sourcePlayer.health += 50;
                        this.sourcePlayer.gaugesManager.update();
                    }
                    default: {
                        this.sourcePlayer.gaugesManager.food += item.data.value;
                        if (item.data.poison) {
                            this.sourcePlayer.health -= item.data.poison;
                            this.sourcePlayer.updateHealth(null);
                        }
                        if (item.data.water) {
                            this.sourcePlayer.gaugesManager.thirst += item.data.water;
                        }
                        if (itemId == ItemIds_1.ItemIds.BOTTLE_FULL) {
                            this.sourcePlayer.inventory.removeItem(itemId, 1);
                            this.sourcePlayer.inventory.addItem(ItemIds_1.ItemIds.BOTTLE_EMPTY, 1);
                            return;
                        }
                        this.sourcePlayer.gaugesManager.update();
                        this.sourcePlayer.inventory.removeItem(itemId, 1);
                        break;
                    }
                }
                break;
            }
        }
    }
}
exports.ItemAction = ItemAction;
/**
 * if(g_mode || entityMeta.id == EntityType.PLOT || entityMeta.id == EntityType.ROOF) {
            angle = Math.PI / 2;
            var sx = Math.floor(Math.cos(build_angle) * 145 + this.player.entity.x) ,
                sy = Math.floor(Math.sin(build_angle) * 145 + this.player.entity.y);

                sx = ((sx - (sx % 100))) + 50
                sy = ((sy - (sy % 100))) + 50
        }else {
            var sx = Math.cos(this.player.entity.angle) * 145 + this.player.entity.x ,
                sy = Math.sin(this.player.entity.angle) * 145 + this.player.entity.y;
        }
 */