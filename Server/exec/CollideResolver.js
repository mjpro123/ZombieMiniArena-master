"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollideResult = void 0;
class CollideResult {
    collidesWith;
    newPos;
    dist;
    constructor(collidesWith, newPos, dist) {
        console.log(collidesWith, 'hi2')
        this.collidesWith = collidesWith;
        this.newPos = newPos;
        this.dist = dist;
    }
}
exports.CollideResult = CollideResult;