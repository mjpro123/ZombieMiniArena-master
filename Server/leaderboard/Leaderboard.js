"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardL = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class LeaderboardL {
    leaderboard;
    gameServer;
    constructor(gameServer) {
        this.gameServer = gameServer;
        this.leaderboard = [];
        this.init();
    }
    init() {
        this.leaderboard = JSON.parse(data);
    }
    writeLb(data, range = 0) {
        this.leaderboard[range].push(data);
        this.sortLb(range);
        let leaderboard = this.leaderboard[range];
        if (leaderboard.length > 200) {
            this.leaderboard[range].splice(leaderboard.length - 1, 1);
        }
    }
    sortLb(range) {
        this.leaderboard[range].sort((p1, p2) => p2.score - p1.score);
    }
    toJson(range = 0) {
        return JSON.stringify(this.leaderboard[range]);
    }
}
exports.LeaderboardL = LeaderboardL;
