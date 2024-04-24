"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IHandshake = void 0;
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
class IHandshake {
    name;
    token;
    token_id;
    sw;
    sh;
    version;
    skin;
    constructor(name, token, token_id, sw, sh, version, skin) {
        this.name = name === "" ? `unnnamed#${Math.floor(Math.random() * 1001)}` : name;
        if (this.name.length > 200)
            this.name = "clown";
        if (this.name.length > 16)
            this.name = this.name.slice(16, this.name.length);
        this.token = token;
        this.token_id = token_id;
        this.skin = skin;
        this.sw = Math.min(serverconfig_json_1.default.viewport.width_max, Math.max(0, sw));
        this.sh = Math.min(serverconfig_json_1.default.viewport.height_max, Math.max(0, sh));
        this.version = 17;
    }
}
exports.IHandshake = IHandshake;