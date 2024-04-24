"use strict";
var __importDefault = this && this.__importDefault || function (e) {
    return e && e.__esModule ? e : {
        default: e
    }
};
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.EventManager = void 0;
const fs_1 = __importDefault(require("fs")),
    EventUtils_1 = require("./EventUtils"),
    Logger_1 = require("../logs/Logger"),
    EventErrorLogger_1 = require("./EventErrorLogger"),
    Event_1 = require("./Event");
class EventManager {
    gameServer;
    events;
    dirStat;
    constructor(e, t) {
        this.gameServer = e;
        this.events = [];
        this.dirStat = t;
        this.updateConfig()
    }
    loop() {
        const e = performance.now();
        for (let t = 0; t < this.events.length; t++) this.events[t].type == Event_1.EventType.INTERVAL && this.events[t].update(e)
    }
    onKill(e, t) {
        const r = performance.now(),
            n = this.events.filter((e => e.type == Event_1.EventType.KILL));
        for (let o = 0; o < n.length; o++) {
            n[o].update(r, {
                killer: e,
                killed: t
            })
        }
    }
    updateConfig() {
        const e = fs_1.default.readFileSync(this.dirStat + "/settings/events.json"),
            t = JSON.parse(e);
        for (let e = 0; e < t.length; e++) {
            const r = t[e],
                n = r.name,
                o = Event_1.EventType[r.type.toUpperCase()];
            if (!o) {
                (0, EventErrorLogger_1.constructError)(EventErrorLogger_1.EventErrors.NODE_NOT_FOUND, n, `EventType with ${r.type} not Found`);
                return
            }
            const s = (0, EventUtils_1.getNodeParams)(r.params),
                i = [];
            for (let e = 0; e < s.length; e++) {
                const t = s[e].split(" ")[0],
                    r = s[e].split(" ")[1];
                if (!t || !r) {
                    (0, EventErrorLogger_1.constructError)(EventErrorLogger_1.EventErrors.PARAMS_PARSE_FAIL, n, `Params Iterate Error at ${e}`, "Your params has invalid index");
                    return
                }
                i.push([t, r])
            }
            const a = r.condition,
                g = r.commands;
            Logger_1.Loggers.game.info("--------------");
            Logger_1.Loggers.game.warn(`Event ${r.name} is Initialized!`);
            Logger_1.Loggers.game.info("--------------");
            this.events.push(new Event_1.Event(n, o, i, a, g, this))
        }
    }
}
exports.EventManager = EventManager;