"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrow = void 0;
const Entity_1 = require("./Entity");
const EntityType_1 = require("../enums/types/EntityType");
class Arrow extends Entity_1.Entity {
    owner;
    constructor(server, owner, type) {
        super(EntityType_1.EntityType.SPELL, server);
        this.info = 0xf;
        this.extra = 0;
        this.id = this.server.entityPool.createId();
        this.owner = owner;
        this.angle = owner.angle;
        this.position.set(owner.realPosition);
        this.realPosition.set(this.position);
        this.server.entities.push(this);
    }
}
exports.Arrow = Arrow;