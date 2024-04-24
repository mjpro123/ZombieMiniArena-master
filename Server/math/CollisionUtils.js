"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionUtils = void 0;
const EntityType_1 = require("../enums/EntityType");
const Utils_1 = require("../utils/Utils");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class CollisionUtils {
    static scheduleCollision(entity) {
        if (entity.type != EntityType_1.EntityType.PLAYERS) return;
        const queryEntities = entity.gameServer.queryManager.queryCircle(entity.x, entity.y, entity.radius), candidateEntities = [], overlappingEntities = [];
        let resolvePosition;
        for (let i = 0; i < queryEntities.length; i++) {
            const candidate = queryEntities[i];
            if (candidate.id == entity.id || !candidate.isSolid && !entity.isFly || entity.noclip) continue;
            if (Utils_1.Utils.isBuilding(candidate)) if (!entity.isFly || entity.noclip) candidate.ownerClass.onCollides(entity);
            resolvePosition = CollisionUtils.resolveCollision(entity, candidate);
            candidateEntities.push(candidate);
        }
        for (let i = 0; i < candidateEntities.length; i++) {
            const elemtIn = overlappingEntities.find((e) => e.x == candidateEntities[i].x && e.y == candidateEntities[i].y);
            if (elemtIn != null) continue;
            overlappingEntities.push(candidateEntities[i]);
        }
        if (overlappingEntities.length == 1) {
            if (!entity.isFly || entity.noclip) {
                entity.x = resolvePosition.x;
                entity.y = resolvePosition.y;
            }
            entity.ownerClass.ISF = true;
        }
        else if (overlappingEntities.length >= 2) {
            if (!entity.isFly || entity.noclip) {
                entity.x = entity.oldX;
                entity.y = entity.oldY;
            }
            entity.ownerClass.ISF = true;
        }
        else {
            entity.ownerClass.ISF = false;
        }

        if (!entity.isFly || entity.noclip) entity.collideCounter = overlappingEntities.length;
        if (overlappingEntities.length > 0)
            if ((!entity.isFly || entity.noclip) && entity.ownerClass.ISF) entity.old_speed = serverconfig_json_1.default.entities.player.speed_collides / entity.collideCounter;
    }
    static getAngularVelocity(radius, velocity) {
        return (radius * velocity) / (radius * radius);
    }
    static resolveCollision(entity, candidate) {
        const velocity = CollisionUtils.getAngularVelocity(candidate.radius + entity.radius, entity.speed);
        let oldAngle = Math.atan2(entity.oldY - candidate.y, entity.oldX - candidate.x);
        let angle = Math.atan2(entity.y - candidate.y, entity.x - candidate.x);
        let diff = oldAngle - angle;
        if (diff > 1) return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle + velocity, entity.radius + candidate.radius);
        else if (diff < -1) return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle - velocity, entity.radius + candidate.radius);
        if (diff > 0) return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle - velocity, entity.radius + candidate.radius);
        else if (diff < 0) return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle + velocity, entity.radius + candidate.radius);
        if (diff == 0) return Utils_1.Utils.getPointOnCircle(candidate.x, candidate.y, oldAngle - velocity, entity.radius + candidate.radius);
        else return { x: entity.x, y: entity.y };
    }
}
exports.CollisionUtils = CollisionUtils;