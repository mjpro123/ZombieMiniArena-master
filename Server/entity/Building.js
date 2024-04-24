"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
const Utils_1 = require("../utils/Utils");
const itemsmanager_1 = require("../utils/itemsmanager");
const Entity_1 = require("./Entity");
const EntityType_1 = require("../enums/EntityType");
const PacketType_1 = require("../enums/PacketType");
const WorldEvents_1 = require("../world/WorldEvents");
const ItemIds_1 = require("../enums/ItemIds");
const Action_1 = require("../enums/Action");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class Building extends Entity_1.Entity {
    damageProtection = 0;
    metaData = null;
    metaType;
    itemName;
    data;
    owner;
    isGrown = false;
    isDrained = false;
    ghost = true;
    owningPlot = null;
    lastDrain = performance.now();
    fruits = 0;
    maxFruits = 0;
    growBoost = 0;
    fruitItem;
    containsPlant = false;
    is_locked;
    lastUpdate = -1;
    ticks = 0;
    factoryOf = "building";
    spawnTime = performance.now();
    // (this.sourcePlayer, this.gameServer.entityPool.nextId(), 
    // Math.floor(Math.random() * 100), 
    // this.gameServer, item.data.damageProtection, item.data, item.meta_type, item.name);
    constructor(owner, id, ownerId, gameServer, damageProtection, metaData = null, metaType, itemName) {
        super(id, ownerId, gameServer);
        this.damageProtection = damageProtection;
        this.metaData = metaData;
        this.metaType = metaType;
        this.itemName = itemName;
        this.owner = owner;
        this.containsPlant = false;
        if (this.metaType == itemsmanager_1.ItemMetaType.PLANT)
            this.info = 10;
    }
    getInfo() {
        let info = 0;
        if (this.isGrown)
            info = this.fruits;
        if (this.isDrained)
            info |= 16;
        this.info = info;
    }
    setup() {
        switch (this.metaType) {
            case itemsmanager_1.ItemMetaType.TOTEM:
                this.is_locked = false;
                this.data = [];
                this.data.push(this.owner);
                break;
            case itemsmanager_1.ItemMetaType.STORAGE:
                switch (this.type) {
                    case EntityType_1.EntityType.CHEST: {
                        this.data = [];
                        this.data.push([1024, 0]);
                        this.is_locked = false;
                        break;
                    }
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_STONE:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_GOLD:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_DIAMOND:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_AMETHYST:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_REIDITE:
                    case EntityType_1.EntityType.WINDMILL: {
                        this.data = [[0, 0]];
                        break;
                    }
                    case EntityType_1.EntityType.BREAD_OVEN: {
                        this.data = [[0, 0, 0]];
                        break;
                    }
                    case EntityType_1.EntityType.FURNACE: {
                        this.data = [[0]];
                        break;
                    }
                }
                break;
            case itemsmanager_1.ItemMetaType.PLANT: {
                this.maxFruits = (this.type == EntityType_1.EntityType.TOMATO_SEED || this.type == EntityType_1.EntityType.SEED) ? 3 : 1;
                this.fruitItem =
                    this.type == EntityType_1.EntityType.WHEAT_SEED ? ItemIds_1.ItemIds.WILD_WHEAT :
                        this.type == EntityType_1.EntityType.CARROT_SEED ? ItemIds_1.ItemIds.CARROT :
                            this.type == EntityType_1.EntityType.GARLIC_SEED ? ItemIds_1.ItemIds.GARLIC :
                                this.type == EntityType_1.EntityType.TOMATO_SEED ? ItemIds_1.ItemIds.TOMATO :
                                    this.type == EntityType_1.EntityType.PUMPKIN_SEED ? ItemIds_1.ItemIds.PUMPKIN :
                                        this.type == EntityType_1.EntityType.THORNBUSH_SEED ? ItemIds_1.ItemIds.THORNBUSH :
                                            this.type == EntityType_1.EntityType.WATERMELON_SEED ? ItemIds_1.ItemIds.WATERMELON :
                                                this.type == EntityType_1.EntityType.ALOE_VERA_SEED ? ItemIds_1.ItemIds.ALOE_VERA : ItemIds_1.ItemIds.PLANT;
                this.health = this.metaData.health;
                break;
            }
        }
    }
    onEntityUpdate(now) {
        if (this.type == EntityType_1.EntityType.GOLD_SPIKE) {
            if (now - this.spawnTime >= 1000 * 30) {
                this.health = 0;
                this.updateHealth(null);
            }
        }
        if (this.metaType == itemsmanager_1.ItemMetaType.PLANT) {
            if (now - this.spawnTime > serverconfig_json_1.default.other.plantLifetime) {
                this.health = 0;
                this.updateHealth(null);
            }
        }
        switch (this.metaType) {
            case itemsmanager_1.ItemMetaType.TOTEM: {
                this.info = +this.data.length;
                this.extra = +this.is_locked;
                if (now - this.lastUpdate > 500) {
                    this.lastUpdate = now;
                    const data = [];
                    for (let i = 0; i < this.data.length; i++) {
                        const player = this.data[i];
                        data.push(player.x);
                        data.push(player.y);
                    }
                    const players = this.data;
                    for (const player of players) {
                        player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.Minimap, ...data]);
                    }
                }
                break;
            }
            case itemsmanager_1.ItemMetaType.STORAGE: {
                switch (this.type) {
                    case EntityType_1.EntityType.CHEST: {
                        const item = this.data[0][0];
                        const amount = this.data[0][1];
                        this.extra = item ?? 0;
                        this.info = (amount ?? 0) + (this.is_locked ? 8192 : 0);
                        break;
                    }
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_STONE:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_GOLD:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_DIAMOND:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_AMETHYST:
                    case EntityType_1.EntityType.EXTRACTOR_MACHINE_REIDITE:
                    case EntityType_1.EntityType.WINDMILL: {
                        if (now - this.lastUpdate > 10000) {
                            this.lastUpdate = now;
                            let amountIn = this.data[0][1];
                            if (amountIn <= 0 || this.data[0][0] >= 255)
                                return;
                            amountIn -= (this.type == EntityType_1.EntityType.WINDMILL ? 1 : 2);
                            this.data[0][1] = Math.max(0, amountIn);
                            this.data[0][0] += 1;
                        }
                        this.extra = +this.data[0][0];
                        this.info = +this.data[0][1];
                        break;
                    }
                    case EntityType_1.EntityType.BREAD_OVEN: {
                        if (now - this.lastUpdate > 10000) {
                            this.lastUpdate = now;
                            if (this.data[0][0] <= 0 || this.data[0][1] <= 0 || this.data[0][2] >= 31)
                                return;
                            this.data[0][0] -= 1;
                            this.data[0][1] -= 1;
                            this.data[0][2] += 1;
                        }
                        let woodIn = +this.data[0][0];
                        let flourIn = +this.data[0][1];
                        let breadIn = +this.data[0][2];
                        this.info = (woodIn | (flourIn << 5) | (breadIn << 10));
                        break;
                    }
                    case EntityType_1.EntityType.FURNACE: {
                        if (now - this.lastUpdate > 5000) {
                            this.lastUpdate = now;
                            let amountIn = this.data[0][0];
                            if (amountIn <= 0) {
                                return;
                            }
                            amountIn -= 1;
                            this.data[0][0] = amountIn;
                        }
                        this.info = +this.data[0][0];
                        break;
                    }
                }
            }
            case itemsmanager_1.ItemMetaType.FIRE: {
                if (now - this.spawnTime > this.metaData.aliveTime) {
                    this.health = 0;
                    this.updateHealth(null);
                }
                break;
            }
            case itemsmanager_1.ItemMetaType.PLANT: {
                let growDecrease = (this.owningPlot ? 1.5 : 1) + this.growBoost;
                if (!this.isGrown) {
                    if (now - this.spawnTime > this.metaData.born_time / growDecrease) {
                        this.isGrown = true;
                        this.lastUpdate = now;
                        this.lastDrain = now;
                    }
                    return;
                }
                if (!this.isDrained && now - this.lastUpdate > this.metaData.grow_time / growDecrease) {
                    this.lastUpdate = now;
                    if (this.maxFruits > this.fruits) {
                        this.fruits++;
                        if (!this.isSolid && (this.type == EntityType_1.EntityType.TOMATO_SEED ||
                            this.type == EntityType_1.EntityType.THORNBUSH_SEED ||
                            this.type == EntityType_1.EntityType.CARROT_SEED ||
                            this.type == EntityType_1.EntityType.GARLIC_SEED ||
                            this.type == EntityType_1.EntityType.PUMPKIN_SEED ||
                            this.type == EntityType_1.EntityType.WATERMELON_SEED))
                            this.isSolid = true;
                    }
                }
                let drainIncrease = this.owningPlot ? 1.6 : 1;
                if (!this.isDrained && now - this.lastDrain > this.metaData.drain_time * drainIncrease) {
                    this.isDrained = true;
                }
                this.getInfo();
                break;
            }
        }
    }
    onDead(damager) {
        if (this.type == EntityType_1.EntityType.TOTEM) {
            WorldEvents_1.WorldEvents.onTotemBreak(this);
        }
        if (this.metaType == itemsmanager_1.ItemMetaType.PLANT && this.owningPlot) {
            this.owningPlot.containsPlant = false;
        }
    }
    onCollides(entityCollides) { }

    onHitReceive(damager) {
        if (this.metaType == itemsmanager_1.ItemMetaType.PLANT) {
            if (damager.right == ItemIds_1.ItemIds.WATERING_CAN_FULL && this.isGrown) {
                this.lastDrain = performance.now();
                this.isDrained = false;
                this.getInfo();
            }
            if (this.fruits <= 0)
                return;
            if (this.type == EntityType_1.EntityType.THORNBUSH_SEED &&
                (damager.right != ItemIds_1.ItemIds.PITCHFORK &&
                    damager.right != ItemIds_1.ItemIds.PITCHFORK2 ||
                    damager.inventory.isInventoryFull(this.fruitItem))) {
                if (!(damager.playerId == this.owner.playerId ||
                    this.owner.totemFactory && Utils_1.Utils.isContains(damager.playerId, this.owner.totemFactory.data))) {
                    damager.receiveHit(damager, 20);
                }
            }
            if (damager.inventory.isInventoryFull(this.fruitItem) || damager.right == ItemIds_1.ItemIds.WATERING_CAN_FULL)
                return;
            this.fruits--;
            this.getInfo();
            if (this.fruits <= 0 &&
                (this.type == EntityType_1.EntityType.TOMATO_SEED ||
                    this.type == EntityType_1.EntityType.THORNBUSH_SEED ||
                    this.type == EntityType_1.EntityType.CARROT_SEED ||
                    this.type == EntityType_1.EntityType.GARLIC_SEED ||
                    this.type == EntityType_1.EntityType.WATERMELON_SEED ||
                    this.type == EntityType_1.EntityType.PUMPKIN_SEED))
                this.isSolid = false;
            let toGive = damager.right == ItemIds_1.ItemIds.PITCHFORK ? 2 :
                damager.right == ItemIds_1.ItemIds.PITCHFORK2 ? 4 : 1;
            damager.inventory.addItem(this.fruitItem, toGive);
            damager.gameProfile.score += this.metaData.score_give ?? 0;
            return;
        }
        if (this.metaType == itemsmanager_1.ItemMetaType.DOOR ||
            this.metaType == itemsmanager_1.ItemMetaType.SPIKED_DOOR) {
            const damagerItem = itemsmanager_1.ItemUtils.getItemById(damager.right);
            if (damagerItem != null &&
                damagerItem.meta_type == itemsmanager_1.ItemMetaType.WRENCHABLE) {
            }
            else {
                if (damager.id == this.InitialOwner ||
                    (damager.totemFactory &&
                        Utils_1.Utils.isContains(this.InitialOwner, damager.totemFactory.data))) {
                    let counter = 0;
                    if (this.extra) {
                        const queryEntities = this.gameServer.queryManager.queryCircle(this.x, this.y, this.radius - 10);
                        for (let i = 0; i < queryEntities.length; i++) {
                            if (queryEntities[i].isSolid || queryEntities[i].type == EntityType_1.EntityType.PLAYERS)
                                counter++;
                        }
                        if (counter == 0)
                            this.extra = 0;
                    }
                    else
                        this.extra = 1;
                    if (this.extra) {
                        if (counter == 0)
                            this.isSolid = false;
                    }
                    else {
                        this.isSolid = true;
                    }
                }
            }
        }
        if (this.metaData.hitDamage != null && this.InitialOwner != damager.id) {
            if (this.metaType == itemsmanager_1.ItemMetaType.SPIKED_DOOR && !this.isSolid)
                return;
            if (damager.totemFactory &&
                Utils_1.Utils.isContains(this.InitialOwner, damager.totemFactory.data))
                return;
            const now = performance.now();
            if (now - damager.lastHittenBuildDamager > 250) {
                damager.lastHittenBuildDamager = now;
                damager.receiveHit(this, this.metaData.hitDamage ?? 1);
            }
        }
    }
}
exports.Building = Building;