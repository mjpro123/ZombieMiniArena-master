"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.analyzeIp = void 0;
const Logger_1 = require("../../logs/Logger"),
    IP_1 = require("./IP");

function analyzeIp(e, o, n) {
    const t = o.find((e => e.ip == n));
    if (t) {
        if (t.connectionCount > 10) {
            e.tempBlockList.push(n);
            Logger_1.Loggers.game.info(`[Global Analyzer Thread#${~~(59*Math.random())}]: Blocked attack attempt from Following ip: ${n} | #ee2 | ${t.connectionCount}`);
            const i = o.filter((e => e.ip != n));
            e.hashedIpsList = i
        } else if (performance.now() - t.connectionTimestamp > 3e3) {
            t.connectionTimestamp = performance.now();
            t.connectionCount = 0
        }
    } else e.hashedIpsList.push(new IP_1.IP(n))
}
exports.analyzeIp = analyzeIp;