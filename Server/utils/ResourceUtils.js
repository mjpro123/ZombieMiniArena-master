"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.ResourceUtils = void 0;
const ItemIds_1 = require("../enums/ItemIds"),
    ObjectType_1 = require("../enums/ObjectType"),
    itemsmanager_1 = require("./itemsmanager");
class ResourceUtils {
    static getLimitResources(e, t = 0) {
        switch (e) {
            case ObjectType_1.ObjectType.TREE:
                return 2 == t ? 75 : 1 == t ? 60 : 45;
            case ObjectType_1.ObjectType.STONE:
                return 2 == t ? 50 : 1 == t ? 40 : 25;
            case ObjectType_1.ObjectType.GOLD:
                return 2 == t ? 40 : 1 == t ? 25 : 15;
            case ObjectType_1.ObjectType.DIAMOND:
                return 2 == t ? 30 : 1 == t ? 20 : 10;
            case ObjectType_1.ObjectType.AMETHYST:
                return 2 == t ? 30 : 1 == t ? 15 : 8;
            case ObjectType_1.ObjectType.REIDITE:
                return 2 == t ? 20 : 1 == t ? 10 : 5;
            case ObjectType_1.ObjectType.EMERALD:
                return 2 == t ? 15 : 1 == t ? 10 : 5;
            case ObjectType_1.ObjectType.PALM:
                return 40;
            case ObjectType_1.ObjectType.CAVE_STONE:
                return 0;
            case ObjectType_1.ObjectType.RIVER:
                return 50
        }
        return 30
    }
    static getRandomAddMaxMin(e, t = 0) {
        switch (e) {
            case ObjectType_1.ObjectType.TREE:
                return 2 == t ? [2, 6] : 1 == t ? [3, 5] : [2, 4];
            case ObjectType_1.ObjectType.STONE:
            case ObjectType_1.ObjectType.GOLD:
            case ObjectType_1.ObjectType.DIAMOND:
            case ObjectType_1.ObjectType.AMETHYST:
                return 2 == t ? [2, 4] : 1 == t ? [2, 3] : [1, 3];
            case ObjectType_1.ObjectType.REIDITE:
                return 2 == t ? [1, 3] : 1 == t ? [1, 2] : [1, 1];
            case ObjectType_1.ObjectType.EMERALD:
                return 2 == t ? [2, 3] : 1 == t ? [1, 2] : [1, 1];
            case ObjectType_1.ObjectType.PALM:
                return [1, 4];
            case ObjectType_1.ObjectType.CAVE_STONE:
            case ObjectType_1.ObjectType.RIVER:
                return [0, 0]
        }
        return [1, 3]
    }
    static getResourceItem(e) {
        switch (e) {
            case ObjectType_1.ObjectType.TREE:
            case ObjectType_1.ObjectType.STONE:
            case ObjectType_1.ObjectType.GOLD:
            case ObjectType_1.ObjectType.DIAMOND:
            case ObjectType_1.ObjectType.AMETHYST:
            case ObjectType_1.ObjectType.REIDITE:
                return itemsmanager_1.Items.WOOD.id;
            case ObjectType_1.ObjectType.EMERALD:
                return itemsmanager_1.Items.EMERALD.id;
            case ObjectType_1.ObjectType.CACTUS:
                return itemsmanager_1.Items.CACTUS.id;
            case ObjectType_1.ObjectType.PALM:
                return itemsmanager_1.Items.WOOD.id;
            case ObjectType_1.ObjectType.RIVER:
            default:
                return null
        }
    }
    static readScoreFrom(e) {
        switch (e) {
            case ObjectType_1.ObjectType.PALM:
            case ObjectType_1.ObjectType.TREE:
                return 2;
            case ObjectType_1.ObjectType.STONE:
                return 4;
            case ObjectType_1.ObjectType.GOLD:
                return 6;
            case ObjectType_1.ObjectType.DIAMOND:
                return 12;
            case ObjectType_1.ObjectType.AMETHYST:
                return 14;
            case ObjectType_1.ObjectType.REIDITE:
                return 25;
            case ObjectType_1.ObjectType.EMERALD:
                return 30;
            case ObjectType_1.ObjectType.CACTUS:
            default:
                return 1
        }
    }
    static readShouldMine(e, t) {
        switch (e) {
            case ObjectType_1.ObjectType.TREE:
            case ObjectType_1.ObjectType.PALM:
                switch (t.right) {
                    case ItemIds_1.ItemIds.HAND:
                        return 1;
                    case ItemIds_1.ItemIds.PICK_WOOD:
                        return 2;
                    case ItemIds_1.ItemIds.PICK:
                        return 3;
                    case ItemIds_1.ItemIds.PICK_GOLD:
                        return 4;
                    case ItemIds_1.ItemIds.PICK_DIAMOND:
                        return 5;
                    case ItemIds_1.ItemIds.PICK_AMETHYST:
                        return 6;
                    case ItemIds_1.ItemIds.PICK_REIDITE:
                        return 7
                }
                break;
            case ObjectType_1.ObjectType.STONE:
                switch (t.right) {
                    case ItemIds_1.ItemIds.HAND:
                        return -1;
                    case ItemIds_1.ItemIds.PICK_WOOD:
                        return 2;
                    case ItemIds_1.ItemIds.PICK:
                        return 4;
                    case ItemIds_1.ItemIds.PICK_GOLD:
                        return 6;
                    case ItemIds_1.ItemIds.PICK_DIAMOND:
                        return 8;
                    case ItemIds_1.ItemIds.PICK_AMETHYST:
                        return 10;
                    case ItemIds_1.ItemIds.PICK_REIDITE:
                        return 12
                }
                break;
            case ObjectType_1.ObjectType.GOLD:
                switch (t.right) {
                    case ItemIds_1.ItemIds.HAND:
                    case ItemIds_1.ItemIds.PICK_WOOD:
                        return -1;
                    case ItemIds_1.ItemIds.PICK:
                        return 3;
                    case ItemIds_1.ItemIds.PICK_GOLD:
                        return 6;
                    case ItemIds_1.ItemIds.PICK_DIAMOND:
                        return 9;
                    case ItemIds_1.ItemIds.PICK_AMETHYST:
                        return 12;
                    case ItemIds_1.ItemIds.PICK_REIDITE:
                        return 15
                }
                break;
            case ObjectType_1.ObjectType.DIAMOND:
                switch (t.right) {
                    case ItemIds_1.ItemIds.HAND:
                    case ItemIds_1.ItemIds.PICK_WOOD:
                    case ItemIds_1.ItemIds.PICK:
                        return -1;
                    case ItemIds_1.ItemIds.PICK_GOLD:
                        return 4;
                    case ItemIds_1.ItemIds.PICK_DIAMOND:
                        return 8;
                    case ItemIds_1.ItemIds.PICK_AMETHYST:
                        return 12;
                    case ItemIds_1.ItemIds.PICK_REIDITE:
                        return 16
                }
                break;
            case ObjectType_1.ObjectType.AMETHYST:
                switch (t.right) {
                    case ItemIds_1.ItemIds.HAND:
                    case ItemIds_1.ItemIds.PICK_WOOD:
                    case ItemIds_1.ItemIds.PICK:
                    case ItemIds_1.ItemIds.PICK_GOLD:
                        return -1;
                    case ItemIds_1.ItemIds.PICK_DIAMOND:
                        return 1;
                    case ItemIds_1.ItemIds.PICK_AMETHYST:
                        return 10;
                    case ItemIds_1.ItemIds.PICK_REIDITE:
                        return 15
                }
                break;
            case ObjectType_1.ObjectType.CACTUS:
                return 1;
            case ObjectType_1.ObjectType.EMERALD:
            case ObjectType_1.ObjectType.REIDITE:
                switch (t.right) {
                    case ItemIds_1.ItemIds.HAND:
                    case ItemIds_1.ItemIds.PICK_WOOD:
                    case ItemIds_1.ItemIds.PICK:
                    case ItemIds_1.ItemIds.PICK_GOLD:
                    case ItemIds_1.ItemIds.PICK_DIAMOND:
                        return -1;
                    case ItemIds_1.ItemIds.PICK_AMETHYST:
                        return 1;
                    case ItemIds_1.ItemIds.PICK_REIDITE:
                        return 12
                }
        }
        return -1
    }
}
exports.ResourceUtils = ResourceUtils;