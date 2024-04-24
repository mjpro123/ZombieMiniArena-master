"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const ItemType_1 = require("../enums/types/ItemType");
class Item {
    id;
    defense;
    mob_defense;
    damage;
    building_damage;
    offset;
    radius;
    /* pickaxes, hand */
    harvest;
    /* shovels */
    dig;
    /* bottle, watermelon */
    water;
    food;
    /* bandage, aloe */
    heal;
    cold;
    constructor(id, configSystem) {
        this.id = id;
        this.defense = configSystem.itemDefense[id] ?? 0;
        this.mob_defense = configSystem.itemMobDefense[id] ?? 0;
        this.damage = configSystem.itemDamage[id] ?? 0;
        this.building_damage = configSystem.itemBuildingDamage[id] ?? this.damage / 3;
        this.harvest = configSystem.itemHarvest[id] ?? 0;
        this.dig = configSystem.itemDig[id] ?? 0;
        this.water = configSystem.itemWaterValue[id] ?? 0;
        this.food = configSystem.itemFoodValue[id] ?? 0;
        this.heal = configSystem.itemHealValue[id] ?? 0;
        this.cold = configSystem.itemColdValue[id] ?? 0;
        this.radius = configSystem.itemRadius[id] ?? 0;
        this.offset = configSystem.itemOffset[id] ?? 0;
    }
    isVehicle() {
        return [
            ItemType_1.ItemType.BABY_DRAGON, ItemType_1.ItemType.BABY_LAVA, ItemType_1.ItemType.HAWK,
            ItemType_1.ItemType.BABY_MAMMOTH, ItemType_1.ItemType.BOAR, ItemType_1.ItemType.CRAB_BOSS
        ].includes(this.id);
    }
    isHat() {
        return [
            ItemType_1.ItemType.WOOD_HELMET, ItemType_1.ItemType.STONE_HELMET, ItemType_1.ItemType.GOLD_HELMET, ItemType_1.ItemType.DIAMOND_HELMET, ItemType_1.ItemType.AMETHYST_HELMET,
            ItemType_1.ItemType.REIDITE_HELMET, ItemType_1.ItemType.DRAGON_HELMET, ItemType_1.ItemType.LAVA_HELMET, ItemType_1.ItemType.CRAB_HELMET,
            ItemType_1.ItemType.CROWN_BLUE, ItemType_1.ItemType.CROWN_GREEN, ItemType_1.ItemType.CROWN_GREEN,
            ItemType_1.ItemType.EARMUFFS, ItemType_1.ItemType.COAT, ItemType_1.ItemType.CAP_SCARF, ItemType_1.ItemType.FUR_HAT,
            ItemType_1.ItemType.HOOD, ItemType_1.ItemType.WINTER_HOOD, ItemType_1.ItemType.PEASANT, ItemType_1.ItemType.WINTER_PEASANT,
            ItemType_1.ItemType.TURBAN1, ItemType_1.ItemType.TURBAN2, ItemType_1.ItemType.DIVING_MASK, ItemType_1.ItemType.SUPER_DIVING_SUIT,
            ItemType_1.ItemType.DIAMOND_PROTECTION, ItemType_1.ItemType.AMETHYST_PROTECTION, ItemType_1.ItemType.REIDITE_PROTECTION,
            ItemType_1.ItemType.PILOT_HAT, ItemType_1.ItemType.PIRATE_HAT, ItemType_1.ItemType.EXPLORER_HAT
        ].includes(this.id);
    }
    isCooldown() {
        return [
            ItemType_1.ItemType.WOOD_HELMET, ItemType_1.ItemType.STONE_HELMET, ItemType_1.ItemType.GOLD_HELMET, ItemType_1.ItemType.DIAMOND_HELMET, ItemType_1.ItemType.AMETHYST_HELMET,
            ItemType_1.ItemType.REIDITE_HELMET, ItemType_1.ItemType.DRAGON_HELMET, ItemType_1.ItemType.LAVA_HELMET, ItemType_1.ItemType.CRAB_HELMET,
            ItemType_1.ItemType.CROWN_BLUE, ItemType_1.ItemType.CROWN_GREEN, ItemType_1.ItemType.CROWN_GREEN
        ].includes(this.id);
    }
    isSlowDown() {
        return this.isSpear() || this.isSword() || this.isBow();
    }
    isFood() {
        return [
            ItemType_1.ItemType.BERRY, ItemType_1.ItemType.PUMPKIN, ItemType_1.ItemType.GARLIC,
            ItemType_1.ItemType.CARROT, ItemType_1.ItemType.TOMATO, ItemType_1.ItemType.WATERMELON,
            ItemType_1.ItemType.COOKIE, ItemType_1.ItemType.SUGAR_CAN, ItemType_1.ItemType.CAKE,
            ItemType_1.ItemType.MEAT, ItemType_1.ItemType.FISH, ItemType_1.ItemType.CACTUS,
            ItemType_1.ItemType.COOKED_MEAT, ItemType_1.ItemType.FISH_COOKED,
            ItemType_1.ItemType.BREAD, ItemType_1.ItemType.SANDWICH, ItemType_1.ItemType.ALOE_VERA,
            ItemType_1.ItemType.ICE, ItemType_1.ItemType.BOTTLE_FULL, ItemType_1.ItemType.BANDAGE
        ].includes(this.id);
    }
    isEquipment() {
        return this.isSword() || this.isBow() || this.isShield() || this.isSpear() || this.isTool() || this.isHammer();
    }
    isTool() {
        return [
            ItemType_1.ItemType.WOOD_PICK, ItemType_1.ItemType.STONE_PICK, ItemType_1.ItemType.GOLD_PICK, ItemType_1.ItemType.DIAMOND_PICK, ItemType_1.ItemType.AMETHYST_PICK, ItemType_1.ItemType.REIDITE_PICK,
            ItemType_1.ItemType.WRENCH, ItemType_1.ItemType.WATERING_CAN_FULL, ItemType_1.ItemType.BOOK, ItemType_1.ItemType.MACHETE, ItemType_1.ItemType.PITCHFORK, ItemType_1.ItemType.GOLD_PITCHFORK,
            ItemType_1.ItemType.STONE_SHOVEL, ItemType_1.ItemType.GOLD_SHOVEL, ItemType_1.ItemType.DIAMOND_SHOVEL, ItemType_1.ItemType.SADDLE,
            ItemType_1.ItemType.AMETHYST_SHOVEL, ItemType_1.ItemType.REIDITE_SHOVEL
        ].includes(this.id);
    }
    isSword() {
        return [
            ItemType_1.ItemType.WOOD_SWORD, ItemType_1.ItemType.STONE_SWORD, ItemType_1.ItemType.GOLD_SWORD, ItemType_1.ItemType.DRAGON_SWORD,
            ItemType_1.ItemType.DIAMOND_SWORD, ItemType_1.ItemType.AMETHYST_SWORD, ItemType_1.ItemType.REIDITE_SWORD, ItemType_1.ItemType.LAVA_SWORD,
            ItemType_1.ItemType.PIRATE_SWORD, ItemType_1.ItemType.CURSED_SWORD
        ].includes(this.id);
    }
    isBow() {
        return [
            ItemType_1.ItemType.WOOD_BOW, ItemType_1.ItemType.STONE_BOW, ItemType_1.ItemType.GOLD_BOW, ItemType_1.ItemType.DIAMOND_BOW,
            ItemType_1.ItemType.AMETHYST_BOW, ItemType_1.ItemType.REIDITE_BOW, ItemType_1.ItemType.DRAGON_BOW
        ].includes(this.id);
    }
    isSpear() {
        return [
            ItemType_1.ItemType.WOOD_SPEAR, ItemType_1.ItemType.STONE_SPEAR, ItemType_1.ItemType.GOLD_SPEAR, ItemType_1.ItemType.DRAGON_SPEAR,
            ItemType_1.ItemType.DIAMOND_SPEAR, ItemType_1.ItemType.AMETHYST_SPEAR, ItemType_1.ItemType.REIDITE_SPEAR, ItemType_1.ItemType.LAVA_SPEAR
        ].includes(this.id);
    }
    isHammer() {
        return [
            ItemType_1.ItemType.STONE_HAMMER, ItemType_1.ItemType.GOLD_HAMMER, ItemType_1.ItemType.DIAMOND_HAMMER,
            ItemType_1.ItemType.AMETHYST_HAMMER, ItemType_1.ItemType.REIDITE_HAMMER, ItemType_1.ItemType.SUPER_HAMMER
        ].includes(this.id);
    }
    isShield() {
        return [
            ItemType_1.ItemType.WOOD_SHIELD, ItemType_1.ItemType.STONE_SHIELD, ItemType_1.ItemType.GOLD_SHIELD,
            ItemType_1.ItemType.DIAMOND_SHIELD, ItemType_1.ItemType.AMETHYST_SHIELD, ItemType_1.ItemType.REIDITE_SHIELD,
        ].includes(this.id);
    }
    equal(id) {
        return this.id === id;
    }
}
exports.Item = Item;
