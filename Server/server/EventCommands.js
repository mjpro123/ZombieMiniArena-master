"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.executeCommand = void 0;
const ItemIds_1 = require("../enums/ItemIds"),
    PacketType_1 = require("../enums/PacketType"),
    Logger_1 = require("../logs/Logger"),
    ConsoleManager_1 = require("../models/ConsoleManager");

function executeCommand(e, t) {
    const o = (e = e.split(" "))[0].toLowerCase(),
        r = e.slice(1);
    let s = null;
    switch (o) {
        case "say":
        case "bc": {
            let e = "";
            for (let t = 0; t < r.length; t++) e += r[t] + " ";
            e.length > 0 && t.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, e]);
            break
        }
        case "give":
        case "g": {
            const e = ItemIds_1.ItemIds[r[0].toUpperCase()];
            if (!e) {
                Logger_1.Loggers.game.info(`Kill Resolve Event, item not found with name ${r[0]}`);
                return
            }
            let o = r.length > 1 ? r[1] : 1;
            isNaN(o) && (o = 1);
            o >= 6e4 && (o = 6e4);
            if (r.length > 2) {
                let e = (0, ConsoleManager_1.findPlayerByIdOrName)(r[2], t);
                if (!e) return;
                s = e
            }
            s.inventory.addItem(e, o);
            break
        }
    }
}
exports.executeCommand = executeCommand;