"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DupeDetector = void 0;
const { Utils } = require("../utils/Utils");
const itemsmanager_1 = require("../utils/itemsmanager")
const DiscordBot = require("./booster")

class DupeDetector {
    GameServer;
    DiscordBot;
    ItemToCheck = ["COOKIE", "SWORD_DIAMOND", "DIAMOND_HELMET", "CHRISTMAS_HAT","CROWN_BLUE"]
    IdChecks = [127, 6, 27, 41, 79]
    PreviousPlayers;
    ChestId = 194;

    constructor(GameServer, DiscordBot) {
        this.GameServer = GameServer;
        this.DiscordBot = DiscordBot;
        this.PreviousPlayers = this.GameServer.players;
    }

    DetectDrop(loot, dropper, taker, type) {
        if (type == "Drop"){
                if (Utils.isAdmin(dropper))
                return;
            let cancel = true;
            if (!loot || !loot[0] || !loot[0][0] || !loot[0][1]) {
                return;
            }
            for (let i = 0; i < this.IdChecks.length; i++) {
                if(this.IdChecks[i] == loot[0][0]){
                    cancel = false;
                }
            }
            if (cancel)
                return;
            let dropped = itemsmanager_1.ItemUtils.getItemById(loot[0][0])
            if (!dropped)
                return;
            let drop = dropped.name
            let Message = `${dropper.gameProfile.name} | ${dropper.id} Has dropped ${loot[0][1]} ${drop} to ${taker.gameProfile.name} | ${taker.id}` 
            let title = loot[0][1] > 1 ? "HIGHLY SUSPICIOUS" : "SUSPICIOUS ACTIVITY";
            let color = loot[0][1] > 1 ? "FF0000" : "FFFF00"
            let embed = {
                title: title,
                desc: Message,
                color: color,
                ping: (loot[0][1] > 1)
            }
            DiscordBot.DiscordBot._send("982273570447183912", "982302128808816660", embed, true)
        }
    }

    DetectChest(chest, put) {

    }

    DupeAnalyzer() {
        this.GameServer.players.forEach(player => {
            this.PreviousPlayers.forEach(prevPlayer => {
                //console.log(prevPlayer.gameProfile.token, player.gameProfile.token)
            })
        })
    }
}

exports.DupeDetector = DupeDetector;