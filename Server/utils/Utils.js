"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvelCodec = exports.Utils = void 0;
const DataType_1 = require("../enums/DataType");
const EntityType_1 = require("../enums/EntityType");
const Vector_1 = require("./Vector");
const ItemIds_1 = require("../enums/ItemIds");
const ObjectType_1 = require("../enums/ObjectType");
const WorldModes_1 = require("../enums/WorldModes");
const Logger_1 = require("../logs/Logger");
const MarketIds_1 = require("../enums/MarketIds");
const BoxIds_1 = require("../enums/BoxIds");
const VehiculeType_1 = require("../enums/VehiculeType");
const QuestType_1 = require("../enums/QuestType");
const TodoList = {
    'First-Step': {
        'Join with custom nickname/skin/etc': true,
        'Multiplayer (Sync)': true,
        'World Map & Resources': true,
        'Token System': false
    },
    'Ingame Mechanics': {
        'Dying': false,
        'Hitting': {
            'Gathering': true,
            'PvP (Hitting players)': true
        },
        'Movement': {
            'Collision': true,
            'Speed changing': true,
            'Vehicles': false
        },
        'Resources': {
            'Tools Dependent': true,
            'Resources multiplier': true,
            'Resources limit per resource': true
        },
        'Farming': {
            'Planting': false,
            'Grow speed & Plots': false,
            'Pitchfork': false
        },
        'Teams': {
            'Creating teams': false,
            'Kick from team': false,
            'Lock Totem': false
        },
        'Console': 'np',
        'Biomes': 'np',
        'Shop': true,
        'Kits': false,
        'Quests': false,
        'Cooldowns': true,
        'Building': true,
        'Crafting': false,
        'Leaderboard': true,
        'Equipment': true,
        'Chatting': true,
        'Gauges': true,
    }
};
function renderTodoList(obj, indent = '#ffffff ') {
    let result = '';
    return result;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'object') {
                result += (indent + '🟦 ' + key) + '\n';
                result += renderTodoList(value, indent + '      ');
            }
            else {
                const test = value == 'np' ? '❌' : (value ? '✅' : '⬛');
                result += (indent + test + key) + '\n';
            }
        }
    }
    return result;
}
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const __1 = require("..");
const env_mode_1 = require("../types/env.mode");
const MapObject_1 = require("../entity/MapObject");
const ItemType_1 = require("../enums/ItemType")
const itemsmanager_1 = require("./itemsmanager");
class Utils {

    static arrows = [
        ItemType_1.ItemType.DRAGON_ARROW, ItemType_1.ItemType.REIDITE_ARROW, ItemType_1.ItemType.AMETHYST_ARROW, ItemType_1.ItemType.DIAMOND_ARROW,
        ItemType_1.ItemType.GOLD_ARROW, ItemType_1.ItemType.STONE_ARROW, ItemType_1.ItemType.WOOD_ARROW
    ];
    static bows = [
        ItemType_1.ItemType.DRAGON_BOW, ItemType_1.ItemType.REIDITE_BOW, ItemType_1.ItemType.AMETHYST_BOW, ItemType_1.ItemType.DIAMOND_BOW,
        ItemType_1.ItemType.GOLD_BOW, ItemType_1.ItemType.STONE_BOW, ItemType_1.ItemType.WOOD_BOW
    ];

