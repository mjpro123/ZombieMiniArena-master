"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.Event = exports.EventType = void 0;
const EventCommands_1 = require("./EventCommands");
var EventType;
! function (e) {
    e.INTERVAL = "INTERVAL";
    e.KILL = "KILL";
    e.SCORE = "SCORE";
    e.CRAFT = "CRAFT";
    e.NEW_PLAYER = "NEW_PLAYER";
    e.PLAYER_DIED = "PLAYER_DIED";
    e.INVENTORY_OBTAIN = "INVENTORY_OPENED";
    e.PLAYER_TEXT = "PLAYER_TEXT"
}(EventType = exports.EventType || (exports.EventType = {}));
class Event {
    name;
    type;
    params;
    condition;
    commands;
    eventManager;
    inst;
    constructor(e, t, s, n, a, i) {
        this.type = t;
        this.name = e;
        this.params = s;
        this.eventManager = i;
        this.condition = n;
        this.commands = a;
        this.inst = this;
        this.resolveType()
    }
    update(e, t = {}) {
        switch (this.type) {
            case EventType.INTERVAL:
                if (e - this.inst.lastInterval > this.inst.repeatTime)
                    for (let e = 0; e < this.commands.length; e++)(0, EventCommands_1.executeCommand)(this.commands[e], this.eventManager.gameServer);
                break;
            case EventType.KILL: {
                const e = t.killer,
                    s = this.params.find((e => "value" == e[0]));
                if (s && s[1] == e.gameProfile.kills && s[1] != e.gameProfile.kills) return;
                for (let t = 0; t < this.commands.length; t++) {
                    let s = this.commands[t];
                    s = s.replaceAll("{kills}", e.gameProfile.kills);
                    s = s.replaceAll("{player}", e.id);
                    s = s.replaceAll("{name}", e.gameProfile.name);
                    (0, EventCommands_1.executeCommand)(s, this.eventManager.gameServer)
                }
                break
            }
        }
    }
    resolveType() {
        switch (this.type) {
            case EventType.INTERVAL: {
                this.inst.lastInterval = performance.now();
                const e = this.params.find((e => "interval" == e[0]));
                this.inst.repeatTime = Number(e[1]);
                break
            }
        }
    }
}
exports.Event = Event;