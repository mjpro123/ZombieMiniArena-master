"use strict";

const { ItemIds } = require("../enums/ItemIds");

Object.defineProperty(exports, "__esModule", { value: true });
exports.GameProfile = exports.Badges = void 0;
var Badges;
(function (Badges) {
    Badges[Badges["Developer"] = 2] = "Developer";
    Badges[Badges["YouTuber"] = 4] = "YouTuber";
    Badges[Badges["Tester"] = 8] = "Tester";
})(Badges || (exports.Badges = Badges = {}));
class GameProfile {
    name;
    skin;
    accessory;
    book;
    box;
    baglook;
    level;
    badges;
    deadBox;
    score;
    days;
    surviveStart;
    token;
    token_id;
    kills;
    googleToken;
    bounty;
    constructor(name, skin, accessory, box, baglook, level, badges, deadBox, days, score, book, surviveStart, token, token_id, google = 0) {
        this.name = name;
        this.skin = skin;
        this.accessory = accessory;
        this.box = box;
        this.book = book;
        this.baglook = baglook;
        this.deadBox = deadBox;
        this.badges = badges;
        this.level = level;
        this.score = score;
        this.days = days;
        this.surviveStart = surviveStart;
        this.token = token;
        this.token_id = token_id;
        this.kills = 0;
        this.googleToken = google;
        this.bounty = [[ItemIds.FIREFLY, 0]];
    }
}
exports.GameProfile = GameProfile;
