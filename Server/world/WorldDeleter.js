"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEntity = exports.WorldDeleter = void 0;
const Action_1 = require("../enums/Action");
const DieReason_1 = require("../enums/DieReason");
const EntityType_1 = require("../enums/EntityType");
const PacketType_1 = require("../enums/PacketType");
const itemsmanager_1 = require("../utils/itemsmanager");
const bufferReader_1 = require("../utils/bufferReader");
class WorldDeleter {
    deleteQuery;
    gameServer;
    constructor(gameServer) {
        this.deleteQuery = [];
        this.gameServer = gameServer;
    }
    queryDelete() {
        for (let i = 0; i < this.deleteQuery.length; i++) {
            const dEntity = this.deleteQuery[i];
            this.removeEntity(dEntity.type, dEntity);
        }
    }
    removeEntity(type, dEntity) {
        const newList = this.deleteQuery.filter(de => de.entity.id != dEntity.entity.id);
        this.deleteQuery = newList;
        switch (dEntity.entity.type) {
            case EntityType_1.EntityType.FIREFLY:
                dEntity.entity.gameServer.worldSpawner.fireflys--;
                break;
            case EntityType_1.EntityType.SPIDER:
                dEntity.entity.gameServer.worldSpawner.spiders--;
                break;
            case EntityType_1.EntityType.RABBIT:
                dEntity.entity.gameServer.worldSpawner.rabbits--;
                break;
            case EntityType_1.EntityType.BOAR:
                dEntity.entity.gameServer.worldSpawner.boars--;
                break;
            case EntityType_1.EntityType.TREASURE_CHEST:
                dEntity.entity.gameServer.worldSpawner.treasure--;
                break;
            case EntityType_1.EntityType.BABY_DRAGON:
                dEntity.entity.gameServer.worldSpawner.baby_dragons--;
                break;
            case EntityType_1.EntityType.FOX:
                dEntity.entity.gameServer.worldSpawner.winter_wolfs[dEntity.entity.mod]--;
                break;
            case EntityType_1.EntityType.ALOE_VERA_MOB:
                dEntity.entity.gameServer.worldSpawner.aloe_vera--;
                break;
            case EntityType_1.EntityType.GIFT:
                dEntity.entity.gameServer.worldSpawner.gifts--;
                break;
        }

        switch (type) {
            case "static": {
                break;
            }
            case "living": {
                this.gameServer.removeLivingEntity(dEntity.entity);
                break;
            }
            case "building":
                dEntity.entity.ownerClass.onDead();
                if (dEntity.entity.ownerClass.owner != itemsmanager_1.ItemType.GAME_OBJECT) {
                    dEntity.entity.ownerClass.owner.buildingManager.removeBuilding(dEntity.entity.id);
                }
                this.gameServer.removeLivingEntity(dEntity.entity);
                break;
            case "player": {
                this.gameServer.removeLivingEntity(dEntity.entity, true);
                this.gameServer.playerPool.dispose(dEntity.entity.id);
                dEntity.entity.controller.sendJSON([
                    PacketType_1.ServerPacketTypeJson.KillPlayer,
                    DieReason_1.DieReason.BEAR_KILLED,
                    -1,
                    3
                ]);
                const writer = new bufferReader_1.BufferWriter(3);
                writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.KillPlayer, dEntity.entity.id);
                writer.writeUInt8(dEntity.entity.id, dEntity.entity.id);
                this.gameServer.broadcastBinary(writer.toBuffer());
                for (let i = 0; i < dEntity.entity.buildingManager.buildings.length; i++) {
                    const ent = dEntity.entity.buildingManager.getBuildingTail(dEntity.entity.buildingManager.buildings[i]);
                    if (ent != null)
                        this.initEntity(ent, "building");
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    initEntity(entity, type) {
        const de = new DeleteEntity(type, entity);
        entity.action |= Action_1.Action.DELETE;
        this.deleteQuery.push(de);
    }
}
exports.WorldDeleter = WorldDeleter;
class DeleteEntity {
    entity;
    type;
    constructor(type, entity) {
        this.type = type;
        this.entity = entity;
    }
}
exports.DeleteEntity = DeleteEntity;