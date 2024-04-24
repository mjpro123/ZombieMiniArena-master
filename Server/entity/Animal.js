"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const EntityType_1 = require("../enums/EntityType");
const Utils_1 = require("../utils/Utils");
const Entity_1 = require("./Entity");
const Action_1 = require("../enums/Action");
const EntityUtils_1 = require("../utils/EntityUtils");
const Biomes_1 = require("../enums/Biomes");
const { ItemIds } = require("../enums/ItemIds");
const { Utils } = require("discord.js");
const { ItemMetaType } = require("../utils/itemsmanager");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class Animal extends Entity_1.Entity {
    lastMove = -1;
    lastStay = -1;
    stayCooldown = -1;
    lastInfoUpdate = -1;
    lastUpdate = -1;
    lastDestroy = -9999;
    target;
    isMobStay = false;
    HitStay = -9999;
    lastCollide = -1000;
    entitySettings;
    escape = false;
    old_x = 0;
    old_y = 0;
    factoryOf = "animal";
    constructor(id, gameServer) {
        super(id, 0, gameServer);
    }
    onEntityUpdate(now) {
        switch (this.type) {
            case EntityType_1.EntityType.KRAKEN: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }

            case EntityType_1.EntityType.BABY_DRAGON: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.target.entity.hat === 24 ? 0 : 35);
                    }
                }

                if (!this.firstTime) {
                    this.info = 0;
                    this.firstTime = !this.firstTime
                }

                if (isNaN(now - this.last_Hit) || now - this.last_Hit > 20000) {
                    this.info = 0;
                }
                break;
            }

        }
        if (this.isMobStay && now - this.lastMove > (this.target ? 220 : 1000)) {
            this.target = Utils_1.Utils.getNearestInRange(this, 250, true);
            if (this.target != null && this.target.entity != null && !this.target.entity.isFly && !this.target.entity.ghost) {
                if (this.type == EntityType_1.EntityType.BABY_DRAGON && this.info == 0) {
                    this.angle = Utils_1.Utils.randomMaxMin(0, 255);
                    this.lastStay = now;
                    this.isMobStay = false;

                    if (!this.isMobStay && now - this.lastStay > this.stayCooldown) {
                        this.stayCooldown = this.target ? 0 : Utils_1.Utils.randomMaxMin(0, 0);
                        if (this.type == EntityType_1.EntityType.BABY_DRAGON) {
                            this.stayCooldown = this.target ? 200 : Utils_1.Utils.randomMaxMin(600, 1500)
                        }
                        this.isMobStay = true;
                        this.lastMove = now;
                    }

                    this.updateMovement();
                    return;
                }
                let entity = this.target.entity;
                let angleDiff = Utils_1.Utils.angleDiff(this.x, this.y, entity.x, entity.y);
                let correctAngle = ((angleDiff) - (this.type === EntityType_1.EntityType.RABBIT ? Math.PI / 2 : this.escape ? Math.PI / 2 : -Math.PI / 2));
                let wait_delay = 1000;
                this.angle = Utils_1.Utils.calculateAngle255(correctAngle);


                if (!entity.isFly) {
                    if (this.type == EntityType_1.EntityType.SPIDER) {
                        if (!entity.isStunned && this.target.dist < 140) {
                            if ((now - entity.lastStun > 5000 ? 1 : (now - entity.lastStun) / 5000) * Math.random() > 0.3) {
                                entity.isStunned = true;
                                entity.lastStun = now;
                                entity.action |= Action_1.Action.WEB;
                            }
                        }
                    }
                    if (this.type != EntityType_1.EntityType.RABBIT && now - entity.stateManager.lastAnimalsHit[this.type] > wait_delay && this.target.dist < 100) {
                        if (performance.now() - this.target.entity.stateManager.lastAnimalsHit[this.type] > 500) {
                            let damage = this.entitySettings.damage
                            let animal_protection = 0;

                            if (this.entitySettings.damage) {
                                if (ItemIds[entity.hat]) {
                                    for (const item of serverconfig_json_1.default.items) {
                                        if (item.name == ItemIds[entity.hat]) {
                                            animal_protection = item.data.animal_protection;
                                            break;
                                        }
                                    }

                                    if (animal_protection) {
                                        damage -= animal_protection;
                                        damage < 0 || damage == NaN ? damage = 0 : damage = damage;
                                    }
                                }
                            }
                            this.onAttack(now, animal_protection);
                        }
                    }
                }
            }
            else {
                //this.angle = Utils_1.Utils.randomMaxMin(0, 255);
                this.angle = Utils_1.Utils.RetrivedAngle(this)
            }
            this.lastStay = now;
            this.isMobStay = false;
        }
        if (!this.isMobStay && now - this.lastStay > this.stayCooldown) {
            this.stayCooldown = this.target ? 400 : Utils_1.Utils.randomMaxMin(0, 600);
            if (this.type == EntityType_1.EntityType.BABY_DRAGON) {
                this.stayCooldown = this.target ? 200 : Utils_1.Utils.randomMaxMin(600, 1500)
            }
            this.isMobStay = true;
            this.lastMove = now;
        }
        this.updateMovement();
    }
    ;
    onAttack(now, defense) {
        const entity = this.target.entity;
        const radius = this.type == EntityType_1.EntityType.BABY_DRAGON ? 30 :
            this.type == EntityType_1.EntityType.FOX ? 15 : 15

        if (!Utils_1.Utils.isCirclesCollides(this.x, this.y, entity.x, entity.y, this.radius, entity.radius + radius)) {
            return;
        }
        entity.receiveHit(this, entity.hat === 24 ? 0 : this.entitySettings.damage - (defense ?? 0));
        entity.stateManager.lastAnimalsHit[this.type] = now;
        this.HitStay = now;
    }
    updateMovement() {

        if (this.type == EntityType_1.EntityType.ALOE_VERA_MOB) {
            return;
        }

        if (performance.now() - this.lastCollide > 2500) {
            this.escape = false;
        }

        if (this.isMobStay || (this.target && Utils_1.Utils.distanceSqrt(this.x, this.y, this.target.entity.x, this.target.entity.y) < this.entitySettings.hitbox_size
            && !(this.type == EntityType_1.EntityType.BABY_DRAGON && this.info == 0))) {
            if (this.isMobStay || this.target && Utils_1.Utils.distanceSqrt(this.x, this.y, this.target.entity.x, this.target.entity.y) < this.entitySettings.hitbox_size)
                return;
        }
        if (
            this.type == EntityType_1.EntityType.SPIDER &&
            performance.now() - this.HitStay < 500
        ) {
            return;
        }

        let angle = Utils_1.Utils.referenceAngle(this.angle) + Math.PI / 2;
        let speed = this.speed

        switch (this.type) {
            case EntityType_1.EntityType.SPIDER:
                if (this.target) speed *= 1.3
                else speed *= 1.2
                break;
            case EntityType_1.EntityType.BABY_DRAGON:
                if (this.target) speed *= 1.4
                break;
            case EntityType_1.EntityType.FOX:
                if (this.target) speed *= 1.3
                else speed *= 1.2
                break;
        }


        let x = this.x + Math.cos(angle) * speed
        let y = this.y + Math.sin(angle) * speed

        let border = false;


        if (this.location) {
            for (let i = 0; i < this.location.length; i++) {
                switch (this.location[i].toLowerCase()) {
                    case 'forest':
                        if (Utils_1.Utils.isInForest({ x, y })) {
                            border = true;
                        }
                        break;

                    case 'cave':
                        if (Utils_1.Utils.isInWinter({ x, y })) {
                            border = true;
                        }
                        break;

                    case 'winter':
                        if (Utils_1.Utils.isInWinter({ x, y }, 1)) {
                            border = true;
                        }
                        break;
                }
            }
        }

        if (this.type == EntityType_1.EntityType.FOX || this.type == EntityType_1.EntityType.BABY_DRAGON) {
            border = true;
        }

        if (this.isCollides(x, y, this.entitySettings.hitbox_size - 15)) {
            border = false;
        }


        if (!border) {
            if (this.target && this.target.entity && (this.type == EntityType_1.EntityType.FOX || this.type == EntityType_1.EntityType.BEAR)) {
                let entity = this.target.entity;
                let angleDiff = Utils_1.Utils.angleDiff(this.x, this.y, entity.x, entity.y);
                let angle_ = ((angleDiff) - Math.PI / 2);
                this.angle = Utils_1.Utils.calculateAngle255(angle_);
                let x = this.x + Math.cos(angle) * speed
                let y = this.y + Math.sin(angle) * speed
                /*
                if(!Utils_1.Utils.isInWinter({x, y}, 1)){
                    return;
                }
                */
                if (!this.isCollides(x, y, this.entitySettings.hitbox_size - 15)) {
                    this.x = x;
                    this.y = y;
                    this.lastCollide = performance.now()
                    this.escape = true;
                }
            }
            return;
        }

        this.old_x = this.x;
        this.old_y = this.y;
        this.x = x;
        this.y = y;
    }
    onSpawn(x, y, angle, type) {
        this.initEntityData(x, y, angle, type, false);
        this.info = 1;
        this.entitySettings = (0, EntityUtils_1.getEntity)(type);
        this.old_x = x;
        this.old_y = y;
        switch (type) {
            case EntityType_1.EntityType.RABBIT:
                this.max_speed = 32;
                this.speed = this.max_speed;
                this.radius = 15;
                this.health = 60;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.WOLF:
                this.max_speed = 23;
                this.speed = this.max_speed;
                this.radius = 30;
                this.health = 300;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.SPIDER:
                this.max_speed = serverconfig_json_1.default.entities.spider.speed;
                this.speed = this.max_speed;
                this.radius = serverconfig_json_1.default.entities.spider.range;
                this.health = serverconfig_json_1.default.entities.spider.health;
                this.location = serverconfig_json_1.default.entities.spider.allowedBiomes
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.FOX:
                this.max_speed = serverconfig_json_1.default.entities.fox.speed;
                this.speed = this.max_speed;
                this.radius = serverconfig_json_1.default.entities.fox.range;
                this.health = serverconfig_json_1.default.entities.fox.health;
                this.location = serverconfig_json_1.default.entities.fox.allowedBiomes
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.BOAR:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 50;
                this.health = 600;
                this.old_health = this.health;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.KRAKEN:
                this.max_speed = 24;
                this.speed = this.max_speed;
                this.radius = 100;
                this.health = 8000;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.PIRANHA:
                this.max_speed = 30;
                this.speed = this.max_speed;
                this.radius = 29;
                this.health = 350;
                this.max_health = this.health;
                break;

            case EntityType_1.EntityType.BABY_DRAGON:
                this.max_speed = serverconfig_json_1.default.entities.baby_dragon.speed;
                this.speed = this.max_speed;
                this.radius = serverconfig_json_1.default.entities.baby_dragon.radius;
                this.health = serverconfig_json_1.default.entities.baby_dragon.health;
                this.max_health = this.health;
                this.location = ['WINTER']
                break;
        }
    }
}
exports.Animal = Animal;