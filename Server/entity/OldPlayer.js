"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Action_1 = require("../enums/Action");
const EntityType_1 = require("../enums/EntityType");
const PacketType_1 = require("../enums/PacketType");
const GameProfile_1 = require("../models/GameProfile");
const bufferReader_1 = require("../utils/bufferReader");
const inventory_1 = require("../utils/inventory");
const Entity_1 = require("./Entity");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const trades_json_1 = __importDefault(require("../settings/trades.json"));
const ItemIds_1 = require("../enums/ItemIds");
const StateManager_1 = require("../models/StateManager");
const ChatManager_1 = require("../models/ChatManager");
const Gauges_1 = require("../models/Gauges");
const itemsmanager_1 = require("../utils/itemsmanager");
const ItemAction_1 = require("../models/ItemAction");
const UpdateManager_1 = require("../models/UpdateManager");
const BuildingManager_1 = require("../models/BuildingManager");
const ECollisionManager_1 = require("../models/ECollisionManager");
const Utils_1 = require("../utils/Utils");
const Bullet_1 = require("./Bullet");
const VehiculeType_1 = require("../enums/VehiculeType");
const CraftManager_1 = require("../craft/CraftManager");
const MovementDirection_1 = require("../math/MovementDirection");
const PacketObscure_1 = require("../network/PacketObscure");
const QuestManager_1 = require("../models/QuestManager");
const { urlToHttpOptions } = require("url");
const { kill } = require("process");
const { Utils } = require("discord.js");
const Building_1 = require("../entity/Building");
const { access } = require("fs");
const { WorldGenerator } = require("../world/WorldGenerator");
const { assignBounty } = require("../exec/PvPTime");
const DieReason_1 = require("../enums/DieReason")
var startTime = new Date();
class Player extends Entity_1.Entity {
    controller;
    gameProfile;
    inventory;
    stateManager;
    chatManager;
    gaugesManager;
    questManager;
    completeQuests = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    attack_pos;
    width = 3560;
    height = 2440;
    right = 0;
    vechile = 0;
    hat = 0;
    bag = false;
    itemActions;
    lastVector = { x: 0, y: 0 }
    resdid;
    bandage;
    isStunned = false;
    lastStun = -1;
    lastKick = -1;
    lastBuild = -1;
    lastHittenBuildDamager = -1;
    lastTotemCooldown = -1;
    lastHoodCooldown = -1;
    updateManager;
    buildingManager;
    collisionManager;
    totemFactory;
    isAdmin = false;
    ghost = false;
    ism = false;
    isFrozen = false;
    arrayList;
    ridingType = null;
    craftManager;
    tokenScore;
    keys;
    packets;
    boosterClaimed = false;
    flowerClaimed = false;
    packetObscure;
    prevDirection = 0;
    last_speed = 24;
    Last_Teleport = 9999;
    deathReason = DieReason_1.DieReason.PLAYER_KILLED;
    last_arrow = {};
    lastSurviveUpdate = performance.now();
    lastAnalyze = -1;
    DiscordBot;
    wand1 = 0;
    wand2 = 0;
    constructor(controller, id, gameServer, tokenScore, token, token_id, name = 'Aquti', skin = 0, accessory = 0, book = 0, box = 0, baglook = 0, deadBox = 0) {
        super(id, id, gameServer);
        this.controller = controller;
        //this.gameProfile = new GameProfile_1.GameProfile("namedYUSU", ~~(Math.random() * 155), ~~(Math.random() * 94), 0, 0, 0, 0, 0, 0, 0, 0, performance.now(), token, token_id);
        this.gameProfile = new GameProfile_1.GameProfile(name, skin, accessory, book, box, baglook, 0, 0, deadBox, 0, 0, performance.now(), token, token_id)
        if (serverconfig_json_1.default.inventory.withBag)
            this.bag = true;
        this.packetObscure = new PacketObscure_1.PacketObscure(this.controller);
        this.inventory = new inventory_1.Inventory(this, serverconfig_json_1.default.inventory.startSize);
        this.stateManager = new StateManager_1.StateManager(this);
        this.itemActions = new ItemAction_1.ItemAction(this);
        this.updateManager = new UpdateManager_1.UpdateManager(this);
        this.buildingManager = new BuildingManager_1.BuildingManager(this);
        this.craftManager = new CraftManager_1.CraftManager(this);
        this.questManager = new QuestManager_1.QuestManager(this);
        this.tokenScore = tokenScore;
        this.keys = {};
        this.packets = [];
        this.attack_pos = {};
        this.resdid = [];
        this.chatManager = new ChatManager_1.ChatManager(this);
        this.gaugesManager = new Gauges_1.GaugesManager(this);
        this.health = 200;
        this.Redeemed = {};
        this.gaugesManager.update();
        this.boosterClaimed = false;
        this.collisionManager = new ECollisionManager_1.ECollisionManager(this);
        this.right = ItemIds_1.ItemIds.HAND;
        this.updateInfo();
        this.DiscordBot = this.gameServer.DiscordBot;

        if (this.gameServer.gameConfiguration.viplist.price1.includes(this.controller.userIp)) {
            for (let i = 0; i < this.gameServer.gameConfiguration.kit2.length; i += 2) {
                const kitItem = this.gameServer.gameConfiguration.kit2[i];
                const kitItemCount = this.gameServer.gameConfiguration.kit2[i + 1];
                this.inventory.addItem(ItemIds_1.ItemIds[kitItem], kitItemCount);
            }
        }
        else {
            for (let i = 0; i < this.gameServer.gameConfiguration.kit.length; i += 2) {
                const kitItem = this.gameServer.gameConfiguration.kit[i];
                const kitItemCount = this.gameServer.gameConfiguration.kit[i + 1];
                this.inventory.addItem(ItemIds_1.ItemIds[kitItem], kitItemCount);
            }
        }
        if (serverconfig_json_1.default.inventory.withBag) {
            this.bag = true;
            this.updateInfo();
        }

    }
    updateInfo() {
        this.info = this.right + (this.hat * 128);
        if (this.bag && !this.ghost)
            this.info += 16384;
    }
    giveBoosterkit(id, player) {
        if (player.ownerClass.id == id) {
            console.log("AIWNGUIWGNGI");
        }
    }
    updateStun() {
        if (!this.isStunned)
            return;
        if (performance.now() - this.lastStun > 2000)
            this.isStunned = false;
    }

