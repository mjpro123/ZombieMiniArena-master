"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.DataAnalyzer = void 0;
const Logger_1 = require("../logs/Logger");
class DataAnalyzer {
    iConnection;
    constructor(e) {
        this.iConnection = e
    }
    analyzeRequest(e) {
        const t = this.iConnection.request,
            n = t.url?.split("/");
        if (n.length < 2) {
            this.iConnection.gameServer.globalAnalyzer.addToBlackList(this.iConnection.userIp);
            Logger_1.Loggers.game.info(`Banned Bot Attempt from ${this.iConnection.userIp} with name ${e}`);
            return !1
        }
        n[1];
        return !0
    }
}
exports.DataAnalyzer = DataAnalyzer;