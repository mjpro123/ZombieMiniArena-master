"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const EntityType_1 = require("../enums/EntityType");
const Vector_1 = require("./Vector");
const ItemType_1 = require("../enums/ItemType");
const Building_1 = require("../entity/Building");
const BinaryWriter_1 = require("./BinaryWriter");
const ClientPackets_1 = require("../enums/packets/ClientPackets.js");
const ClientStringPackets_1 = require("../enums/packets/ClientStringPackets");
class Utils {
    static arrows = [
        ItemType_1.ItemType.DRAGON_ARROW, ItemType_1.ItemType.REIDITE_ARROW, ItemType_1.ItemType.AMETHYST_ARROW, ItemType_1.ItemType.DIAMOND_ARROW,
        ItemType_1.ItemType.GOLD_ARROW, ItemType_1.ItemType.STONE_ARROW, ItemType_1.ItemType.WOOD_ARROW
    ];
    static bows = [
        ItemType_1.ItemType.DRAGON_BOW, ItemType_1.ItemType.REIDITE_BOW, ItemType_1.ItemType.AMETHYST_BOW, ItemType_1.ItemType.DIAMOND_BOW,
        ItemType_1.ItemType.GOLD_BOW, ItemType_1.ItemType.STONE_BOW, ItemType_1.ItemType.WOOD_BOW
    ];
    static generateRandomString(length) {
        let response = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+-";
        for (let i = 0; i < length; i++) {
            response += characters[~~(Math.random() * characters.length)];
        }
        return response;
    }
    static convertRecipe(r) {
        r.id = ItemType_1.ItemType[r.item.toUpperCase()];
        r.r = r.recipe.map((rec) => [ItemType_1.ItemType[rec[0].toUpperCase()], rec[1]]);
        delete r.item;
        delete r.recipe;
        return r;
    }
    static getAngleDifference(angle1, angle2) {
        let max = Math.PI * 2;
        let diff = (angle2 - angle1) % max;
        return Math.abs(2 * diff % max - diff);
    }
    static getTarget(self, entities, distance = Infinity) {
        let minDist = Infinity;
        let target = null;
        for (const entity of entities) {
            if (entity === self)
                continue;
            const dist = self.realPosition.distance(entity.realPosition);
            if (dist < minDist && dist < distance)
                target = entity;
        }
        return target;
    }
    static getBuildings(entities) {
        let arr = [];
        for (const entity of entities) {
            if (entity && !(entity instanceof Building_1.Building))
                continue;
            arr.push(entity);
        }
        return arr;
    }
    static getArrowType(player) {
        for (let i = 0; i < Utils.bows.length; i++) {
            const bow = Utils.bows[i];
            if (player.right.id === bow) {
                for (let j = i; j < Utils.arrows.length; j++) {
                    if (player.inventory.containsItem(Utils.arrows[j])) {
                        return [Utils.getSpell(Utils.arrows[j]), Utils.arrows[j]];
                    }
                }
            }
        }
        return -1;
    }
    static getSpell(bulletId) {
        switch (bulletId) {
            case ItemType_1.ItemType.WOOD_ARROW: return 2;
            case ItemType_1.ItemType.STONE_ARROW: return 3;
            case ItemType_1.ItemType.GOLD_ARROW: return 4;
            case ItemType_1.ItemType.DIAMOND_ARROW: return 5;
            case ItemType_1.ItemType.AMETHYST_ARROW: return 6;
            case ItemType_1.ItemType.REIDITE_ARROW: return 7;
            case ItemType_1.ItemType.DRAGON_ARROW: return 8;
            default:
                return -1;
        }
    }
    static convertUintToAngle(angle) {
        return (((angle / 255) * Math.PI) * 2) + Math.PI / 2;
    }
    static distanceSqrt(v1, v2) {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
    static getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    static isCirclesCollides(center1, radius1, center2, radius2) {
        const distance = center1.distance(center2);
        return distance <= radius1 + radius2;
    }
    // @ts-ignore
    static getTreasure(chances, iteration = 0) {
        const randomValue = Math.random_clamp(0, 100);
        let current = 0;
        for (let i = 0; i < chances.length; i++) {
            const chance = chances[i];
            if (chance === 0)
                continue;
            if (current < randomValue && randomValue < current + chance) {
                return i;
            }
            current += chance;
        }
        if (iteration > 10)
            return ItemType_1.ItemType.WOOD;
        return Utils.getTreasure(chances, iteration++);
    }
    static getShovelTreasure(chances) {
        const randomValue = Math.random_clamp(0, 100);
        let current = 0;
        for (let i = 0; i < chances.length; i++) {
            const chance = chances[i];
            if (current < randomValue && randomValue < current + chance) {
                return i;
            }
            current += chance;
        }
        return -1;
    }
    static getOffsetVector(v, distanceToMove, angle) {
        return v.add(new Vector_1.Vector(distanceToMove * Math.cos((angle / 255) * (Math.PI * 2)), distanceToMove * Math.sin((angle / 255) * (Math.PI * 2))));
    }
    static getItemInStorage(type) {
        switch (type) {
            case EntityType_1.EntityType.STONE_EXTRACTOR: return ItemType_1.ItemType.STONE;
            case EntityType_1.EntityType.GOLD_EXTRACTOR: return ItemType_1.ItemType.GOLD;
            case EntityType_1.EntityType.DIAMOND_EXTRACTOR: return ItemType_1.ItemType.DIAMOND;
            case EntityType_1.EntityType.AMETHYST_EXTRACTOR: return ItemType_1.ItemType.AMETHYST;
            case EntityType_1.EntityType.REIDITE_EXTRACTOR: return ItemType_1.ItemType.REIDITE;
            default: return -1;
        }
    }
    /* Packets */
    static serializeAccountToBuffer(p) {
        const writer = new BinaryWriter_1.BinaryWriter(7);
        writer.writeUInt8(ClientPackets_1.ClientPackets.VERIFIED_ACCOUNT, p.id);
        writer.writeUInt8(p.id, p.id);
        writer.writeUInt8(p.cosmetics.skin, p.id);
        writer.writeUInt8(p.cosmetics.accessory, p.id);
        writer.writeUInt8(p.cosmetics.bag, p.id);
        writer.writeUInt8(p.cosmetics.book, p.id);
        writer.writeUInt8(p.data.level, p.id);
        return writer.toBuffer();
    }
    static serializeCosmeticsToJSON(p) {
        return JSON.stringify([
            ClientStringPackets_1.ClientStringPackets.NEW_PLAYER,
            p.id,
            p.data.nickname,
            p.data.level,
            p.cosmetics.skin,
            p.cosmetics.accessory,
            p.cosmetics.bag,
            p.cosmetics.book
        ]);
    }
    static levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const dp = [];
        for (let i = 0; i <= len1; i++) {
            dp[i] = [];
            for (let j = 0; j <= len2; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                }
                else if (j === 0) {
                    dp[i][j] = i;
                }
                else {
                    const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    dp[i][j] = Math.min(dp[i - 1][j - 1] + substitutionCost, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
                }
            }
        }
        return dp[len1][len2];
    }
}
exports.Utils = Utils;