"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStringPackets = void 0;
var ClientStringPackets;
(function (ClientStringPackets) {
    ClientStringPackets[ClientStringPackets["CHAT"] = 0] = "CHAT";
    ClientStringPackets[ClientStringPackets["KICK"] = 1] = "KICK";
    ClientStringPackets[ClientStringPackets["NEW_PLAYER"] = 2] = "NEW_PLAYER";
    ClientStringPackets[ClientStringPackets["HANDSHAKE"] = 3] = "HANDSHAKE";
    ClientStringPackets[ClientStringPackets["MESSAGE"] = 4] = "MESSAGE";
    ClientStringPackets[ClientStringPackets["COMMAND"] = 5] = "COMMAND";
    ClientStringPackets[ClientStringPackets["WELCOME"] = 6] = "WELCOME";
})(ClientStringPackets || (exports.ClientStringPackets = ClientStringPackets = {}));