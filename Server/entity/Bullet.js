"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
const Entity_1 = require("./Entity");
const Player_1 = require("./Player");
const Action_1 = require("../enums/Action");
const itemsmanager_1 = require("../utils/itemsmanager");
const { Utils } = require("../utils/Utils");
const { MapObject } = require("./MapObject");
const { ItemIds } = require("../enums/ItemIds");
const { EntityType } = require("../enums/EntityType");
const e = require("express");
class Bullet extends Entity_1.Entity {
    asItem;
    createdAt;
    arrow;
    owner;
    velocity = {
        x: 1,
        y: 1
    };
    constructor(id, playerId, gameServer, asItem, owner, start, type) {
        super(id, playerId, gameServer);
        this.asItem = asItem;
        this.createdAt = performance.now();
        this.arrow = itemsmanager_1.ItemUtils.getItemById(asItem);
        this.metaType = itemsmanager_1.ItemType.ARROW
        this.owner = owner;
        this.start = start
        this.info = owner.x - (owner.x & 0xf) + type;
        this.extra = owner.y - (owner.y & 1);
        this.speed = 0;
        this.acceleration = 2;
        this.living_time = this.arrow.id == ItemIds.STONE_ARROW ? 15000 : 5000
        this.distance = this.arrow.id == ItemIds.STONE_ARROW ? 5000 : 1000
        this.last_roof = performance.now();
    }
    onDeadEvent() {
        this.health = 0;
        this.updateHealth(null);
        this.gameServer.removeEntity(this)
    }

    onEntityUpdate() {
        const now = performance.now()

        if (now - this.createdAt > this.living_time) {
            this.onDeadEvent()
            return;
        }

        if (Utils.distanceSqrt(this.x, this.y, this.start.x + 2, this.start.y + 2) > this.distance) {
            this.onDeadEvent()
            return;
        }

        if (Math.floor(this.x / 100) >= 99 || Math.floor(this.x / 100) <= 0 || Math.floor(this.y / 100) >= 99 || Math.floor(this.y / 100) <= 0) {
            this.onDeadEvent()
            return;
        }

        const angle = ((this.angle / 255) * 360) * (Math.PI / 180) + (Math.PI / 2)
        const radius = this.arrow.id == ItemIds.STONE_ARROW ? 80 : this.radius;

        if (this.speed < this.max_speed) {
            this.speed = Math.min(this.speed + this.max_speed / this.acceleration, this.max_speed);
        }

        this.x = this.x + Math.cos(angle) * Math.round(this.speed);
        this.y = this.y + Math.sin(angle) * Math.round(this.speed);

        const query = this.gameServer.queryManager.queryCircle(this.x, this.y, radius + 5);

        if (this.arrow.id == ItemIds.STONE_ARROW) {
            for (let i = 0; i < query.length; i++) {
                const entity = query[i];
                if (entity instanceof Player_1.Player) {
                    if (entity.id != this.owner.id) {
                        if (entity.isFly == this.owner.isFly) {
                            entity.receiveHit(entity, this.arrow.data.damage)
                            this.onDeadEvent()
                            break;
                        }
                    }
                }
            }
        } else
            for (let i = 0; i < query.length; i++) {
                const entity = query[i];
                const distance = entity.isSolid ? 1000 : Utils.distanceSqrt(entity.x, entity.y, this.start.x + 2, this.start.y + 2)
                if (Utils.isBuilding(entity)) {
                    if (distance > 150 && entity.type != EntityType.BRIDGE) {
                        if (!this.owner.isFly && entity.type != EntityType.WOOD_TOWER && entity.meta_type != itemsmanager_1.ItemMetaType.PLANT) {
                            if (this.owner.stateManager.isInTower) {
                                if (entity.type == EntityType.ROOF) {
                                    entity.receiveHit(entity, this.arrow.data.building_damage);
                                    this.onDeadEvent();
                                    break;
                                }
                            } else {
                                if (this.owner.stateManager.isInRoof && entity.type == EntityType.ROOF && performance.now() - this.last_roof < 400) {
                                    this.last_roof = performance.now()
                                } else {
                                    entity.receiveHit(entity, this.arrow.data.building_damage);
                                    this.onDeadEvent();
                                    break;
                                }
                            }
                        }
                    }
                }

                if (Utils.isMob(entity)) {
                    if (!this.owner.isFly) {
                        entity.health -= this.arrow.data.damage*5;
                        entity.receiveHit(this)
                        this.onDeadEvent()
                        break;
                    }
                }

                if (entity instanceof Player_1.Player) {
                    if (entity.id != this.owner.id && !entity.ghost) {
                        if (entity.isFly == this.owner.isFly) {
                            if (Utils.distanceSqrt(entity.x, entity.y, this.start.x + 2, this.start.y + 2) > 120) {
                                let weapon = itemsmanager_1.ItemUtils.getItemById(entity.right)
                                let damage = this.arrow.data.damage;
                                if (itemsmanager_1.ItemUtils.isShield(weapon)) {
                                    if (Utils.OpposingAngle(this.angle, entity.angle)) {
                                        damage = damage - weapon.data.protection * 3
                                    }
                                }
                                this.onDeadEvent()
                                entity.receiveHit(this.owner, damage ?? 0, true)
                                break;
                            }
                        }
                    }
                }


                if (entity instanceof MapObject) {
                    if (!this.owner.isFly) {
                        if (this.owner.stateManager.isInTower) {
                            if (entity.raw_type != `temp_off`) {
                                entity.receiveHit(this.owner, true)
                                this.onDeadEvent()
                                break;
                            }
                        } else {
                            entity.receiveHit(this.owner, true)
                            this.onDeadEvent()
                            break;
                        }
                    }
                }

            }
    }
}
exports.Bullet = Bullet;