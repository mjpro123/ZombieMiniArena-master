"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldSpawner = void 0;
const Animal_1 = require("../entity/Animal");
const EntityType_1 = require("../enums/EntityType");
const EntityUtils_1 = require("../utils/EntityUtils");
const Entity_1 = require("../entity/Entity");
const Utils_1 = require("../utils/Utils");
const { Biome } = require("./WorldBiomeResolver");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class WorldSpawner {
    spiders = 0;
    wolfs = 0;
    gifts = 0
    winter_wolfs = [0, 0]
    fishs = 0;
    rabbits = 0;
    boars = 0;
    treasure = 0;
    krakens = 0;
    aloe_vera = 0;
    baby_dragons = 0;
    dragons = 0;
    lastTreasureSpawned = -1;
    lastSpiderSpawned = -999999;
    lastBabyDragonSpawned = -999999;
    lastGiftSpawned = -999999;
    lastDragonSpawned = -999999;
    lastVeraSpawned = -99999;
    lastWinterWolfSpawned = [-999999, -999999];
    gameServer;
    constructor(gameServer) {
        this.gameServer = gameServer;
    }
    addAnimal(type) {
        const id = this.gameServer.entityPool.nextId();
        const entity = new Animal_1.Animal(id, this.gameServer);
        entity.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
        const pos = this.findFirstLocation();
        let x = pos != null ? pos[0] : 2500, y = pos != null ? pos[1] : 2500, angle = 0;
        entity.onSpawn(x, y, 0, type);
        entity.initOwner(entity);
        entity.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
        this.gameServer.initLivingEntity(entity);
    }
    addAnimalw(type, mod) {
        const id = this.gameServer.entityPool.nextId();
        const entity = new Animal_1.Animal(id, this.gameServer);
        entity.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
        let Biome = 'Forest';
        switch (type) {
            case EntityType_1.EntityType.SPIDER:
                this.lastSpiderSpawned = performance.now()
                Biome = this.gameServer.gameConfiguration.entities.spider.Location
                break;
            case EntityType_1.EntityType.BABY_DRAGON:
                this.lastBabyDragonSpawned = performance.now()
                Biome = this.gameServer.gameConfiguration.entities.baby_dragon.Location
                break;
            case EntityType_1.EntityType.DRAGON:
                this.lastDragonSpawned = performance.now()
                Biome = this.gameServer.gameConfiguration.entities.dragon.Location
                break;
            case EntityType_1.EntityType.FOX:
                this.lastWinterWolfSpawned[mod] = performance.now()
                Biome = this.gameServer.gameConfiguration.entities.fox.Location + mod
                entity.access = EntityType_1.EntityType.FOX + mod;
                entity.mod = mod;
                break;
        }

        const pos = this.findFirstLocation(Biome)
        let x = pos != null ? pos[0] : 2500, y = pos != null ? pos[1] : 2500, angle = 0;
        entity.onSpawn(x, y, 0, type);
        entity.initOwner(entity);
        entity.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
        this.gameServer.initLivingEntity(entity);
    }
    addTreasure() {
        const id = this.gameServer.entityPool.nextId();
        const entity = new Entity_1.Entity(id, 0, this.gameServer);
        const island = serverconfig_json_1.default.world.islands[~~(Math.random() * serverconfig_json_1.default.world.islands.length)];
        const x = Utils_1.Utils.randomMaxMin(island[0][0], island[1][0]);
        const y = Utils_1.Utils.randomMaxMin(island[0][1], island[1][1]);
        entity.x = x;
        entity.y = y;
        entity.type = EntityType_1.EntityType.TREASURE_CHEST;
        entity.isSolid = false;
        entity.radius = this.gameServer.gameConfiguration.entities.treasure_chest.radius;
        entity.health = this.gameServer.gameConfiguration.entities.treasure_chest.health;
        this.gameServer.initLivingEntity(entity);
        this.lastTreasureSpawned = performance.now();
    }
    addAloeVera() {
        const id = this.gameServer.entityPool.nextId();
        const entity = new Entity_1.Entity(id, 0, this.gameServer);
        const pos = this.findFirstLocation(this.gameServer.gameConfiguration.entities.aloe_vera_mob.biome)
        entity.x = pos[0];
        entity.y = pos[1];
        entity.type = EntityType_1.EntityType.ALOE_VERA_MOB;
        entity.isSolid = false;
        entity.health = 0;
        entity.radius = this.gameServer.gameConfiguration.entities.aloe_vera_mob.radius;
        this.gameServer.initLivingEntity(entity);
        this.lastVeraSpawned = performance.now();
    }
    AddGift() {
        const id = this.gameServer.entityPool.nextId()
        const pos = this.findFirstLocation()
        const entity = new Entity_1.Entity(id, 0, this.gameServer)
        entity.x = pos[0]
        entity.y = pos[1]
        entity.type = EntityType_1.EntityType.GIFT
        entity.isSolid = false;
        entity.health = 50;
        entity.radius = 30;
        this.gameServer.initLivingEntity(entity)
        this.lastGiftSpawned = performance.now()
    }
    spawnEntities() {
        if (this.fishs < this.gameServer.gameConfiguration.other.max_fishs) {
            this.addAnimal(EntityType_1.EntityType.PIRANHA);
            this.fishs++;
        }
        if (this.wolfs < this.gameServer.gameConfiguration.other.max_wolfs) {
            this.addAnimalw(EntityType_1.EntityType.WOLF);
            this.wolfs++;
        }
        if (this.baby_dragons < this.gameServer.gameConfiguration.other.max_baby_dragons && performance.now() - this.lastBabyDragonSpawned > 10000) {
            this.addAnimalw(EntityType_1.EntityType.BABY_DRAGON);
            this.baby_dragons++;
        }
        if (this.winter_wolfs[0] < this.gameServer.gameConfiguration.other.max_winter_wolfs[0] && performance.now() - this.lastWinterWolfSpawned[0] > 60000) {
            this.addAnimalw(EntityType_1.EntityType.FOX, 0);
            this.winter_wolfs[0]++;
        }
        if (this.winter_wolfs[1] < this.gameServer.gameConfiguration.other.max_winter_wolfs[1] && performance.now() - this.lastWinterWolfSpawned[1] > 60000) {
            this.addAnimalw(EntityType_1.EntityType.FOX, 1);
            this.winter_wolfs[1]++;
        }
        if (this.spiders < this.gameServer.gameConfiguration.other.max_spiders && performance.now() - this.lastSpiderSpawned > 300000) {
            this.addAnimalw(EntityType_1.EntityType.SPIDER);
            this.spiders++;
        }
        if (this.rabbits < this.gameServer.gameConfiguration.other.max_rabbits) {
            this.addAnimalw(EntityType_1.EntityType.RABBIT);
            this.rabbits++;
        }
        if (this.dragons < this.gameServer.gameConfiguration.other.max_dragons) {
            //this.addAnimalw(EntityType_1.EntityType.DRAGON);
            this.dragons++;
        }
        if (this.treasure < this.gameServer.gameConfiguration.other.max_treasure && performance.now() - this.lastTreasureSpawned > 100) {
            this.addTreasure();
            this.treasure++;
        }
        if (this.gifts < this.gameServer.gameConfiguration.other.max_gifts && performance.now() - this.lastGiftSpawned > 0) {
            this.AddGift()
            this.gifts++;
        }
        if (this.aloe_vera < this.gameServer.gameConfiguration.other.max_aloe_vera && performance.now() - this.lastVeraSpawned > 1000) {
            this.addAloeVera();
            this.aloe_vera++;
        }
    }
    findFirstLocation(biome) {
        let attempts = 0, locationState = false;
        let cx = 0;
        let cy = 0;
        while (attempts < 100 && locationState == false) {
            switch (biome?.toLowerCase()) {
                case 'forest':
                    cx = 1500 + ~~(Math.random() * (5100 - 1500));
                    cy = 1600 + ~~(Math.random() * (4400 - 1600));
                    break;

                case 'cave':
                    cx = 7200 + ~~(Math.random() * (8800 - 7200));
                    cy = 7700 + ~~(Math.random() * (9300 - 7700));
                    break;

                case 'winter0':
                    cx = 4500 + ~~(Math.random() * (5900 - 4500));
                    cy = 6300 + ~~(Math.random() * (8400 - 6300));
                    break;

                case 'winter1':
                    cx = 1800 + ~~(Math.random() * (100 - 1800));
                    cy = 4800 + ~~(Math.random() * (6100 - 4800));
                    break;

                case 'desert':
                    cx = 700 + ~~(Math.random() * (3700 - 700));
                    cy = 7500 + ~~(Math.random() * (9300 - 7500));
                    break;

                default:
                    cx = 1500 + ~~(Math.random() * (5100 - 1500));
                    cy = 1600 + ~~(Math.random() * (4400 - 1600));
                    break;
            }

            const queryBack = this.gameServer.queryManager.queryCircle(cx, cy, 80);
            if (queryBack.length == 0)
                locationState = true;
            else
                attempts++;
        }
        return attempts >= 100 ? null : [cx, cy];
    }
}
exports.WorldSpawner = WorldSpawner;