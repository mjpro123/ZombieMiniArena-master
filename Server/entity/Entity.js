"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Action_1 = require("../enums/Action");
const EntityType_1 = require("../enums/EntityType");
const ItemIds_1 = require("../enums/ItemIds");
const PacketType_1 = require("../enums/PacketType");
const CollisionUtils_1 = require("../math/CollisionUtils");
const Vector2D_1 = __importDefault(require("../math/Vector2D"));
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const trades_json_1 = __importDefault(require("../settings/trades.json"));
const bufferReader_1 = require("../utils/bufferReader");
const EntityUtils_1 = require("../utils/EntityUtils");
const itemsmanager_1 = require("../utils/itemsmanager");
const Utils_1 = require("../utils/Utils");
const WorldEvents_1 = require("../world/WorldEvents");
const Player_1 = require("./Player");
const PvPTime_1 = require("../exec/PvPTime");
const WorldCycle_1 = require("../world/WorldCycle");
const WorldBiomeResolver_1 = require("../world/WorldBiomeResolver");
const Biomes_1 = require("../enums/Biomes");
const ItemByChance_1 = require("../exec/ItemByChance");
const QuestType_1 = require("../enums/QuestType");
class Entity {
    spawnTime = performance.now();
    id;
    playerId = 0;
    x = 2500;
    y = 2500;
    radius = 30;
    angle = 0;
    extra = 0;
    speed = 24;
    max_speed = 24;
    action = 0;
    info = 0;
    type = 0;
    gameServer;
    direction = 0;
    oldX = 0;
    oldY = 0;
    health = 200;
    max_health = 200;
    old_health = 200;
    old_speed = 24;
    date = performance.now();
    isSolid = true;
    ghost = true;
    collideSpeed = 1;
    collidesRiver = false;
    ownerClass;
    abstractType = EntityUtils_1.EntityAbstractType.DEFAULT;
    isDestroyed = false;
    god = false;
    oldDirection = -1;
    isFly = false;
    ISF = false;
    ISF2 = false;
    vector = new Vector2D_1.default(0, 0);
    collideCounter = 0;
    dist_winter = -1000000;
    dist_dragon = -1000000;
    dist_forest = -1000000;
    dist_sand = -1000000;
    dist_desert = -1000000;
    dist_lava = -1000000;
    dist_water = -1000000;
    biomeIn = Biomes_1.Biomes.SEA;
    test = Date.now();
    constructor(id, playerId, gameServer) {
        this.id = id;
        this.playerId = playerId;
        this.gameServer = gameServer;
    }
    initEntityData(x, y, angle, type, isSolid = true) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.type = type;
        this.isSolid = isSolid;
    }
    initOwner(owner) {
        this.ownerClass = owner;
    }
    isCollides(x = this.x, y = this.y, radius = this.radius) {
        const entities = this.gameServer.queryManager.queryCircle(x, y, radius);
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.id != this.id && entity.isSolid) {
                return true;
            }
        }
        return false;
    }
    receiveHit(damager, damage = -1, Arrow) {
        if (this.isDestroyed || (this.god && (!damager.isOwner || damager.hat != ItemIds_1.ItemIds.WINTER_HOOD)))
            return;
        let finalDamage = damage;
        let imt = null;
        if (damager instanceof Player_1.Player) {

            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (damager.hat == ItemIds_1.ItemIds.WINTER_HOOD && damager.right == ItemIds_1.ItemIds.HAND) {
                    damager.inventory.removeAllItem(damager)
                    damager.inventory.addItem(ItemIds_1.ItemIds.WINTER_HOOD, 1)
                    const target_inventory = this.inventory.toArray()
                    for (let i = 0; i < target_inventory.length; i++) {
                        damager.inventory.addItem(target_inventory[i][0], target_inventory[i][1])
                    }
                }
            }
            if (this.type === EntityType_1.EntityType.BABY_DRAGON) {
                if (damager.right === ItemIds_1.ItemIds.SADDLE && this.info == 0) {
                    const chance = ItemByChance_1.TamingChance(damager.hat);
                    if (Math.random() <= chance) {
                        damager.inventory.addItem(ItemIds_1.ItemIds.BABY_DRAGON);
                        damager.inventory.removeItem(ItemIds_1.ItemIds.SADDLE, 1);
                        damager.right = ItemIds_1.ItemIds.HAND;
                        damager.updateInfo();
                        this.gameServer.worldDeleter.initEntity(this, "living");
                    }
                }
            }
            const itemInHand = itemsmanager_1.ItemUtils.getItemById(damager.right);
            imt = itemInHand;
            if (itemInHand != null && itemInHand.meta_type != itemsmanager_1.ItemMetaType.WRENCHABLE) {
                if (itemInHand.type == itemsmanager_1.ItemType.EQUIPPABLE) {
                    if (Utils_1.Utils.isBuilding(this)) {
                        finalDamage = Math.max(0, itemInHand.data.building_damage - this.ownerClass.damageProtection);
                        this.ownerClass.onHitReceive(damager);
                    }
                    else if (!Arrow)
                        finalDamage = itemInHand.data.damage;
                }
                else {
                    if (Utils_1.Utils.isBuilding(this)) {
                        finalDamage = Math.max(0, 2 - this.ownerClass.damageProtection);
                        this.ownerClass.onHitReceive(damager);
                    }
                    else
                        finalDamage = 5;
                }
            }
            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (this.ownerClass.hat != 0) {
                    const hatItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.hat);
                    const protectionSuffler = hatItem.data.protection;
                    finalDamage -= protectionSuffler;
                }
                if (this.ownerClass.right != 0) {
                    const rightItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.right);
                    if (rightItem != null && rightItem.meta_type == itemsmanager_1.ItemMetaType.SHIELD) {
                        const protectionSuffler = rightItem.data.protection ?? 0;
                        finalDamage -= protectionSuffler;
                    }
                }
                if (Utils_1.Utils.isInBottleHeal(this.ownerClass)) {
                    finalDamage -= 5;
                }
                if (Utils_1.Utils.isInPremiumAFK(this.ownerClass)) {
                    finalDamage -= 15;
                }
            }
        }
        if (Utils_1.Utils.isMob(damager)) {
            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (this.ownerClass.hat != 0) {
                    const hatItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.hat);
                    const protectionSuffler = hatItem.data.animal_protection ?? 9;
                    finalDamage -= protectionSuffler;
                }
                if (this.ownerClass.right != 0) {
                    const rightItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.right);
                    if (rightItem != null && rightItem.meta_type == itemsmanager_1.ItemMetaType.SHIELD) {
                        const protectionSuffler = rightItem.data.protection;
                        finalDamage -= protectionSuffler;
                    }
                }
            }
        }
        if (this.type == EntityType_1.EntityType.PLAYERS && damager instanceof Player_1.Player &&
            damager.totemFactory && Utils_1.Utils.isContains(this.id, damager.totemFactory.data)) {
            finalDamage = ~~(finalDamage / 6);
        }
        ;
        if (imt != null && imt.meta_type == itemsmanager_1.ItemMetaType.WRENCHABLE && Utils_1.Utils.isBuilding(this) && this.ownerClass.metaData.healthSendable) {
            finalDamage = -imt.data.building_damage;
        }
        else
            finalDamage = Math.max(0, finalDamage);
        this.action |= Action_1.Action.HURT;
        this.health = Math.max(0, Math.min(this.max_health, this.health - finalDamage));
        switch (this.type) {
            case EntityType_1.EntityType.PLAYERS: {
                this.ownerClass.callEntityUpdate(false);
                this.ownerClass.gaugesManager.healthUpdate();
                this.ownerClass.lastHoodCooldown = performance.now();
                break;
            }
        }
        if (this.ownerClass != null && this.ownerClass.factoryOf && this.ownerClass.factoryOf == "building") {
            if (this.ownerClass.metaData.healthSendable) {
                this.info = Utils_1.Utils.InMap(this.health, 0, this.max_health, 0, 100);
            }
            const data = new bufferReader_1.BufferWriter(8);
            data.writeUInt16(PacketType_1.ServerPacketTypeBinary.HittenOther, this.playerId);
            data.writeUInt16(this.id, this.playerId);
            data.writeUInt16(this.playerId, this.playerId);
            data.writeUInt16(damager.angle, this.playerId);
            const playersArr = this.gameServer.queryManager.queryRectPlayers(this.x, this.y, 2560, 1440);
            for (let i = 0; i < playersArr.length; i++) {
                const player_ = playersArr[i];
                player_.controller.sendBinary(data.toBuffer());
            }
        }
        if (this.type == EntityType_1.EntityType.BOAR ||
            this.type == EntityType_1.EntityType.BABY_DRAGON ||
            this.type == EntityType_1.EntityType.LAVA_DRAGON ||
            this.type == EntityType_1.EntityType.HAWK) {
            this.info = 1;
            this.last_Hit = performance.now();
        }

        this.updateHealth(damager);
    }
    updateHealth(damager) {
        if (this.type == EntityType_1.EntityType.PLAYERS) {
            if (this.health != this.max_health && !this.ownerClass.questManager.checkQuestState(QuestType_1.QuestType.GREEN_CROWN)) {
                this.ownerClass.questManager.failQuest(QuestType_1.QuestType.GREEN_CROWN);
            }
        }
        if (this.health <= 0) {
            if (Utils_1.Utils.isBox(this) || Utils_1.Utils.isBuilding(this)) {
                this.ownerClass.onDead(damager);
                if (this.type == EntityType_1.EntityType.EMERALD_MACHINE) {
                    this.ownerClass.owner.health = 0;
                    this.ownerClass.owner.hat = 0;
                    this.ownerClass.owner.updateHealth(null);
                    if (damager && damager.type == EntityType_1.EntityType.PLAYERS) {
                        if (damager.playerId != this.playerId) {
                            damager.gameProfile.score += (~~(this.ownerClass.owner.gameProfile.score / 5));
                        }
                    }
                }
            }
            if (this.type == EntityType_1.EntityType.GIFT) {
                let itemByChance = ItemByChance_1.GiftItem(this.gameServer.gameConfiguration.christmas)
                let itemId = ItemIds_1.ItemIds[itemByChance[0]]
                let amount = itemByChance[1]
                damager.inventory.addItem(itemId, amount)
                damager.gameProfile.score += 500;
                damager.stateManager.killedEntities[this.type]++;
            }
            if (this.type == EntityType_1.EntityType.ALOE_VERA_MOB) {
                damager.inventory.addItem(ItemIds_1.ItemIds.ALOE_VERA, this.gameServer.gameConfiguration.entities.aloe_vera_mob.reward);
            }
            if (this.type == EntityType_1.EntityType.TREASURE_CHEST) {
                let itemByChance = (0, ItemByChance_1.getItemByChance)(damager);
                let itemId = ItemIds_1.ItemIds[itemByChance];
                damager.inventory.addItem(itemId, 1);
                damager.gameProfile.score += 400;
                let killed = damager.stateManager.killedEntities[this.type]++;
                if (killed >= 5 && !damager.questManager.checkQuestState(QuestType_1.QuestType.ORANGE_CROWN)) {
                    damager.questManager.succedQuest(QuestType_1.QuestType.ORANGE_CROWN);
                }
            }
            if (Utils_1.Utils.isMob(this)) {
                if (damager && damager.type == EntityType_1.EntityType.PLAYERS) {
                    let scoreGive = this.ownerClass.entitySettings.give_score ?? 0;
                    damager.gameProfile.score += scoreGive;
                }
            }
            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (damager && damager.type == EntityType_1.EntityType.PLAYERS) {
                    if (this.ownerClass.hat == ItemIds_1.ItemIds.CROWN_BLUE) {
                        const writer_ = new bufferReader_1.BufferWriter(2);
                        writer_.writeUInt8(PacketType_1.ServerPacketTypeBinary.Ghost, this.playerId);
                        writer_.writeUInt8(60, this.playerId);
                        this.ownerClass.controller.sendBinary(writer_.toBuffer());
                        (0, PvPTime_1.resolveKill)(damager, this.ownerClass);
                        damager.gameProfile.score += (~~(this.ownerClass.gameProfile.score / 5));
                        WorldEvents_1.WorldEvents.ghost(this.gameServer, this.ownerClass);
                    }
                    else {
                        (0, PvPTime_1.resolveKill)(damager, this.ownerClass);
                        damager.gameProfile.score += (~~(this.ownerClass.gameProfile.score / 5));
                        this.isDestroyed = true;
                        WorldEvents_1.WorldEvents.playerDied(this.gameServer, this.ownerClass);
                    }
                }
                else {
                    if (this.ownerClass.hat == ItemIds_1.ItemIds.CROWN_BLUE) {
                        const writer_ = new bufferReader_1.BufferWriter(2);
                        writer_.writeUInt8(PacketType_1.ServerPacketTypeBinary.Ghost, this.playerId);
                        writer_.writeUInt8(60, this.playerId);
                        this.ownerClass.controller.sendBinary(writer_.toBuffer());
                        WorldEvents_1.WorldEvents.ghost(this.gameServer, this.ownerClass);
                    }
                    else {
                        this.isDestroyed = true;
                        WorldEvents_1.WorldEvents.playerDied(this.gameServer, this.ownerClass);
                    }
                }
            }
            else {
                this.isDestroyed = true;
                WorldEvents_1.WorldEvents.entityDied(this.gameServer, this);
            }
        }
    }
    updateBefore() {
        if (this.action & Action_1.Action.HURT)
            this.action &= ~Action_1.Action.HURT;
        if (this.action & Action_1.Action.COLD)
            this.action &= ~Action_1.Action.COLD;
        if (this.action & Action_1.Action.HEAL)
            this.action &= ~Action_1.Action.HEAL;
        if (this.action & Action_1.Action.HUNGER)
            this.action &= ~Action_1.Action.HUNGER;
        if (this.action & Action_1.Action.WEB)
            this.action &= ~Action_1.Action.WEB;
    }
    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
    updateSpeed() {
        this.speed = Math.max(1, this.speed);
    }
    update() {
        if (this.oldX != this.x)
            this.oldX = this.x;
        if (this.oldY != this.y)
            this.oldY = this.y;
        if (this.ownerClass)
            this.ownerClass.onEntityUpdate(performance.now());
        if (Utils_1.Utils.isPlayer(this)) {
            this.ownerClass.tickUpdate();
        }
        if (Utils_1.Utils.isPlayer(this)) {
            if (this.vector.x != 0 || this.vector.y != 0) {
                this.x += this.vector.x;
                this.y += this.vector.y;
                if (!this.ownerClass.ghost)
                    CollisionUtils_1.CollisionUtils.scheduleCollision(this);
            }
            else {
                if (this.isFly && this.speed > 2) {
                    this.ISF = true;
                } else {
                    this.ISF = false;
                }
            }
        }
        if (this.oldX != this.x || this.oldY != this.y) {
            WorldBiomeResolver_1.WorldBiomeResolver.update_dist_in_biomes(this);
            this.biomeIn = WorldBiomeResolver_1.WorldBiomeResolver.get_biome_id(this);
        }
        this.updateBounds();
        this.updateSpeed();
    }
    updateBounds() {
        const map = {
            maxx: serverconfig_json_1.default.world.Width - 15,
            maxy: serverconfig_json_1.default.world.Height - 15,
            minx: 15,
            miny: 15
        };
        this.x = ~~Math.min(map.maxx, Math.max(map.minx, this.x));
        this.y = ~~Math.min(map.maxy, Math.max(map.miny, this.y));
    }
}
exports.Entity = Entity;