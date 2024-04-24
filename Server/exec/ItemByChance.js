"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemByChance = void 0;
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const ItemIds_1 = require("../enums/ItemIds");
const Chances = {
    DEFAULT: [40, 99],
    COMMON: [4, 40],
    RARE: [2, 3],
    SUPER_RARE: [1, 1]
};
function genRandomNumber(size) {
    return (1 + Math.floor(Math.random() * size));
}
function getItemByChance(player) {
    let chanceProballity = genRandomNumber(98);
    if (player.hat == ItemIds_1.ItemIds.CROWN_ORANGE) {
        let toDecrease = genRandomNumber(10);
        chanceProballity = Math.max(1, (chanceProballity - toDecrease));
    }
    let itemsPriority = serverconfig_json_1.default.items_priority;
    for (const priority in itemsPriority) {
        let chanceByPriority = Chances[priority.toUpperCase()];
        if (chanceProballity >= chanceByPriority[0] && chanceProballity <= chanceByPriority[1]) {
            let itemsByPriority = itemsPriority[priority];
            return itemsByPriority[Math.floor(Math.random() * itemsByPriority.length)];
        }
    }
}

function GiftItem(arr) {
    let totalLuck = arr.reduce((acc, item) => acc + item[2], 0);
    let randomNum = Math.random() * totalLuck;
    let cumulativeLuck = 0;

    for (let i = 0; i < arr.length; i++) {
        cumulativeLuck += arr[i][2];
        if (randomNum < cumulativeLuck) {
            return arr[i];
        }
    }
}

function TamingChance(damager) {
    const crownTamingChance = serverconfig_json_1.default.entities.baby_dragon.crown_taming_chance;
    const tamingChance = serverconfig_json_1.default.entities.baby_dragon.taming_chance;
    const chance = damager.hat === ItemIds_1.ItemIds.CROWN_ORANGE ? crownTamingChance : tamingChance;

    return chance / 100;
}


exports.GiftItem = GiftItem;
exports.getItemByChance = getItemByChance;
exports.TamingChance = TamingChance