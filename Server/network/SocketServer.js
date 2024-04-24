"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const ws_1 = require("ws");
const Logger_1 = require("../logs/Logger");
const devconfig_json_1 = __importDefault(require("../staticSettings/devconfig.json"));
const ConnectionPlayer_1 = require("./ConnectionPlayer");
const EncodeUtils_1 = require("./EncodeUtils");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const PacketType_1 = require("../enums/PacketType")
let logsCoung = 0;
let logLast = performance.now();
class SocketServer {
    gameServer;
    server;
    lastConnectionLoopReset = -1;
    connectionAmount = 0;
    activeWebSockets = 0;
    serverElapsedAt = performance.now();
    ipAdress = [];
    constructor(gameServer) {
        this.gameServer = gameServer;
        this.server = new ws_1.WebSocketServer({
            port: devconfig_json_1.default.websocket_port,
            host: '0.0.0.0'
        });
        this.server.addListener('connection', (_socket, request) => {
            let otherIp = request.headers['x-forwarded-for']?.toString() || request.connection.localAddress || "";
            let ip = request.headers["cf-connecting-ip"]?.toString() || otherIp;
            _socket.binaryType = "arraybuffer";
            const now = performance.now();
            if (now - this.lastConnectionLoopReset > serverconfig_json_1.default.protection.throttleDelay) {
                this.lastConnectionLoopReset = now;
                this.connectionAmount = 0;
            }
            if (this.isNodeConnection(request.headers, request.rawHeaders))
                return _socket.close(1000);

            if (this.gameServer.globalAnalyzer.isBlackListed(ip)) {
                _socket.send(JSON.stringify(([PacketType_1.ServerPacketTypeJson.AlertMessage, 'You are banned from this server!'])))
                return _socket.close(1000)
            }

            const connectionPlayer = new ConnectionPlayer_1.ConnectionPlayer(this.gameServer, _socket, request);
            this.connectionAmount++;
            this.activeWebSockets += 1;
            _socket.on("message", (msg) => {
                try {
                    const buffer = Buffer.from(msg);
                    const write = `[${buffer}]`
                    const array = JSON.parse(write)
                    const packetData = JSON.parse(EncodeUtils_1.Encoder.decode(array))
                    if (connectionPlayer.packetCounter < 1) {
                        connectionPlayer.receiveOurBinary(packetData);
                    }
                    else {
                        connectionPlayer.onPacketReceived(packetData);
                    }

                }
                catch (e) {
                    if (performance.now() - logLast > 1000) {
                        logsCoung = 0;
                    }
                    if (logsCoung <= 5) {
                        logsCoung += 1;
                        if (connectionPlayer.sourcePlayer != null) {
                        }
                        else {
                        }
                    }
                }
            });
            _socket.on('close', () => {
                this.activeWebSockets -= 1;
            });
            _socket.on('error', () => {
                this.activeWebSockets -= 1;
            });
        });
        Logger_1.Loggers.app.info("Running socket cheap on::{0}", devconfig_json_1.default.websocket_port);
    }
    isNodeConnection(headers, rawHeaders) {
        if (!headers.origin || !headers['user-agent'] || !rawHeaders[13])
            return true;
        if (rawHeaders[13] == "http://sushi.v2008.coreserver.jp" || rawHeaders[13] == "http://sushi.v2008.coreserver.jp" || rawHeaders[13] == "https://coldd.fun" || rawHeaders[13] == "https://sushi.v2008.coreserver.jp/" || rawHeaders[13] == "http://sushi.v2008.coreserver.jp/" || rawHeaders[13] == "http://localhost" || rawHeaders[13] == "https://localhost:80")
            return false;
        return false;
    }
}
exports.SocketServer = SocketServer;