    updateBounty() {
        if (this.gameProfile.kills <= 1000 && this.gameProfile.kills >= 10) {
            this.gameProfile.bounty = assignBounty(this);
        }

        let most_days = { name: '', days: 0 };
        let most_kills = { player: {}, name: '', kills: 0, bounty: 0 };

        this.gameServer.players.forEach(player => {
            if (player.gameProfile.kills >= most_kills.kills) {
                most_kills.name = player.gameProfile.name;
                most_kills.kills = player.gameProfile.kills;
                most_kills.bounty = player.gameProfile.bounty[0][1];
                most_kills.player = player
            }

            if (player.gameProfile.days >= most_days.days) {
                most_days.name = player.gameProfile.name;
                most_days.days = player.gameProfile.days
            }
        });

        this.gameServer.players.forEach(player => {
            if (player == most_kills.player) {
                player.bounty = true;
            } else {
                player.bounty = false;
            }
        });

        let amount = most_kills.bounty
        this.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ServerDescription, `\n#00ffaf Zombie Mini Arena 4.0 \n#00ffaf Developed by Logixx\n#FBDA2C ====================\n#FFFF00 Bounty: ${most_kills.name}, They have ${most_kills.kills} Kills. \n#FFFF00 Longest Surviving Player: ${most_days.name}, \n#FFFF00 They survived ${most_days.days} Days.\n#0084fc Be The King Of Jungle! \n#FBDA2C ====================\n#46df04 Join Our Discord To Check Latest Updates, \n#46df04 All Our GearLog | Information | Polls, \n#3454FB Our Discord: []\nOwner Discord: logix_x`]);
    }

    survivalUpdate() {
        this.gaugesManager.tick();
        this.gaugesManager.update();
        this.updateBounty()
        const now = performance.now();
        if (now - this.lastSurviveUpdate > serverconfig_json_1.default.other.dayInMilliseconds) {
            this.lastSurviveUpdate = now;
            const writer = new bufferReader_1.BufferWriter(1);
            writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.Survive);
            this.controller.sendBinary(writer.toBuffer());
            this.gameProfile.days++;
            if (!this.flowerClaimed && this.gameProfile.days > 100 && this.gameProfile.kills > 75) {
                this.inventory.addItem(ItemIds_1.ItemIds.FLOWER_HAT, 1);
                this.flowerClaimed = true;
            }
            this.gameProfile.score += 5000;
        }

        if (now - this.lastAnalyze > 1000) {
            this.lastAnalyze = performance.now();
        }

        let itemsArray2 = this.inventory.toArray();


        if (!(this.x >= 350 && this.y >= 570 && this.x <= 950 && this.y <= 760) && this.BottleAFK) {
            this.BottleAFK = false;
        }

        for (let i = 0; i < itemsArray2.length; i++) {

            let item = itemsmanager_1.ItemUtils.getItemById(itemsArray2[i][0])

            if (itemsArray2[i][0] == ItemIds_1.ItemIds.CHRISTMAS_HAT)
                if (this.inventory.countItem(ItemIds_1.ItemIds.REIDITE_SPIKE) < 10)
                    this.inventory.addItem(ItemIds_1.ItemIds.REIDITE_SPIKE, 1);

            if (itemsArray2[i][0] == ItemIds_1.ItemIds.ELF_HAT) {
                if (isNaN(now - this.last_candy) || now - this.last_candy > 5000) {
                    this.inventory.addItem(ItemIds_1.ItemIds.CANDY, 5);
                    this.last_candy = performance.now()
                }
            }

            if (itemsArray2[i][0] == ItemIds_1.ItemIds.CANDY) {
                if (itemsArray2[i][1] >= 5) {
                    this.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, 1)
                    this.inventory.removeItem(ItemIds_1.ItemIds.CANDY, 5)
                }
            }

            if (item && item.meta_type == itemsmanager_1.ItemMetaType.BOW) {
                const arrow = ItemIds_1.ItemIds[item.data.bulletData[0]]
                if (this.inventory.countItem(arrow) > 10) {
                    const arrows = Math.min(this.inventory.countItem(arrow) - 10, 100)
                    this.inventory.removeItem(arrow, arrows)
                }
                if (!this.last_arrow[item.name] && this.inventory.countItem(arrow) < 5) {
                    this.inventory.addItem(arrow, item.data.bulletData[1])
                    this.last_arrow[item.name] = now;
                }
                if (now - this.last_arrow[item.name] > 10000 && this.inventory.countItem(arrow) < 5) {
                    this.inventory.addItem(arrow, item.data.bulletData[1])
                    this.last_arrow[item.name] = now;
                }
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.TURBAN1) {
                if (this.inventory.countItem(ItemIds_1.ItemIds.DIAMOND_SPIKE) < 40)
                    this.inventory.addItem(ItemIds_1.ItemIds.DIAMOND_SPIKE, 1);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.TURBAN2 && this.inventory.countItem(ItemIds_1.ItemIds.AMETHYST_SPIKE) < 40) {
                this.inventory.addItem(ItemIds_1.ItemIds.AMETHYST_SPIKE, 1);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.PIRATE_HAT) {
                this.inventory.addItem(ItemIds_1.ItemIds.WOOD, 10);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.CARROT_SEED) {
                this.inventory.addItem(ItemIds_1.ItemIds.NIMBUS, itemsArray2[i][1]);
                this.inventory.removeItem(ItemIds_1.ItemIds.CARROT_SEED, 1, !0);
            }

        }
    }
    survivalUpdate2() {
        let itemsArray2 = this.inventory.toArray();
        for (let i = 0; i < itemsArray2.length; i++) {
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.WAND1) {
                if (this.wand1 >= 199) {
                    this.inventory.removeItem(ItemIds_1.ItemIds.WAND1, 1)
                    this.wand1 = 0;
                }
                this.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, 1);
                this.wand1++;
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.WAND2) {
                if (this.wand2 >= 199) {
                    this.inventory.removeItem(ItemIds_1.ItemIds.WAND2, 1)
                    this.wand2 = 0;
                }
                this.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, 2);
                this.wand2++;
            }
        }
    }


    updatePlayer() {
        const weapon = itemsmanager_1.ItemUtils.getItemById(this.right)

        if (!this.inventory.containsItem(this.right)) {
            this.right = ItemIds_1.ItemIds.HAND;
        }
        if (!this.inventory.containsItem(this.extra)) {
            this.extra = 0;
        }
        if (!this.inventory.containsItem(this.hat)) {
            this.hat = 0;
        }

        if (Utils_1.Utils.isHammer(this.right) || this.right == ItemIds_1.ItemIds.HAND || weapon.meta_type == itemsmanager_1.ItemMetaType.SHIELD) {
            this.max_speed = 24;
            this.speed = this.max_speed;
        }

        if (weapon && (weapon.meta_type == itemsmanager_1.ItemMetaType.SWORD || weapon.meta_type == itemsmanager_1.ItemMetaType.BOW)) {
            const decreaseWeapon = serverconfig_json_1.default.entities.player.speed_weapon;
            this.action &= ~Action_1.Action.ATTACK;
            this.stateManager.holdingAttack = false;
            this.max_speed = 24;
            this.speed = this.max_speed;
            this.speed -= (this.collideCounter > 0 ? 0 : (this.extra > 0 ? decreaseWeapon / 4.5 : decreaseWeapon / 3));
        }
    }

    updateEquipment(id) {
        if (!this.inventory.containsItem(id)) {
            if (this.hat == id) {
                this.hat = 0;
                this.updateInfo();
            }
            if (this.extra == id) {
                this.extra = 0;
                this.max_speed = 24;
                this.isFly = false;
            }
            if (this.right == id) {
                this.right = ItemIds_1.ItemIds.HAND;
                this.updateInfo();
            }
        }
    }
    tradeUpdate() {
        if (!Utils_1.Utils.isInBottleAFK(this)) {
            if (this.inventory.containsItem(ItemIds_1.ItemIds.BOTTLE_EMPTY)) {
                this.inventory.removeItem(ItemIds_1.ItemIds.BOTTLE_EMPTY, this.inventory.countItem(ItemIds_1.ItemIds.BOTTLE_EMPTY))
            }
        }
        for (let trade of trades_json_1.default) {
            switch (trade.type) {
                case itemsmanager_1.ItemMetaType.LUCK_ITEM: {

                }
                    break;
                case itemsmanager_1.ItemMetaType.TRADE:
                    if (!this.Last_Trade || performance.now() - this.Last_Trade > 1000) {
                        if (Math.floor(this.x / 100) == trade.position[0] && Math.floor(this.y / 100) == trade.position[1] && !this.isFly) {
                            let _required = true;
                            for (let i = 0; i < trade.taken.length; i++) {
                                const items = trade.taken[i];
                                const required_item = ItemIds_1.ItemIds[items[0]];
                                const required_amount = items[1];
                                const item = this.inventory.containsItem(required_item);
                                const amount = this.inventory.countItem(required_item) >= required_amount;

                                if (!item || !amount) {
                                    _required = false;
                                    break;
                                }
                            }

                            if (_required) {
                                this.Last_Trade = performance.now()
                                for (let i = 0; i < trade.taken.length || i < trade.received.length; i++) {
                                    if (i < trade.taken.length) {
                                        const takenItems = trade.taken[i];
                                        const takenItem = ItemIds_1.ItemIds[takenItems[0]];
                                        const takenAmount = takenItems[1];
                                        this.inventory.removeItem(takenItem, takenAmount);
                                    }

                                    if (i < trade.received.length) {
                                        const receivedItems = trade.received[i];
                                        const receivedItem = ItemIds_1.ItemIds[receivedItems[0]];
                                        const receivedAmount = receivedItems[1];
                                        this.inventory.addItem(receivedItem, receivedAmount);
                                    }
                                }
                            } else {
                                this.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, trade.alert])
                                this.Last_Trade = performance.now()
                            }
                        }
                    }
                    break;

                case itemsmanager_1.ItemMetaType.GAMBLE:
                    if (!this.Last_Trade || performance.now() - this.Last_Trade > 4000) {
                        if (Math.floor(this.x / 100) == trade.position[0] && Math.floor(this.y / 100) == trade.position[1] && !this.isFly && !this.ghost) {
                            let _required = true;
                            const GAMBLE_ITEM = ItemIds_1.ItemIds[trade.gambled[0]]
                            const GAMBLE_AMOUNT = trade.gambled[1]
                            const WIN_CHANCE = trade.win_chance
                            const GAMBLE_EARN = trade.earn_back * GAMBLE_AMOUNT

                            const item = this.inventory.containsItem(GAMBLE_ITEM);
                            const amount = this.inventory.countItem(GAMBLE_ITEM) >= GAMBLE_AMOUNT;
                            if (!item || !amount) {
                                _required = false;
                            }
                            if (!_required) {
                                this.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, trade.alert])
                                this.Last_Trade = performance.now()
                                return;
                            }
                            const random_number = Math.floor(Math.random() * 100) + 1;
                            this.inventory.removeItem(GAMBLE_ITEM, GAMBLE_AMOUNT)
                            this.Last_Trade = performance.now()
                            if (random_number <= WIN_CHANCE) {
                                if (!this.inventory.containsItem(GAMBLE_ITEM))
                                    return;
                                this.inventory.addItem(GAMBLE_ITEM, GAMBLE_EARN)
                                this.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, 'You have won, congrats!'])
                                return;
                            }
                            this.extra = 0;
                            this.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, 'You have lost!'])
                        }
                    }
                    break;

                case itemsmanager_1.ItemMetaType.LAVA_KIT:
                    if (!this.Lava_Kit) {
                        if (Math.floor(this.x / 100) == trade.position[0] && Math.floor(this.y / 100) == trade.position[1] && !this.isFly && !this.ghost) {
                            for (let i = 0; i < trade.received.length; i++) {
                                const receivedItems = trade.received[i];
                                const receivedItem = ItemIds_1.ItemIds[receivedItems[0]];
                                const receivedAmount = receivedItems[1];
                                this.inventory.addItem(receivedItem, receivedAmount);
                            }
                            this.Lava_Kit = true;
                            this.gameServer.players.forEach(player => {
                                if (player.x > 8500 && player.x < 8900 && player.y > 3100 && player.y < 3400 && !player.isFly) {
                                    let location = this.gameServer.worldSpawner.findFirstLocation();
                                    player.x = location[0]
                                    player.y = location[1]
                                }
                            });
                            this.gameServer.WorldGenerator.ReplaceLavaKit(true, this.gameServer)
                        }
                    }
                    break;

                    case itemsmanager_1.ItemMetaType.EMERALD:
                            if (Math.floor(this.x / 100) == trade.position[0] && Math.floor(this.y / 100) == trade.position[1] && !this.isFly && !this.ghost) {
                                for (let i = 0; i < trade.received.length; i++) {
                                    const receivedItems = trade.received[i];
                                    const receivedItem = ItemIds_1.ItemIds[receivedItems[0]];
                                    const receivedAmount = receivedItems[1];
                                    this.inventory.addItem(receivedItem, receivedAmount);
                                }
                                this.gameServer.WorldGenerator.ReplaceLavaKit(true, this.gameServer)
                        }
                        break;

                case itemsmanager_1.ItemMetaType.TELEPORT:
                    if (performance.now() - this.Last_Teleport < 500) {
                        return;
                    }
                    if (Math.floor(this.x / 100) == trade.position[0] && Math.floor(this.y / 100) == trade.position[1] && !this.ghost) { // && !this.isFly
                        let _required = true;
                        for (let i = 0; i < trade.sub.length; i++) {
                            let sub = trade.sub[i]
                            if (sub.length < 1) {
                                continue;
                            }
                            let name = ItemIds_1.ItemIds[sub[0]]
                            const item = this.inventory.containsItem(name);
                            const amount = this.inventory.countItem(name) >= sub[1];
                            if (!item || !amount) {
                                _required = false;
                            }
                        }
                        for (let i = 0; i < trade.cost.length; i++) {
                            let cost = trade.cost[i]
                            if (cost.length < 1) {
                                continue;
                            }
                            let name = ItemIds_1.ItemIds[cost[0]]
                            const item = this.inventory.containsItem(name);
                            const amount = this.inventory.countItem(name) >= cost[1];
                            if (!item || !amount) {
                                _required = false;
                                continue;
                            }
                            this.inventory.removeItem(name, amount)
                        }

                        if (!_required) {
                            return;
                        }
                        if (trade.heal) {
                            this.health += trade.heal[0]
                        }
                        // this.extra = 0;
                        // this.isFly = false;

                        console.log('tp cmd or place?')

                        this.updateInfo()
                        this.updatePlayer()
                        if (trade.teleport[0] == 'RANDOM') {
                            const random = this.gameServer.worldSpawner.findFirstLocation();
                            this.x = random[0]
                            this.y = random[1]
                        } else {
                            this.x = (trade.teleport[0] * 100);
                            this.y = (trade.teleport[1] * 100);
                        }
                    }
                    break;

                case itemsmanager_1.ItemMetaType.HEAL:
                    let _required = true;
                    if (trade.position.length < 4) {
                        if (Math.floor(this.x / 100) == trade.position[0] && Math.floor(this.y / 100) == trade.position[1]) {
                            for (let i = 0; i < trade.cost.length; i++) {
                                let cost = trade.cost[i]
                                if (cost.length < 1) {
                                    continue;
                                }
                                let name = ItemIds_1.ItemIds[cost[0]]
                                const item = this.inventory.containsItem(name);
                                const amount = this.inventory.countItem(name) >= cost[1];
                                if (!item || !amount) {
                                    _required = false;
                                    continue;
                                }
                            }

                            if (_required) {
                                this.health += trade.regen[0]
                                this.ownerClass.gaugesManager.healthUpdate();
                            }
                        }
                    } else {
                        const x = Math.floor(this.x / 100)
                        const y = Math.floor(this.y / 100)
                        if (x <= trade.position[0] && x >= trade.position[1] && y >= trade.position[2] && y <= trade.position[3]) {
                            for (let i = 0; i < trade.cost.length; i++) {
                                let cost = trade.cost[i]
                                if (cost.length < 1) {
                                    continue;
                                }
                                let name = ItemIds_1.ItemIds[cost[0]]
                                const item = this.inventory.containsItem(name);
                                const amount = this.inventory.countItem(name) >= cost[1];
                                if (!item || !amount) {
                                    _required = false;
                                    continue;
                                }
                            }

                            if (_required) {
                                this.health += trade.regen[0]
                                this.ownerClass.gaugesManager.healthUpdate();
                            }
                        }
                    }
            }
        }
    }
    syncUpdate() {
        this.craftManager.update();
        this.collisionManager.updateCollides();
        this.questManager.tickUpdate();
        this.callEntityUpdate(false);
        this.tradeUpdate()
    }
    callEntityUpdate(isHard) {
        const entities = this.updateManager.getEntities(isHard);
        const writer = new bufferReader_1.BufferWriter(2 + entities.length * 18);
        writer.writeUInt16(PacketType_1.ServerPacketTypeBinary.EntityUpdate);
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            writer.writeUInt8(entity.playerId % 255);
            writer.writeUInt8(entity.angle % 255);
            writer.writeUInt16(entity.action);
            writer.writeUInt16(entity.type);
            writer.writeUInt16(entity.x);
            writer.writeUInt16(entity.y);
            writer.writeUInt16(entity.id);
            writer.writeUInt16(entity.info);
            writer.writeUInt16(entity.speed * 10);
            writer.writeUInt16(entity.extra);
        }
        if (entities.length > 0)
            this.controller.sendBinary(writer.toBuffer());
    }
    updateMovement(direction) {
        var pos1 = { x: 0, y: 0 };
        this.vector.x = 0;
        this.vector.y = 0;
        let speed = this.speed;
        let deplifier = .71;
        let vectorX = this.vector.x
        let vectorY = this.vector.y
        switch (direction) {
            case MovementDirection_1.MovementDirection.LEFT:
                vectorX -= speed;
                break;
            case MovementDirection_1.MovementDirection.RIGHT:
                vectorX += speed;
                break;
            case MovementDirection_1.MovementDirection.TOP:
                vectorY += speed;
                break;
            case MovementDirection_1.MovementDirection.BOTTOM:
                vectorY -= speed;
                break;
            case MovementDirection_1.MovementDirection.LEFT_BOTTOM:
                vectorX -= speed * deplifier;
                vectorY += speed * deplifier;
                break;
            case MovementDirection_1.MovementDirection.RIGHT_BOTTOM:
                vectorX += speed * deplifier;
                vectorY += speed * deplifier;
                break;
            case MovementDirection_1.MovementDirection.RIGHT_TOP:
                vectorY -= speed * deplifier;
                vectorX += speed * deplifier;
                break;
            case MovementDirection_1.MovementDirection.LEFT_TOP:
                vectorX -= speed * deplifier;
                vectorY -= speed * deplifier;
                break;
            case MovementDirection_1.MovementDirection.NONE:
                if (this.isFly) {
                    vectorX -= speed
                    vectorY -= speed
                }
        }
        this.last_speed = this.speed
        this.vector.x = vectorX;
        this.vector.y = vectorY;
        this.lastVector = { x: this.vector.x, y: this.vector.y };
        this.stateManager.isFrictionEnabled = this.vector.y > 0;
        var pos2 = { x: this.vector.x, y: this.vector.y };

        var distance = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
        if (itemsmanager_1.ItemUtils.getItemById(this.extra).data.vehicule_type == VehiculeType_1.VehiculeType.GROUND) {
        }
        else if (distance > 15) {
            if (this.ownerClass.ISF) {
            }
            else {
                this.extra ? this.isFly = true : this.isFly = false;
            }
        }
        else {
            if (!this.ownerClass.ISF && this.stateManager.isInRoof == false && direction != 0)
                this.isFly = false;
        }
    }
    onEntityUpdate() {
    }
    updateDirection(direction) {
        this.oldDirection = this.direction;
        this.direction = direction;
        if (direction == 0) {
            this.speed = 0, this.old_speed = 0, this.new_speed = 0, this.prevDirection = 0, this.direction = 0;
            console.log('stopped3')
            this.action |= Action_1.Action.IDLE;
            this.action &= ~Action_1.Action.WALK;
        }
        else {
            this.action &= ~Action_1.Action.IDLE;
            this.action |= Action_1.Action.WALK;
        }
        this.syncUpdate();
    }
    tickUpdate() {
        let baseSpeed = this.old_speed;
        this.old_speed = this.max_speed;
        const weaponFactor = itemsmanager_1.ItemUtils.getItemById(this.right);
        let decreaseWeapon = 0;
        if (weaponFactor != null && weaponFactor.type == itemsmanager_1.ItemType.EQUIPPABLE &&
            (weaponFactor.meta_type == itemsmanager_1.ItemMetaType.SWORD || weaponFactor.meta_type == itemsmanager_1.ItemMetaType.BOW)
            && !this.ownerClass.ISF) {
            decreaseWeapon = serverconfig_json_1.default.entities.player.speed_weapon;
        }

        if (decreaseWeapon > 0 && (!this.ownerClass.ISF || this.isFly)) {
            if (this.ownerClass.ISF || this.isFly) {
                if (baseSpeed > 16) {
                    baseSpeed -= (this.collideCounter > 0 ? 0 : (this.extra > 0 ? decreaseWeapon / 4.5 : decreaseWeapon / 3));
                }
            }
            else {
                baseSpeed -= (this.collideCounter > 0 ? 0 : (this.extra > 0 ? decreaseWeapon / 4.5 : decreaseWeapon / 3));
            }
        }

        if (this.ownerClass.ISF && !this.isFly) {
            if (this.stateManager.isInWater) {
                baseSpeed = this.extra > 0 ? baseSpeed = 10 : baseSpeed = 14;
            } else
                baseSpeed = this.extra > 0 ? baseSpeed = 10 : baseSpeed = 12;
        }

        if (this.isFly && weaponFactor != null && weaponFactor.type == itemsmanager_1.ItemType.EQUIPPABLE &&
            weaponFactor.meta_type == itemsmanager_1.ItemMetaType.SWORD && !this.stateManager.holdingAttack && baseSpeed > 24) {
            baseSpeed -= serverconfig_json_1.default.entities.player.speed_attack_decrease / 8
            if (this.ownerClass.ISF && baseSpeed > 18) {
                baseSpeed -= serverconfig_json_1.default.entities.player.speed_attack_decrease * 1.5
            }
        }

        if (this.stateManager.holdingAttack && weaponFactor != null && weaponFactor.type == itemsmanager_1.ItemType.EQUIPPABLE && weaponFactor.meta_type == itemsmanager_1.ItemMetaType.SWORD
            && !this.isFly) {
            baseSpeed -= serverconfig_json_1.default.entities.player.speed_attack_decrease * 2;
        }


        if (this.stateManager.holdingAttack && weaponFactor != null && weaponFactor.type == itemsmanager_1.ItemType.EQUIPPABLE && (weaponFactor.meta_type == itemsmanager_1.ItemMetaType.SWORD || weaponFactor.meta_type == itemsmanager_1.ItemMetaType.BOW) && baseSpeed > 24) {
            baseSpeed -= serverconfig_json_1.default.entities.player.speed_attack_decrease * 2;
            if (this.ownerClass.ISF) {
                baseSpeed -= serverconfig_json_1.default.entities.player.speed_attack_decrease * 2
            }
        }

        if (this.stateManager.isInWater)
            baseSpeed -= (this.hat == ItemIds_1.ItemIds.DIVING_MASK || this.hat == ItemIds_1.ItemIds.SUPER_DIVING_SUIT) ? 4 : 8;
        if (this.direction == 12)
            this.direction = 4;
        if (this.direction == 13)
            this.direction = 5;
        if (this.direction == 14)
            this.direction = 6;
        let direction = this.direction;
        if (this.extra != 0) {
            let asItem = itemsmanager_1.ItemUtils.getItemById(this.extra);
            let ras = asItem.data.raiseSpeed;

            if (this.hat == ItemIds_1.ItemIds.PILOT_HELMET && asItem.data.vehicule_type == VehiculeType_1.VehiculeType.FLY) {
                let duplifier = itemsmanager_1.ItemUtils.getItemById(this.hat).data.speed_boost;
                ras *= duplifier
            }

            if (
                this.extra == ItemIds_1.ItemIds.BOAT ||
                this.isFly & this.direction != 0 ||
                this.direction !== 0 &&
                Utils_1.Utils.checkVehiculeCondition(this, asItem.data.vehicule_type) &&
                (this.isFly || !Utils_1.Utils.isInLava(this)) ||
                this.extra == ItemIds_1.ItemIds.CRAB_BOSS && !Utils_1.Utils.isInLava(this) && !this.stateManager.isInBridge
                ||
                this.direction !== 0 && this.extra != ItemIds_1.ItemIds.CRAB_BOSS && Utils_1.Utils.isInLava(this) && this.stateManager.isInBridge
                ||
                this.direction !== 0 && !this.isFly && (
                    this.extra == ItemIds_1.ItemIds.BABY_DRAGON ||
                    this.extra == ItemIds_1.ItemIds.NIMBUS ||
                    this.extra == ItemIds_1.ItemIds.HAWK ||
                    this.extra == ItemIds_1.ItemIds.BABY_LAVA
                )
            ) {
                baseSpeed = Math.min(baseSpeed, (this.speed + ras));
                if (this.extra == ItemIds_1.ItemIds.CRAB_BOSS && this.stateManager.isInSea || this.stateManager.isInWater) {
                    baseSpeed = baseSpeed * 1.2;
                }
            } else {
                let cancel = false;
                let plot = false;
                let door_open = false;
                if (this.ownerClass.ISF && this.isFly) {
                    let collides = this.gameServer.queryManager.queryCircle(this.x, this.y, this.radius);
                    for (let i = 0; i < collides.length; i++) {
                        const entity_ = collides[i];

                        if (entity_.isSolid) {
                            cancel = true;
                        }

                        if (entity_ instanceof Building_1.Building) {
                            if ((entity_.itemName == 'BRIDGE' || entity_.itemName == 'PLOT') && !this.ownerClass.ISF) {
                                if (entity_.itemName == 'PLOT') {
                                    plot = true;
                                }
                                cancel = false;
                            }

                            if (entity_.metaType == itemsmanager_1.ItemMetaType.DOOR || entity_.metaType == itemsmanager_1.ItemMetaType.SPIKED_DOOR) {
                                if (!entity_.isSolid) {
                                    door_open = true;
                                    cancel = false;
                                }
                            }

                            if (entity_.isSolid || this.stateManager.isInRoof) {
                                cancel = true;
                            }
                        }

                    }

                }


                if (cancel && baseSpeed < 18) {
                    baseSpeed = 18
                }
                if (this.speed > 1) {
                    baseSpeed = Math.min(baseSpeed, (this.speed + ras));
                    // if (this.ownerClass.ISF && (this.stateManager.isInBridge == false || this.stateManager.isInRoof == true) && !plot && !door_open) {
                    //     if (baseSpeed < 16) {
                    //         baseSpeed = Math.min(baseSpeed, (this.speed + ras));
                    //     }
                    //     else {
                    //         if (baseSpeed < 16) {
                    //             baseSpeed = Math.min(baseSpeed, (this.speed + (ras)));
                    //         }
                    //     }
                    // } else {
                        let collide = false;
                        if (this.isFly) {
                            let collides = this.gameServer.queryManager.queryCircle(this.x, this.y, this.radius);
                            for (let i = 0; i < collides.length; i++) {
                                const entity_ = collides[i];

                                if (entity_ instanceof Building_1.Building) {
                                    if (entity_.itemName == 'BRIDGE' || entity_.itemName == 'PLOT') {
                                        collide = false;
                                    } else {
                                        collide = true;
                                    }
                                }

                                if (entity_.metaType == itemsmanager_1.ItemMetaType.DOOR || entity_.metaType == itemsmanager_1.ItemMetaType.SPIKED_DOOR) {
                                    if (!entity_.isSolid) {
                                        collide = false;
                                    }
                                }
                            }


                        }

                        if (!collide && !cancel) {
                            let slowSpeed = asItem.data.slowSpeed
                            if (this.hat == ItemIds_1.ItemIds.PILOT_HELMET && this.vehicule_type == VehiculeType_1.VehiculeType.FLY) {
                                let duplifier = itemsmanager_1.ItemUtils.getItemById(this.hat).data.speed_boost;
                                slowSpeed *= duplifier
                            }
                            baseSpeed = Math.max(1, (this.speed - slowSpeed));
                        }
                    }


                    if (this.direction < 1) {
                        console.log('issue?', this.direction)
                        // direction = this.oldDirection;
                        this.direction = 4
                    }
                }

                this.old_speed = Math.max(0, baseSpeed);

            }

            if (direction == 12)
                direction = 4;


            if (this.prevDirection != this.direction) {
                let isDiagonal = (this.direction == MovementDirection_1.MovementDirection.LEFT_BOTTOM ||
                    this.direction == MovementDirection_1.MovementDirection.RIGHT_BOTTOM ||
                    this.direction == MovementDirection_1.MovementDirection.LEFT_TOP ||
                    this.direction == MovementDirection_1.MovementDirection.LEFT_BOTTOM);
                if (!isDiagonal && !this.isFly && !this.hat != ItemIds_1.ItemIds.PILOT_HELMET)
                    baseSpeed /= 1.65;
            }
        // }

        if (this.isStunned && performance.now() - this.lastStun > 1000) {
            this.isStunned = false;
        }
        baseSpeed < 0 ? baseSpeed = 0 : baseSpeed = baseSpeed
        this.speed = this.isStunned ? 0 : baseSpeed;
        this.updateMovement(direction);
        this.prevDirection = this.direction;
        if (this.stateManager.holdingAttack && performance.now() - this.stateManager.lastAttack > 450) {
            this.stateManager.lastAttack = performance.now();
            this.action |= Action_1.Action.ATTACK;
            this.updateAttackDot();
            this.hitHappened();
        }
        else if (this.stateManager.holdingAttack && performance.now() - this.stateManager.lastAttack < 458)
            this.action &= ~Action_1.Action.ATTACK;
    }
    updateAttackDot() {
        let expandOffset = 0, expandRadius = 0;
        let item = itemsmanager_1.ItemUtils.getItemById(this.right)
        let brofly = this.isFly ? 1.35 : 1;
        if (this.right != ItemIds_1.ItemIds.HAND) {
            const rightItem = itemsmanager_1.ItemUtils.getItemById(this.right).data;
            expandOffset = rightItem.expandOffset * brofly;
            expandRadius = rightItem.expandRadius * brofly;
        }
        if (this.right == ItemIds_1.ItemIds.HAND) {
            expandRadius = 25 * brofly;
            expandOffset = 15 * brofly;
        }
        let angle_x = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + Math.cos((this.angle + 31.875) / 127 * Math.PI));
        let angle_y = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + -Math.cos((this.angle + 31.875) / 127 * Math.PI));
        this.attack_pos = {
            x: this.x + angle_x * (expandOffset),
            y: this.y + angle_y * (expandOffset),
            radius: expandRadius
        };
    }

    createArrow() {

    }
    hitHappened() {
        let handItemEquiped = itemsmanager_1.ItemUtils.getItemById(this.right);
        if (handItemEquiped != null) {
            switch (handItemEquiped.meta_type) {
                case itemsmanager_1.ItemMetaType.SHOVEL: {
                    if (this.stateManager.isInSea)
                        return;
                    let itemToGive = this.stateManager.isInSand ? ItemIds_1.ItemIds.SAND : ItemIds_1.ItemIds.GROUND;
                    let countIncrease = handItemEquiped.data.mine_increase;
                    this.inventory.addItem(itemToGive, countIncrease);
                    break;
                }
                case itemsmanager_1.ItemMetaType.BOW: {
                    let angle_x = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + Math.cos((this.angle + 31.875) / 127 * Math.PI));
                    let angle_y = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + -Math.cos((this.angle + 31.875) / 127 * Math.PI));
                    let travelDist = 360;
                    let expandOffset = 0;
                    const p2s = {
                        x: this.x + angle_x * (expandOffset),
                        y: this.y + angle_y * (expandOffset)
                    };

                    const bullet = handItemEquiped.data.bulletData
                    const arrow_type = ItemIds_1.ItemIds[bullet[0]]
                    const item = itemsmanager_1.ItemUtils.getItemById(arrow_type)
                    if (this.inventory.containsItem(arrow_type)) {
                        if (this.inventory.countItem(arrow_type) >= bullet[1]) {
                            const arrow = new Bullet_1.Bullet(this.gameServer.entityPool.nextId(), this.id, this.gameServer, arrow_type, this, p2s, item);
                            arrow.initEntityData(p2s.x, p2s.y, ((~~(this.angle - 90 / 360 * 255)) + 255) % 255, EntityType_1.EntityType.SPELL, false);
                            arrow.initOwner(arrow);
                            arrow.angle = ((~~(this.angle - 90 / 360 * 255)) + 255) % 255;
                            arrow.max_speed = item.data.max_speed;
                            arrow.info = item.data.info
                            arrow.extra = this.isFly ? 1 : this.stateManager.isInTower ? 1 : 0;
                            this.arrayList = {
                                x: p2s.x,
                                y: p2s.y
                            };
                            this.inventory.removeItem(ItemIds_1.ItemIds[handItemEquiped.data.bulletData[0]], handItemEquiped.data.bulletData[1])
                            this.gameServer.initLivingEntity(arrow);
                            break;
                        }
                    }
                }
            }
        }
        const entities = this.gameServer.queryManager.queryCircle(this.attack_pos.x, this.attack_pos.y, this.isFly ? this.attack_pos.radius + 5 : this.attack_pos.radius);
        for (let i = 0; i < entities.length; i++) {
            const ent = entities[i];
            const item = itemsmanager_1.ItemUtils.getItemById(this.right)
            if (ent.id == this.id) {
                continue;
            }
            if (Utils_1.Utils.isArrow(ent)) {
                continue;
            }
            if (ent.isFly != this.isFly)
                continue;
            if (ent.type == EntityType_1.EntityType.PLAYERS && ent.ownerClass.ghost != this.ownerClass.ghost) {
                continue;
            }
            ent.receiveHit(this);
        }
    }
}
exports.Player = Player;