    static isMob(entity) {
        return entity.ownerClass != null && entity.ownerClass.factoryOf && entity.ownerClass.factoryOf == "animal";
    }
    static isGem(item) {
        return item == ItemIds_1.ItemIds.GEMME_BLUE || item == ItemIds_1.ItemIds.GEMME_GREEN || item == ItemIds_1.ItemIds.GEMME_ORANGE
    }
    static isPlayer(entity) {
        return entity.type == EntityType_1.EntityType.PLAYERS;
    }
    static isHammer(id) {
        return (id == ItemIds_1.ItemIds.HAMMER || id == ItemIds_1.ItemIds.HAMMER_GOLD || id == ItemIds_1.ItemIds.HAMMER_DIAMOND || id == ItemIds_1.ItemIds.HAMMER_AMETHYST || id == ItemIds_1.ItemIds.HAMMER_REIDITE || id == ItemIds_1.ItemIds.SUPER_HAMMER)
    }
    static isAdmin(sourcePlayer) {
        return sourcePlayer.isMod || sourcePlayer.isAdmin || sourcePlayer.isTrial || sourcePlayer.staffAllowed
    }
    static isArrow(item) {
        return item.metaType == itemsmanager_1.ItemMetaType.ARROW;
    }
    static isBuilding(entity) {
        return entity.ownerClass != null && entity.ownerClass.factoryOf && entity.ownerClass.factoryOf == "building";
    }
    static isBox(entity) {
        return entity.ownerClass != null && entity.ownerClass.factoryOf && entity.ownerClass.factoryOf == "box";
    }
    static isMapObject(entity) {
        return entity instanceof MapObject_1.MapObject;
    }
    static reverseString(string) {
        return string.split("").reverse().join("");
    }
    static fromCharCode(codes) {
        return codes.map(((code) => String.fromCharCode(code))).join("");
    }
    static genRandomString(length) {
        let stringArr = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", str = "";
        for (let i = 0; i < length; i++) {
            str += stringArr[~~(Math.random() * stringArr.length)];
        }
        ;
        return str;
    }
    static joinString(arr) {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
            let string = Utils.genRandomString(Utils.randomMaxMin(3, 25));
            str += arr[i] + string;
        }
        return str;
    }
    static isInSand(entity) {
        const differentBetweenMaxX = ~~Math.abs(serverconfig_json_1.default.world.Width - entity.x);
        const differentBetweenMaxY = ~~Math.abs(serverconfig_json_1.default.world.Height - entity.y);
        const isBoundsFirst = differentBetweenMaxX >= 100 && differentBetweenMaxY >= 200 && (differentBetweenMaxX < 376 || differentBetweenMaxY < 616);
        const isBoundsSecond = entity.x >= 235 && entity.y >= 430 && (entity.x <= 600 || entity.y <= 800);
        return isBoundsFirst || isBoundsSecond;
    }
    static isInOutsideWater(entity) {
        const differentBetweenMaxX = ~~Math.abs(serverconfig_json_1.default.world.Width - entity.x);
        const differentBetweenMaxY = ~~Math.abs(serverconfig_json_1.default.world.Height - entity.y);
        return differentBetweenMaxX <= 100 || differentBetweenMaxY <= 200 || entity.x <= 234 || entity.y < 430;
    }
    static getNearestInRange(entity, radius, admin_check) {
        const entityArr = entity.gameServer.queryManager.queryPlayers(entity.x, entity.y, radius);
        if (!entityArr.length)
            return null;
        const nearest = Utils.getNearest(entity, entityArr, admin_check);
        return nearest;
    }
    static fromAngle(angle) {
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    static OpposingAngle(angle1, angle2) {
        const angle_1 = (angle1 / 255) * 360
        const angle_2 = (angle2 / 255) * 360
        const diff = (angle_2 - angle_1)
        return (diff < -80 && diff > -100)
    }

    static isInIsland(obj) {
        //@ts-ignore
        for (let i = 0; i < serverconfig_json_1.default.world.islands.length; i++) {
            let island = serverconfig_json_1.default.world.islands[i];
            if (obj.x >= island[0][0] && obj.y >= island[0][1] && obj.x <= island[1][0] && obj.y <= island[1][1])
                return true;
        }
        return false;
    }

    static isInBottleAFK(player) {
        const x = Math.floor(player.x / 100)
        const y = Math.floor(player.y / 100)
        return (x > 3 && x < 9 && y < 8 && y > 4)
    }

    static isInPremiumAFK(player) {
        const x = Math.floor(player.x / 100)
        const y = Math.floor(player.y / 100)
        return (x == 96 && y == 32)
    }
    static isInBottleHeal(player) {
        const x = Math.floor(player.x / 100)
        const y = Math.floor(player.y / 100)
        return (x == 8 && y == 6)
    }

    static isInLava(obj) {

        const extra = itemsmanager_1.ItemUtils.getItemById(obj.extra);

        if (obj.isFly && obj.speed > 18)
            return false;
        if (extra?.data?.vehicule_type == VehiculeType_1.VehiculeType.FLY && obj.speed > 18)
            return false;
        if (obj.stateManager?.isInBridge)
            return false;
        for (let lava of serverconfig_json_1.default.world.lava) {
            if (obj.x >= lava[0][0] && obj.x <= lava[0][1] && obj.y >= lava[1][0] && obj.y <= lava[1][1])
                return true;
        }
        if (obj.x >= 6100 && obj.x <= 6700 && obj.y >= 1200 && obj.y <= 1800)
            return true;

        if (obj.x >= 2000 && obj.x <= 2700 && obj.y >= 900 && obj.y <= 1600)
            return true;

        return false;
    }

    static Unraidable_Base(obj) {
        if (Math.floor(obj.x / 100) > 64 && Math.floor(obj.x / 100) < 67 && Math.floor(obj.y / 100) > 45 && Math.floor(obj.y / 100) < 47)
            return true;

        if (Math.floor(obj.x / 100) > 31 && Math.floor(obj.x / 100) < 36 && Math.floor(obj.y / 100) > 58 && Math.floor(obj.y / 100) < 63)
            return true;

        return false
    }

    static isInForest(obj) {
        if (Math.floor(obj.x / 100) > 50 || Math.floor(obj.x / 100) < 14)
            return false;

        if (Math.floor(obj.y / 100) > 43 || Math.floor(obj.y / 100) < 16)
            return false;

        return true;
    }

    static isInWinter(obj, type) {
        const borders = [];
        switch (type) {
            case 0:
                borders[0] = 45;
                borders[1] = 59;
                borders[2] = 63;
                borders[3] = 84;
                break;

            case 1:
                borders[0] = 18;
                borders[1] = type;
                borders[2] = 48;
                borders[3] = 61;
                break
        }


        if (Math.floor(obj.x / 100) <= borders[0] && Math.floor(obj.x / 100) >= borders[1] && Math.floor(obj.y / 100) >= borders[2] && Math.floor(obj.y / 100) <= borders[3]) {
            return true;
        }

        return false;
    }

    static backInHandshake(player, handshake, tokenScore = null) {
        const playersArr = Array.from(player.gameServer.players.values()).map(x => this.getHandshakeModelProfile(x, player.gameProfile.name));
        const craftsJson = [];
        for (const craft of player.gameServer.crafts) {
            craftsJson.push(craft.toObject());
        }
        let tData = [];
        if (player.totemFactory) {
            for (let i = 0; i < player.totemFactory.data.length; i++) {
                const d = player.totemFactory.data[i];
                tData.push(d.id);
            }
        }
        if (!tokenScore)
            tokenScore = player.tokenScore ?? null;
        let tScore = 0;
        if (tokenScore) {
            tScore = tokenScore.score;
        }

        player.getPacketEncryption = (9999999 + Math.random() * 100); // logic packet encryptor

        const backIn = [
            WorldModes_1.WorldModes.EXPERIMENTAL, // 1
            player.gameProfile.days, //2
            player.x, //3
            playersArr, //4
            player.gameServer.worldCycle.cycle, //5
            player.ownerClass.ghost, //6
            1, //7
            tData, //8
            player.playerId, //9
            player.y, //10
            serverconfig_json_1.default.server.playerLimit, //11
            0, //12
            tScore, //13
            player.inventory.serialize(), //14
            player.gameServer.worldCycle.time, //15
            performance.now() - player.spawnTime, //16
            player.completeQuests, // 17
            0, //18
            23172, //19
            // forest sizes: 153,153 , seed: 23172
            Math.floor(serverconfig_json_1.default.world.Width / 100), //20
            Math.floor(serverconfig_json_1.default.world.Height / 100), // 21
            0, //22
            serverconfig_json_1.default.world.map, //23
            "", //24
            craftsJson, //25
            0, //26
            0, // is blizzard going 27
            player.getPacketEncryption, // logic packet encryptor 28
        ];
        //  entity.ghost
        return backIn;
    }
    static randomMaxMin(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }
    static getQuestRewardByQuestType(type) {
        switch (type) {
            case QuestType_1.QuestType.DRAGON_CUBE:
                return [5000, ItemIds_1.ItemIds.DRAGON_CUBE];
            case QuestType_1.QuestType.DRAGON_ORB:
                return [5000, ItemIds_1.ItemIds.DRAGON_ORB];
            case QuestType_1.QuestType.GREEN_CROWN:
                return [5000, ItemIds_1.ItemIds.GEMME_GREEN];
            case QuestType_1.QuestType.ORANGE_CROWN:
                return [5000, ItemIds_1.ItemIds.GEMME_ORANGE];
            case QuestType_1.QuestType.BLUE_CROWN:
                return [5000, ItemIds_1.ItemIds.GEMME_BLUE];
            case QuestType_1.QuestType.SPECIAL_FUR:
                return [5000, ItemIds_1.ItemIds.SPECIAL_FUR];
            case QuestType_1.QuestType.SPECIAL_FUR_2:
                return [5000, ItemIds_1.ItemIds.SPECIAL_FUR_2];
            case QuestType_1.QuestType.LAVA_ORB:
                return [5000, ItemIds_1.ItemIds.LAVA_ORB];
            case QuestType_1.QuestType.LAVA_CUBE:
                return [5000, ItemIds_1.ItemIds.LAVA_CUBE];
            case QuestType_1.QuestType.PITCHFORK2:
                return [5000, ItemIds_1.ItemIds.PITCHFORK_PART];
            case QuestType_1.QuestType.PILOT_HELMET:
                return [5000, ItemIds_1.ItemIds.PILOT_GLASSES];
            case QuestType_1.QuestType.PILOT_HELMET:
                return [5000, ItemIds_1.ItemIds.PILOT_GLASSES];
            case QuestType_1.QuestType.BAG:
                return [5000, ItemIds_1.ItemIds.SANTA_HAT];
            case QuestType_1.QuestType.BAG2:
                return [5000, ItemIds_1.ItemIds.ELF_HAT];
            default:
                return null;
        }
    }
    static getItemInStorage(type) {
        switch (type) {
            case EntityType_1.EntityType.EXTRACTOR_MACHINE_STONE:
                return ItemIds_1.ItemIds.STONE;
            case EntityType_1.EntityType.EXTRACTOR_MACHINE_GOLD:
                return ItemIds_1.ItemIds.GOLD;
            case EntityType_1.EntityType.EXTRACTOR_MACHINE_DIAMOND:
                return ItemIds_1.ItemIds.DIAMOND;
            case EntityType_1.EntityType.EXTRACTOR_MACHINE_AMETHYST:
                return ItemIds_1.ItemIds.AMETHYST;
            case EntityType_1.EntityType.EXTRACTOR_MACHINE_REIDITE:
                return ItemIds_1.ItemIds.REIDITE;
            default:
                return -1;
        }
    }
    static checkVehiculeCondition(player, vehicule_type) {
        switch (vehicule_type) {
            case VehiculeType_1.VehiculeType.SEA:
                return !player.stateManager.isInSea && !player.stateManager.isInBridge && !player.stateManager.isInRiver;
            case VehiculeType_1.VehiculeType.GROUND:
                return !player.stateManager.isCollides && !player.stateManager.isInWater;
            case VehiculeType_1.VehiculeType.FLY:
                return !player.stateManager.isCollides;
            default:
                return false;
        }
    }
    static getHandshakeModelProfile(player, requestName = "") {
        if (__1.ENV_MODE == env_mode_1.MODES.TEST) {
            return {
                n: requestName == player.gameProfile.name ? player.gameProfile.name : `Tester`,
                s: player.gameProfile.skin,
                a: player.gameProfile.accessory,
                b: player.gameProfile.book,
                d: player.gameProfile.deadBox,
                c: player.gameProfile.box,
                l: player.gameProfile.kills,
                g: player.gameProfile.baglook,
                p: player.gameProfile.score,
                i: player.playerId
            };
        }
        else {
            return {
                n: player.gameProfile.name,
                s: player.gameProfile.skin,
                a: player.gameProfile.accessory,
                b: player.gameProfile.book,
                d: player.gameProfile.deadBox,
                c: player.gameProfile.box,
                l: player.gameProfile.kills,
                g: player.gameProfile.baglook,
                p: player.gameProfile.score,
                i: player.playerId
            };
        }
    }
    static isEquals(data, type) {
        switch (type) {
            case DataType_1.DataType.ARRAY:
                return Array.isArray(data);
            case DataType_1.DataType.FLOAT:
                return isFinite(data) && (data % 1) != data;
            case DataType_1.DataType.INTEGER:
                return typeof data == 'number';
            case DataType_1.DataType.STRING:
                return typeof data === 'string';
            case DataType_1.DataType.OBJECT:
                return typeof data === 'object';
            default: {
                Logger_1.Loggers.app.error('Unknown DataType: {0}', data);
                return false;
            }
        }
    }
    static isContains(id, arr) {
        return arr.find((e) => e.id == id);
    }
    static calculateAngle255(angle) {
        let pi2 = Math.PI * 2;
        return Math.floor((((angle + pi2) % pi2) * 255) / pi2);
    }
    static referenceAngle(angle) {
        return (((angle / 255) * Math.PI) * 2);
    }
    static getPointOnCircle(x, y, angle, radius) {
        return {
            x: x + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius
        };
    }
    static random_min_max(min, max) {
        return min + (Math.floor(Math.random() * (max - min)));
    }
    static angleDifference(a1, a2) {
        let max = Math.PI * 2;
        let diff = (a2 - a1) % max;
        return Math.abs(2 * diff % max - diff);
    }
    static distanceSqrt(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
    static distanceHypot(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }
    static angleDiff(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.atan2(dy, dx);
    }
    static RetrivedAngle(_this) {
        const collides = _this.gameServer.queryManager.queryCircle(_this.x, _this.y, _this.radius + 1000);
        const eliminated_angles = [];
        const attempts = 0;

        for (let i = 0; i < collides.length; i++) {
            const collide = collides[i];
            if (collide instanceof MapObject_1.MapObject) {
                if (collide.isSolid) {
                    const angleToCollide = this.angleDiff(_this.x, collide.x, _this.y, collide.y);
                    eliminated_angles.push(angleToCollide);
                }
            }
        }

        let angle = Math.random() * 255;

        while (eliminated_angles.includes(angle) && attempts < 100) {
            angle = Math.random() * 255;
            attempts++
        }
        return angle;
    }

    static isCirclesCollides(x1, y1, x2, y2, r1, r2) {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        if (Math.hypot(dx, dy) <= (r1 + r2))
            return true;
        return false;
    }
    static getCircleDist(x1, y1, x2, y2) {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        return Math.hypot(dx, dy);
    }
    static difference(a1, a2) {
        return a1 - a2;
    }
    static getNearest(obj, entities, admin_check) {
        const target = {
            entity: null,
            dist: -1,
        };
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (admin_check && (entities.staffAllowed || entity.isAdmin || entity.isTrial || entity.isMod)) {
                return
            };
            const dist = this.distanceSqrt(obj.x, obj.y, entity.x, entity.y);
            if (target.dist == -1 || dist < target.dist) {
                target.entity = entity;
                target.dist = dist;
            }
        }
        ;
        return target;
    };
    static isLanding(PacketType, Player) {
        let response = true;

        if (PacketType == 0) {
            if (Player.isFly) {

                const Collides = Player.gameServer.queryManager.queryCircle(Player.x, Player.y, Player.radius);

                for (let i = 0; i < Collides.length; i++) {
                    let entity = Collides[i]

                    if (entity.raw_type == 'cs') {
                        response = false;
                    }

                    if (entity.itemName == "BRIDGE") {
                        response = true;
                    }

                    if (entity.itemName == 'ROOF') {
                        response = false;
                    }
                }
            }
        }
        return response;
    }
    static getBoxSkin(type) {
        return 0;
        switch (type) {
            case EntityType_1.EntityType.WOLF:
                return BoxIds_1.BoxIds.WOLF;
            case EntityType_1.EntityType.RABBIT:
                return BoxIds_1.BoxIds.RABBIT;
            case EntityType_1.EntityType.BOAR:
                return BoxIds_1.BoxIds.BOAR;
            case EntityType_1.EntityType.SPIDER:
                return BoxIds_1.BoxIds.SPIDER;
            case EntityType_1.EntityType.PIRANHA:
                return BoxIds_1.BoxIds.PIRANHA;
            case EntityType_1.EntityType.KRAKEN:
                return BoxIds_1.BoxIds.KRAKEN;
            case EntityType_1.EntityType.FIREFLY:
                return BoxIds_1.BoxIds.FIREFLY;
            case EntityType_1.EntityType.CRAB_BOSS:
                return BoxIds_1.BoxIds.CRAB_BOSS;
            default:
                return 0;
        }
        ;
    };

    static getOffsetVector(v, distanceToMove, angle) {
        return (new Vector_1.Vector(distanceToMove * Math.cos((angle / 255) * (Math.PI * 2)), distanceToMove * Math.sin((angle / 255) * (Math.PI * 2))));
    }

    static getObjectType(type) {
        switch (type) {
            case 'cactus':
                return ObjectType_1.ObjectType.CACTUS;
            case 'emerald':
                return ObjectType_1.ObjectType.EMERALD;
            case 'cave_stone':
                return ObjectType_1.ObjectType.CAVE_STONE;
            case 'reidite':
                return ObjectType_1.ObjectType.REIDITE;
            case 'island_palma':
                return ObjectType_1.ObjectType.PALM;
            case "island":
                return ObjectType_1.ObjectType.ISLAND;
            case 'berry':
                return ObjectType_1.ObjectType.BERRY_BUSH;
            case 'stone':
                return ObjectType_1.ObjectType.STONE;
            case 'tree':
                return ObjectType_1.ObjectType.TREE;
            case 'pizdecKvadrat':
                return ObjectType_1.ObjectType.TREE;
            case 'amethyst':
                return ObjectType_1.ObjectType.AMETHYST;
            case 'diamond':
                return ObjectType_1.ObjectType.DIAMOND;
            case 'gold':
                return ObjectType_1.ObjectType.GOLD;
            case "river":
                return ObjectType_1.ObjectType.RIVER;
        }
        console.log('undefined obj type: ' + type);
        return ObjectType_1.ObjectType.TREE;
    }
    static getMarket(id, count) {
        switch (id) {
            case MarketIds_1.MarketIds.WOOD:
                return [
                    [ItemIds_1.ItemIds.WOOD, ItemIds_1.ItemIds.PLANT], Math.min(249, Math.max(0, (~~count * 3)))
                ];
            case MarketIds_1.MarketIds.STONE:
                return [
                    [ItemIds_1.ItemIds.STONE, ItemIds_1.ItemIds.PUMPKIN], Math.min(248, Math.max(0, ~~(count * 4)))
                ];
            case MarketIds_1.MarketIds.GOLD:
                return [
                    [ItemIds_1.ItemIds.GOLD, ItemIds_1.ItemIds.BREAD], Math.min(246, Math.max(0, ~~(count * 6)))
                ];
            case MarketIds_1.MarketIds.DIAMOND:
                return [
                    [ItemIds_1.ItemIds.DIAMOND, ItemIds_1.ItemIds.CARROT], Math.min(63, Math.max(0, ~~(count / 4)))
                ];
            case MarketIds_1.MarketIds.AMETHYST:
                return [
                    [ItemIds_1.ItemIds.AMETHYST, ItemIds_1.ItemIds.TOMATO], Math.min(31, Math.max(0, ~~(count / 8)))
                ];
            case MarketIds_1.MarketIds.REIDITE:
                return [
                    [ItemIds_1.ItemIds.REIDITE, ItemIds_1.ItemIds.THORNBUSH], Math.min(15, Math.max(0, ~~(count / 16)))
                ];
            case MarketIds_1.MarketIds.PUMPKIN:
                return [
                    [ItemIds_1.ItemIds.PUMPKIN_SEED, ItemIds_1.ItemIds.BREAD], Math.min(25, Math.max(0, ~~(count / 10)))
                ];
            case MarketIds_1.MarketIds.CARROT:
                return [
                    [ItemIds_1.ItemIds.CARROT_SEED, ItemIds_1.ItemIds.PUMPKIN], Math.min(15, Math.max(0, ~~(count / 16)))
                ];
            case MarketIds_1.MarketIds.TOMATO:
                return [
                    [ItemIds_1.ItemIds.TOMATO_SEED, ItemIds_1.ItemIds.CARROT], Math.min(12, Math.max(0, ~~(count / 20)))
                ];
            case MarketIds_1.MarketIds.THORNBUSH:
                return [
                    [ItemIds_1.ItemIds.THORNBUSH_SEED, ItemIds_1.ItemIds.TOMATO], Math.min(8, Math.max(0, ~~(count / 30)))
                ];
            case MarketIds_1.MarketIds.GARLIC:
                return [
                    [ItemIds_1.ItemIds.GARLIC_SEED, ItemIds_1.ItemIds.THORNBUSH], Math.min(6, Math.max(0, ~~(count / 40)))
                ];
            case MarketIds_1.MarketIds.WATERMELON:
                return [
                    [ItemIds_1.ItemIds.WATERMELON_SEED, ItemIds_1.ItemIds.GARLIC], Math.min(4, Math.max(0, ~~(count / 60)))
                ];
            default:
                return -1;
        }
    }
    /* static getKit(id) {
         switch (id) {
             case 1:
                 return [1000, [ItemIds_1.ItemIds.FIRE, 2],
                     [ItemIds_1.ItemIds.COOKED_MEAT, 1],
                     [ItemIds_1.ItemIds.PLANT, 8],
                     [ItemIds_1.ItemIds.BREAD, 1]
                 ];
             case 2:
                 return [2000, [ItemIds_1.ItemIds.BIG_FIRE, 2],
                     [ItemIds_1.ItemIds.PICK_WOOD, 1],
                     [ItemIds_1.ItemIds.COOKED_MEAT, 2],
                     [ItemIds_1.ItemIds.PLANT, 16],
                     [ItemIds_1.ItemIds.BREAD, 2]
                 ];
             case 3:
                 return [4000, [ItemIds_1.ItemIds.BIG_FIRE, 3],
                     [ItemIds_1.ItemIds.PICK, 1],
                     [ItemIds_1.ItemIds.COOKED_MEAT, 4],
                     [ItemIds_1.ItemIds.PLANT, 20],
                     [ItemIds_1.ItemIds.BREAD, 4],
                     [ItemIds_1.ItemIds.WORKBENCH, 1],
                     [ItemIds_1.ItemIds.STONE, 80],
                     [ItemIds_1.ItemIds.WOOD, 140]
                 ];
             case 4:
                 return [8000, [ItemIds_1.ItemIds.BAG, 1],
                     [ItemIds_1.ItemIds.BIG_FIRE, 4],
                     [ItemIds_1.ItemIds.PICK_GOLD, 1],
                     [ItemIds_1.ItemIds.COOKED_MEAT, 6],
                     [ItemIds_1.ItemIds.PLANT, 30],
                     [ItemIds_1.ItemIds.BREAD, 6],
                     [ItemIds_1.ItemIds.WORKBENCH, 1],
                     [ItemIds_1.ItemIds.STONE, 150],
                     [ItemIds_1.ItemIds.WOOD, 200],
                     [ItemIds_1.ItemIds.GOLD, 80],
                     [ItemIds_1.ItemIds.BOTTLE_FULL, 2]
                 ];
             case 5:
                 return [16000, [ItemIds_1.ItemIds.BAG, 1],
                     [ItemIds_1.ItemIds.PICK_DIAMOND, 1],
                     [ItemIds_1.ItemIds.BED, 1],
                     [ItemIds_1.ItemIds.CAKE, 7],
                     [ItemIds_1.ItemIds.BOTTLE_FULL, 2],
                     [ItemIds_1.ItemIds.BIG_FIRE, 2],
                     [ItemIds_1.ItemIds.FURNACE, 1],
                     [ItemIds_1.ItemIds.STONE_WALL, 15],
                     [ItemIds_1.ItemIds.STONE_DOOR, 2],
                     [ItemIds_1.ItemIds.TOTEM, 1],
                     [ItemIds_1.ItemIds.SPANNER, 1],
                     [ItemIds_1.ItemIds.STONE, 200],
                     [ItemIds_1.ItemIds.WOOD, 300]
                 ];
             case 6:
                 return [16000, [ItemIds_1.ItemIds.BAG, 1],
                     [ItemIds_1.ItemIds.FUR_HAT, 1],
                     [ItemIds_1.ItemIds.SHOVEL_GOLD, 1],
                     [ItemIds_1.ItemIds.PICK_GOLD, 1],
                     [ItemIds_1.ItemIds.CAKE, 10],
                     [ItemIds_1.ItemIds.BOTTLE_FULL, 4],
                     [ItemIds_1.ItemIds.BIG_FIRE, 6],
                     [ItemIds_1.ItemIds.BANDAGE, 3],
                     [ItemIds_1.ItemIds.BOOK, 1],
                     [ItemIds_1.ItemIds.STONE, 200],
                     [ItemIds_1.ItemIds.WOOD, 300]
                 ];
             case 7:
                 return [16000, [ItemIds_1.ItemIds.BAG, 1],
                     [ItemIds_1.ItemIds.HOOD, 1],
                     [ItemIds_1.ItemIds.HAMMER_GOLD, 1],
                     [ItemIds_1.ItemIds.BANDAGE, 3],
                     [ItemIds_1.ItemIds.SWORD, 1],
                     [ItemIds_1.ItemIds.PICK_GOLD, 1],
                     [ItemIds_1.ItemIds.CAKE, 7],
                     [ItemIds_1.ItemIds.BOTTLE_FULL, 2],
                     [ItemIds_1.ItemIds.BIG_FIRE, 4],
                     [ItemIds_1.ItemIds.STONE, 150],
                     [ItemIds_1.ItemIds.WOOD, 200],
                     [ItemIds_1.ItemIds.LOCKPICK, 1]
                 ];
             case 8:
                 return [16000, [ItemIds_1.ItemIds.BAG, 1],
                     [ItemIds_1.ItemIds.PEASANT, 1],
                     [ItemIds_1.ItemIds.PICK_GOLD, 1],
                     [ItemIds_1.ItemIds.CAKE, 7],
                     [ItemIds_1.ItemIds.BOTTLE_FULL, 2],
                     [ItemIds_1.ItemIds.BIG_FIRE, 4],
                     [ItemIds_1.ItemIds.WINDMILL, 2],
                     [ItemIds_1.ItemIds.BREAD_OVEN, 4],
                     [ItemIds_1.ItemIds.PLOT, 10],
                     [ItemIds_1.ItemIds.WHEAT_SEED, 6],
                     [ItemIds_1.ItemIds.SEED, 4],
                     [ItemIds_1.ItemIds.WATERING_CAN_FULL, 1],
                     [ItemIds_1.ItemIds.WOOD, 500]
                 ];
             case 9:
                 return [16000, [ItemIds_1.ItemIds.BAG, 1],
                     [ItemIds_1.ItemIds.PICK_GOLD, 1],
                     [ItemIds_1.ItemIds.FOODFISH_COOKED, 16],
                     [ItemIds_1.ItemIds.BOTTLE_FULL, 1],
                     [ItemIds_1.ItemIds.BIG_FIRE, 6],
                     [ItemIds_1.ItemIds.BANDAGE, 3],
                     [ItemIds_1.ItemIds.DIVING_MASK, 1],
                     [ItemIds_1.ItemIds.SWORD, 1],
                     [ItemIds_1.ItemIds.BRIDGE, 16],
                     [ItemIds_1.ItemIds.STONE, 150],
                     [ItemIds_1.ItemIds.WOOD, 200]
                 ];
             case 10:
                 return [20000, [ItemIds_1.ItemIds.BAG, 1],
                     [ItemIds_1.ItemIds.PICK_GOLD, 1],
                     [ItemIds_1.ItemIds.CAKE, 1],
                     [ItemIds_1.ItemIds.BOTTLE_FULL, 1],
                     [ItemIds_1.ItemIds.BIG_FIRE, 3],
                     [ItemIds_1.ItemIds.BANDAGE, 3],
                     [ItemIds_1.ItemIds.GOLD_HELMET, 1],
                     [ItemIds_1.ItemIds.SWORD_GOLD, 1],
                     [ItemIds_1.ItemIds.DIAMOND_SPEAR, 1],
                     [ItemIds_1.ItemIds.GOLD_SPIKE, 2],
                     [ItemIds_1.ItemIds.STONE, 50],
                     [ItemIds_1.ItemIds.WOOD, 100]
                 ];
             default:
                 return -1;
         }
     }*/
    static deserealizeMapUnit(array = []) {
        return {
            type: array[0],
            radius: array[3],
            x: array[1],
            y: array[2],
            show: array[4]
        };
    }
    static objectEquals(x, y, this_) {
        if (x === null || x === undefined || y === null || y === undefined) {
            return x === y;
        }
        // after this just checking type of one would be enough
        if (x.constructor !== y.constructor) {
            return false;
        }
        // if they are functions, they should exactly refer to same one (because of closures)
        if (x instanceof Function) {
            return x === y;
        }
        // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
        if (x instanceof RegExp) {
            return x === y;
        }
        if (x === y || x.valueOf() === y.valueOf()) {
            return true;
        }
        if (Array.isArray(x) && x.length !== y.length) {
            return false;
        }
        // if they are dates, they must had equal valueOf
        if (x instanceof Date) {
            return false;
        }
        // if they are strictly equal, they both need to be object at least
        if (!(x instanceof Object)) {
            return false;
        }
        if (!(y instanceof Object)) {
            return false;
        }
        // recursive object equality check
        var p = Object.keys(x);
        return Object.keys(y).every(function (i) {
            return p.indexOf(i) !== -1;
        }) &&
            p.every(function (i) {
                return this_.objectEquals(x[i], y[i], this_);
            });
    }
    static indexFromMapObject(name) {
        switch (name) {
            case 'p':
                return {
                    i: 0, needSize: false
                };
            case 's':
                return {
                    i: 1, needSize: true
                };
            case 't':
                return {
                    i: 4, needSize: true
                };
            case 'g':
                return {
                    i: 10, needSize: true
                };
            case 'd':
                return {
                    i: 13, needSize: true
                };
            case 'b':
                return {
                    i: 16, needSize: true
                };
            case 'f':
                return {
                    i: 20, needSize: true
                };
            case 'sw':
                return {
                    i: 23, needSize: true
                };
            case 'gw':
                return {
                    i: 26, needSize: true
                };
            case 'dw':
                return {
                    i: 29, needSize: true
                };
            case 'a':
                return {
                    i: 32, needSize: true
                };
            case 'cs':
                return {
                    i: 35, needSize: true
                };
            case 'plm':
                return {
                    i: 40, needSize: true
                };
            case 're':
                return {
                    i: 50, needSize: true
                };
            case 'c':
                return {
                    i: 55, needSize: false
                };
            case 'm':
                return {
                    i: 56, needSize: true
                };
            case "r":
                return {
                    i: -1, needSize: false
                };
        }
    }
    static entityTypeFromItem(item) {
        const asAny = ItemIds_1.ItemIds;
        for (const itemIds in asAny)
            if (asAny[itemIds] == item)
                return EntityType_1.EntityType[itemIds];
        return null;
    }
    static InMap(value, in_min, in_max, out_min, out_max) {
        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    ;
}
exports.Utils = Utils;
class EvelCodec {
    constructor() {
    }
    static unpack(bytes, offset = 10) {
        const chars = [];
        let unminfiedarr = [];
        for (let i = 0, n = bytes.length; i < n;) {
            chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
        }
        for (let i = 0; i < chars.length; i++) {
            unminfiedarr.push((chars[i] / (chars.length - i)));
        }
        return String.fromCharCode.apply(null, unminfiedarr);
    }
    static pack(str) {
        str = String(str);
        var bytes = [];
        for (var i = 0, n = str.length; i < str.length; i++) {
            var char = str.charCodeAt(i);
            char = (char * (n - i));
            bytes.push((char >>> 8), (char & 0xff));
        }
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
            arr[i] = bytes[i];
        }
        return arr;
    }
}

exports.EvelCodec = EvelCodec;