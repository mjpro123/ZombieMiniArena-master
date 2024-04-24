"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldTicker = void 0;
const WorldEvents_1 = require("./WorldEvents");
class WorldTicker {
    gameServer;
    lastSurvivalUpdate = performance.now();
    lastSurvivalUpdate2 = performance.now();
    lastActionChange = performance.now();
    constructor(gameServer) {
        this.gameServer = gameServer;
    }
    gameUpdate() {
        this.gameServer.eventManager.loop();
        this.gameServer.worldDeleter.queryDelete();
        for (let i = 0; i < this.gameServer.livingEntities.length; i++)
            this.gameServer.livingEntities[i].update();
        for (const player of this.gameServer.players.values())
            player.syncUpdate();
        for (let i = 0; i < this.gameServer.livingEntities.length; i++)
            this.gameServer.livingEntities[i].updateBefore();
    }
    fixedUpdate() {
        const now = performance.now();
        if (now - this.lastSurvivalUpdate >= 4999) {
            for (const player of this.gameServer.players.values())
                player.survivalUpdate();
            WorldEvents_1.WorldEvents.sendLeaderboardUpdate(this.gameServer);
            this.lastSurvivalUpdate = now;
        }
        if (now - this.lastSurvivalUpdate2 >= 7999) {
            for (const player of this.gameServer.players.values())
                player.survivalUpdate2();
            this.lastSurvivalUpdate2 = now;
        }
        for (let i = 0; i < this.gameServer.staticEntities.length; i++) {
            this.gameServer.staticEntities[i].update();
        }
        this.gameServer.worldSpawner.spawnEntities();
        this.gameServer.worldCycle.update();
    }
}
exports.WorldTicker = WorldTicker;
