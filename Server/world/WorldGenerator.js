"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldGenerator = void 0;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const Building_1 = require("../entity/Building");
const EntityUtils_1 = require("../utils/EntityUtils");
const MapObject_1 = require("../entity/MapObject");
const Biomes_1 = require("../enums/Biomes");
const ObjectType_1 = require("../enums/ObjectType");
const Logger_1 = require("../logs/Logger");
const Utils_1 = require("../utils/Utils");
const PacketType_1 = require("../enums/PacketType");
const WorldBiomeResolver_1 = require("./WorldBiomeResolver");
const bufferReader_1 = require("../utils/bufferReader");
const ItemIds_1 = require("../enums/ItemIds");
const itemsmanager_1 = require("../utils/itemsmanager");
const WorldDeleter_1 = require("./WorldDeleter");
class WorldGenerator {
    gameServer;
    decodedMap = [];
    biomes;
    LavaIds = [];
    Gifts = 0;
    constructor(gameServer) {
        this.gameServer = gameServer;
        this.biomes = [];
    }

    generateBuilding(gameServer, item, pos, etype, entityType, angle = Math.random() * 255, health, solid = true) {
        const id = Math.floor(Math.random() * 100) + 200;
        const writer = new bufferReader_1.BufferWriter(2);

        const building = new Building_1.Building(
            itemsmanager_1.ItemType.GAME_OBJECT,
            gameServer.entityPool.nextId(),
            id,
            gameServer,
            item.data.damageProtection,
            item.data,
            item.meta_type,
            item.name
        );

        building.initEntityData(pos.x, pos.y, angle, etype, true);
        building.max_health = health ?? item.data.health ?? 0;
        building.health = health ?? item.data.health ?? 0;
        building.radius = item.data.radius ?? 0;
        building.isSolid = solid
        building.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
        building.initOwner(building);
        building.setup();
        this.LavaIds.push(id)
        if (building.metaType != itemsmanager_1.ItemMetaType.PLANT)
            building.info = building.health;

        gameServer.initLivingEntity(building);
        writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.AcceptBuild);
        writer.writeUInt8(entityType);
    }

    ReplaceEmerald(refresh, GameServer) {
        const buildingData = [
            {
                itemId: ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE,
                position: { x: 4150, y: 4950 },
                entityType: Utils_1.Utils.entityTypeFromItem(ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE),
                buildingId: ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE
            },
            {
                itemId: ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE,
                position: { x: 4250, y: 4950 },
                entityType: Utils_1.Utils.entityTypeFromItem(ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE),
                buildingId: ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE,
            }
        ];

        const gameServer = GameServer ?? this.gameServer 

        if (refresh) {
            for (let i = 0; i < gameServer.entities.length; i++) {
                const world_entity = gameServer.entities[i]

                if (world_entity instanceof Building_1.Building) {
                    if (world_entity.owner == itemsmanager_1.ItemType.GAME_OBJECT) {
                        world_entity.gameServer.removeEntity(world_entity)
                    }
                }
            }
        }


        for (const building of buildingData) {
            this.generateBuilding(this.gameServer, itemsmanager_1.ItemUtils.getItemById(building.itemId), building.position, building.entityType, building.buildingId, building.angle, building.health, building.isSolid);
        }
    }

    ReplaceLavaKit(refresh, GameServer) {
        const buildingData = [
            {
                itemId: ItemIds_1.ItemIds.STONE_SPIKE,
                position: { x: 8550, y: 3240 },
                entityType: Utils_1.Utils.entityTypeFromItem(ItemIds_1.ItemIds.STONE_SPIKE),
                buildingId: ItemIds_1.ItemIds.STONE_SPIKE
            },
            {
                itemId: ItemIds_1.ItemIds.ROOF,
                position: { x: 8620, y: 3240 },
                entityType: Utils_1.Utils.entityTypeFromItem(ItemIds_1.ItemIds.ROOF),
                buildingId: ItemIds_1.ItemIds.ROOF,
                angle: 0,
                health: 40000,
                isSolid: false
            },
            {
                itemId: ItemIds_1.ItemIds.ROOF,
                position: { x: 8720, y: 3240 },
                entityType: Utils_1.Utils.entityTypeFromItem(ItemIds_1.ItemIds.ROOF),
                buildingId: ItemIds_1.ItemIds.ROOF,
                angle: 0,
                health: 40000,
                isSolid: false
            },
            {
                itemId: ItemIds_1.ItemIds.ROOF,
                position: { x: 8820, y: 3240 },
                entityType: Utils_1.Utils.entityTypeFromItem(ItemIds_1.ItemIds.ROOF),
                buildingId: ItemIds_1.ItemIds.ROOF,
                angle: 0,
                health: 40000,
                isSolid: false
            }
        ];

        const gameServer = GameServer ?? this.gameServer

        if (refresh) {
            for (let i = 0; i < gameServer.entities.length; i++) {
                const world_entity = gameServer.entities[i]

                if (world_entity instanceof Building_1.Building) {
                    if (world_entity.owner == itemsmanager_1.ItemType.GAME_OBJECT) {
                        world_entity.gameServer.removeEntity(world_entity)
                    }
                }
            }
        }


        for (const building of buildingData) {
            this.generateBuilding(this.gameServer, itemsmanager_1.ItemUtils.getItemById(building.itemId), building.position, building.entityType, building.buildingId, building.angle, building.health, building.isSolid);
        }
    }


    generateWorld(config) {
        const createTs = performance.now();
        this.gameServer.WorldGenerator = this;
        Logger_1.Loggers.game.info("Regeneration of map started..");
        this.decodeWorld(config);
        this.ReplaceLavaKit()

        for (let i = 0; i < this.decodedMap.length; i++) {
            const map_obj_data = this.decodedMap[i];
            switch (map_obj_data.type) {
                case "cactus":
                case "emerald":
                case "cave_stone":
                case "reidite":
                case "island_palma":
                case "stone":
                case "tree":
                case "pizdecKvadrat":
                case "amethyst":
                case "island":
                case "diamond":
                case "river":
                case "gold": {
                    const x = 50 + map_obj_data.x * 100;
                    const y = 50 + map_obj_data.y * 100;
                    const radius = map_obj_data.radius;
                    const size = map_obj_data.size;
                    const raw_type = map_obj_data.raw_type;
                    const obj = new MapObject_1.MapObject(Utils_1.Utils.getObjectType(map_obj_data.type), x, y, radius, raw_type, size);
                    this.gameServer.initStaticEntity(obj);
                    if (obj.type == ObjectType_1.ObjectType.RIVER || obj.type == ObjectType_1.ObjectType.LAKE || obj.type == ObjectType_1.ObjectType.ISLAND)
                        obj.isSolid = false;
                    break;
                }
            }
        }
        Logger_1.Loggers.game.info("Regenerated world within {0}ms", performance.now() - createTs);
    }
    decodeWorld(config) {
        let radius = 0;
        for (let i = 0; i < config.length; i++) {
            const _Map = config[i];
            switch (_Map[1]) {
                case "DRAGON":
                case "WINTER":
                case "DESERT":
                case "LAVA":
                case "FOREST":
                    var __id = Biomes_1.Biomes.FOREST;
                    switch (_Map[1]) {
                        case "DRAGON":
                            __id = Biomes_1.Biomes.DRAGON;
                            break;
                        case "WINTER":
                            __id = Biomes_1.Biomes.WINTER;
                            break;
                        case "DESERT":
                            __id = Biomes_1.Biomes.DESERT;
                            break;
                        case "LAVA":
                            __id = Biomes_1.Biomes.LAVA;
                            break;
                        case "FOREST":
                            __id = Biomes_1.Biomes.FOREST;
                            break;
                    }
                    this.biomes.push(new WorldBiomeResolver_1.Biome(__id, _Map[2], _Map[3], _Map[4], _Map[5]));
                    break;
                case "isl": {
                    const _i = _Map[3];
                    const _j = _Map[4];
                    let r = 50;
                    for (var k = 0; k < 4; k++) {
                        for (var l = 0; l < 5; l++) {
                            if (k >= 3 && l >= 4)
                                continue;
                            this.createSingleIsland(_i - l, _j - k, r);
                            this.createSingleIsland(_i + l, _j - k, r);
                            this.createSingleIsland(_i + l, _j + k, r);
                            this.createSingleIsland(_i - l, _j + k, r);
                        }
                    }
                    break;
                }
                case "cs":
                    if (_Map[2] == 0)
                        _Map[2] = 100;
                    if (_Map[2] == 1)
                        _Map[2] = 87;
                    if (_Map[2] == 2)
                        _Map[2] = 95;
                    if (_Map[2] == 3)
                        _Map[2] = 90;
                    this.decodedMap.push({
                        type: "cave_stone",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: 90,
                        raw_type: _Map[1]
                    });
                    break;
                case "wtb":
                case "r":
                    radius = 50;
                    this.decodedMap.push({
                        type: "river",
                        x: _Map[3],
                        y: _Map[4],
                        size: 1,
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "s":
                    if (_Map[2] == 0)
                        radius = 95;
                    if (_Map[2] == 1)
                        radius = 87;
                    if (_Map[2] == 2)
                        radius = 50;
                    this.decodedMap.push({
                        type: "stone",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "la":
                    this.decodedMap.push({
                        type: "lava_magma",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "t":
                    if (_Map[2] == 0 || _Map[2] == 1)
                        radius = 95;
                    if (_Map[2] == 2 || _Map[2] == 3)
                        radius = 70;
                    if (_Map[2] == 4 || _Map[2] == 5)
                        radius = 55;
                    this.decodedMap.push({
                        type: "tree",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "b":
                    if (_Map[2] == 3 || _Map[2] == 2)
                        radius = 70;
                    if (_Map[2] == 1 || _Map[2] == 0)
                        radius = 90;
                    this.decodedMap.push({
                        type: "tree",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "f":
                    if (_Map[2] == 0)
                        radius = 124;
                    if (_Map[2] == 1)
                        radius = 98;
                    if (_Map[2] == 2)
                        radius = 83;
                    this.decodedMap.push({
                        type: "pizdecKvadrat",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "c":
                    _Map[2] = 55;
                    this.decodedMap.push({
                        type: "desert_cactus",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "re":
                    if (_Map[2] == 0)
                        radius = 67;
                    if (_Map[2] == 1)
                        radius = 82;
                    if (_Map[2] == 2)
                        radius = 90;
                    this.decodedMap.push({
                        type: "reidite",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "plm":
                    if (_Map[2] == 0)
                        radius = 30;
                    if (_Map[2] == 1)
                        radius = 47;
                    if (_Map[2] == 2)
                        radius = 65;
                    this.decodedMap.push({
                        type: "island_palma",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "g":
                case "gw":
                    if (_Map[2] == 0)
                        radius = 85;
                    if (_Map[2] == 1)
                        radius = 65;
                    if (_Map[2] == 2)
                        radius = 55;
                    this.decodedMap.push({
                        type: "gold",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "d":
                case "dw":
                    if (_Map[2] == 0)
                        radius = 80;
                    if (_Map[2] == 1)
                        radius = 70;
                    if (_Map[2] == 2)
                        radius = 55;
                    this.decodedMap.push({
                        type: "diamond",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "p":
                    radius = 70;
                    this.decodedMap.push({
                        type: "berry",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "a":
                    if (_Map[2] == 0)
                        radius = 80;
                    if (_Map[2] == 2)
                        radius = 55;
                    if (_Map[2] == 1)
                        radius = 75;
                    this.decodedMap.push({
                        type: "amethyst",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "m":
                    if (_Map[2] == 0)
                        radius = 60;
                    if (_Map[2] == 1)
                        radius = 75;
                    if (_Map[2] == 2)
                        radius = 85;
                    this.decodedMap.push({
                        type: "emerald",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
                case "l":
                    this.decodedMap.push({
                        type: "lake",
                        x: _Map[3],
                        y: _Map[4],
                        size: _Map[2],
                        radius: radius,
                        raw_type: _Map[1]
                    });
                    break;
            }
            ;
        }
        ;
    }
    createSingleIsland(x, y, radius) {
        this.decodedMap.push({
            type: "island",
            x: x,
            y: y,
            radius: radius
        });
    }
}
exports.WorldGenerator = WorldGenerator;