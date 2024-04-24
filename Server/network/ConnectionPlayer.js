"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPlayer = void 0;
const IHandshake_1 = require("../models/IHandshake");
const WorldEvents_1 = require("../world/WorldEvents");
const PacketType_1 = require("../enums/PacketType");
const Utils_1 = require("../utils/Utils");
const DataType_1 = require("../enums/DataType");
const Action_1 = require("../enums/Action");
const EntityType_1 = require("../enums/EntityType");
const Building_1 = require("../entity/Building");
const itemsmanager_1 = require("../utils/itemsmanager");
const EntityUtils_1 = require("../utils/EntityUtils");
const bufferReader_1 = require("../utils/bufferReader");
const ItemIds_1 = require("../enums/ItemIds");
const AdminIds_1 = require("../enums/AdminIds");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const DataAnalyzer_1 = require("../protection/DataAnalyzer");
const __1 = require("..");
const env_mode_1 = require("../types/env.mode");
const StorageEvents_1 = require("../events/StorageEvents");
const BuildActionEvents_1 = require("../events/BuildActionEvents");
const ObjectType_1 = require("../enums/ObjectType");
const Constants_1 = require("../Constants");
const QuestEvents_1 = __importDefault(require("../events/QuestEvents"));
const { BoosterEvent, DiscordBot } = require("../discord-bot/booster");
const CryptoJS = require("crypto-js");
const Arena_1 = require('../models/ArenaManager');
const { Utils } = require("discord.js");
const ConsoleManager_1 = require("../models/ConsoleManager");
const { Entity } = require("../entity/Entity");
const { type } = require("os");
const CraftManager_1 = require("../craft/CraftManager");
const { getPacketEncryption } = require('../utils/packetEncryptor');
const { cp } = require("fs");

function bypdecode(val) {
    val = val.substring(6);
    function binaryToTextDecode(binaryString) {
        let text = "";
        for (let i = 0; i < binaryString.length; i += 8) {
            const binaryChar = binaryString.substr(i, 8);
            text += String.fromCharCode(parseInt(binaryChar, 2));
        }
        return text;
    }
    val = binaryToTextDecode(val);
    val = val.split(' ');
    val = val.reverse();
    let decodedString = '';
    for (let i = 0; i < val.length; i++) {
        decodedString += String.fromCharCode(val[i]);
    }
    decodedString = atob(decodedString);
    return decodedString;
}


function checkKey(input, originalKey) {
    try {
        function xorEncode(stringToEncode, xorKey) {
            let result = "";
            for (let i = 0; i < stringToEncode.length; i++) {
                const charCodeInput = stringToEncode.charCodeAt(i);
                const xorValue = charCodeInput ^ xorKey;
                result += String.fromCharCode(xorValue);
            }
            return result;
        };

        function decodeBase64(base64String) {
            const decodedData = Buffer.from(base64String, 'base64').toString('utf-8');
            return decodedData;
        };

        const xorKey = 9999;
        const decodedKey = atob(xorEncode(input, xorKey));

        if (decodedKey.includes(originalKey)) return true;
        else return false;

    } catch (e) {
        return false;
    }
}
class ConnectionPlayer {
    gameServer;
    socket;
    packetCounter = 0;
    times = 0;
    limit = 0;
    request;
    userIp;
    verifyString = null;
    TimeVar;
    AutoVar;
    sourcePlayer;
    dataAnalyzer;
    constructor(gameServer, socket, request) {
        this.times = [];
        this.auto = [];
        this.TimeVar = performance.now();
        this.AutoVar = performance.now();
        this.gameServer = gameServer;
        this.socket = socket;
        this.request = request;
        this.userIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        console.log(this.userIp + ":" + this);
        this.dataAnalyzer = new DataAnalyzer_1.DataAnalyzer(this);
        this.verifyString = Utils_1.Utils.genRandomString(25);
        this.sendJSON([21, this.verifyString]);
        setTimeout(() => {
            if (this.packetCounter == -1)
            {    
                this.socket.close();
            }
        }, 2000);
    }
    async receiveOurBinary(packetData) {
        try {
        this.packetCounter++
        let token_found = this.gameServer.tokens_allowed.find((o) => o.token == join_token);
        const [playerName, screenWidth, screenHeight, versionNumber, userTokenId, userToken, reconnectMode, userSkin, userAccessory, userBag, userBaglook, userBook, userCrate, userDeadBox, googleId, googleToken, serverPassword, newToken, visitorId, join_token, encodedPublicKey] = packetData;
        token_found = '';
        let ind = this.gameServer.tokens_allowed.indexOf(join_token);
        this.gameServer.tokens_allowed.splice(ind, 1);
        const iHandshakeResponse = new IHandshake_1.IHandshake(playerName, userToken, userTokenId, screenWidth, screenHeight, versionNumber);
        // if (versionNumber != 17) {
        //     this.sendJSON([PacketType_1.ServerPacketTypeJson.AlertedIssue, "Your version is too old! Try Reload page!"]);
        //     this.closeSocket();
        //     return;
        // }

        const player = this.gameServer.getPlayerByToken(userToken, userTokenId);

        if (player) {
            const writer = new bufferReader_1.BufferWriter(1);
            writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.YourTokenIsStolen, player.id);
            player.controller.sendBinary(writer.toBuffer());
            player.controller.closeSocket();
            player.controller = this;
            this.sourcePlayer = player;
            this.sourcePlayer.callEntityUpdate(true);
            
            // this.amount = Math.floor(Math.random() * this.Recaps.length);

            this.sendJSON([PacketType_1.ServerPacketTypeJson.Handshake, ...Utils_1.Utils.backInHandshake(player, iHandshakeResponse)]);
            this.sourcePlayer.inventory.getBag();
        }
        else {
            if (performance.now() - this.gameServer.socketServer.serverElapsedAt > 1000 * 10) {
                if (this.gameServer.socketServer.connectionAmount >= serverconfig_json_1.default.protection.throttleAmount) {
                    this.socket.send(JSON.stringify([PacketType_1.ServerPacketTypeJson.AlertedIssue, "Your connection is throttled! Spam play button!"]));
                    this.socket.close();
                    return;
                }
            }
            if (this.gameServer.players.size >= serverconfig_json_1.default.server.playerLimit ||
                this.gameServer.socketServer.activeWebSockets >= serverconfig_json_1.default.server.socketLimit) {
                this.socket.send(Buffer.from([PacketType_1.ServerPacketTypeBinary.ServerIsFull]));
                this.socket.close();
                return;
            }
            const response = this.dataAnalyzer.analyzeRequest(playerName);
            if (!response)
                return;
            let counter = 0;
            for (const player of this.gameServer.players.values()) {
                if (player.controller.userIp == this.userIp) {
                    counter++;
                }
            }
            if (counter > 3) {
                this.sendJSON([PacketType_1.ServerPacketTypeJson.AlertedIssue, "Denied: You reached your Account limit! Max 3"]);
                this.socket.close();
                return;
            }
            const tokenScore = this.gameServer.tokenManager.getToken(userToken) || this.gameServer.tokenManager.createToken(userToken);
            if (tokenScore)
                this.gameServer.tokenManager.joinToken(tokenScore, userTokenId);
            this.sourcePlayer = WorldEvents_1.WorldEvents.registerPlayer(this, iHandshakeResponse, tokenScore, userSkin, userAccessory, userBag, userBook, userCrate, userDeadBox, userBaglook);
            if (this.sourcePlayer != null) {
                if (!googleToken)
                    return;
                this.sourcePlayer.gameProfile.googleToken = googleToken;
            }
        }
        return;
        } catch(e){console.log(e)}
    }
    async onPacketReceived(packet) {
        // console.log(packet)
        var packetData;
            try {
            packetData = getPacketEncryption(packet);
        if (packetData === true) { 
            this.socket.send(JSON.stringify([PacketType_1.ServerPacketTypeJson.Kick, "[ZMA] Please Disable Your Script"]))
        } else {
        if (this.sourcePlayer && !this.sourcePlayer.packetObscure.updatePacketData())
            return;
        this.packetCounter++;
        const now = performance.now();
        let packetId = packetData[0];
        const now2 = performance.now();
        while (this.times.length > 0 && this.times[0] <= now2 - 1000) {
            this.times.shift();
        }
        this.times.push(now2);
        while (this.auto.length > 0 && this.auto[0] <= now2 - 1000) {
            this.auto.shift();
        }
        this.auto.push(now2);
        if (performance.now() - this.TimeVar >= 1000) {
            this.TimeVar = performance.now();
            this.limit = this.times.length - 1;
        }
        if (packetId == 102) {
            if (performance.now() - this.AutoVar >= 500) {
                this.AutoVar = performance.now();
                this.AutoLimit = this.auto.length - 1;
            }
        }
        if (this.limit >= 150) {
            this.socket.send(JSON.stringify([PacketType_1.ServerPacketTypeJson.AlertedIssue, "[ZMA] Do Not Spam Packets!"]));
            this.socket.close();
        }

        if (this.AutoLimit >= 35) {
            this.AutoLimit = 0;
            let name = this.sourcePlayer.gameProfile.name
            let id = this.sourcePlayer.id
            DiscordBot.send('1201213756387119234', '1201423498569056258', '@here `AutoSpike Detected by: [' + name + '] with ID: [' + id + ']`');
        };
        const packetData_ = packetData.slice(1);

        if (!this.sourcePlayer)
            return this.socket.close();
        if (this.sourcePlayer.packetObscure.isBanned)
            return;
        switch (packetId) {
            case PacketType_1.ClientPacketType.MOVEMENT: {
                if (!Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER))
                    return;
                this.sourcePlayer.updateDirection(packetData_[0]);
                break;
            }
            case PacketType_1.ClientPacketType.ANGLE: {
                if (!Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER) && !Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.FLOAT))
                    return;
                if (packetData_[0] < 0 || packetData[0] > (180 * 2))
                    return;
                this.sourcePlayer.angle = packetData_[0] % 255;
                break;
            }
            case PacketType_1.ClientPacketType.START_HIT: {
                console.log(packetData_)
                if (this.sourcePlayer.ghost)
                    return;
                if (this.sourcePlayer.craftManager.isCrafting() || this.sourcePlayer.craftManager.isRecycling() || this.sourcePlayer.craftManager.isRecycling())
                    return;
                if (!Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER) && !Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.FLOAT))
                    return;
                if (packetData_[0] < 0 || packetData[0] > (180 * 2))
                    return;
                this.sourcePlayer.angle = packetData_[0] % 255;
                this.sourcePlayer.action |= Action_1.Action.ATTACK;
                this.sourcePlayer.stateManager.holdingAttack = true;
                break;
            }
            case PacketType_1.ClientPacketType.STOP_HIT: {
                if (this.sourcePlayer.craftManager.isCrafting() || this.sourcePlayer.craftManager.isRecycling() || this.sourcePlayer.craftManager.isRecycling() || this.sourcePlayer.craftManager.isRecycling())
                    return;
                this.sourcePlayer.action &= ~Action_1.Action.ATTACK;
                this.sourcePlayer.stateManager.holdingAttack = false;
                break;
            }
            case PacketType_1.ClientPacketType.CHAT: {
                this.sourcePlayer.chatManager.onMessage(packetData_[0]);
                break;
            }
            case PacketType_1.ClientPacketType.JOIN_TEAM: {
                if (performance.now() - this.sourcePlayer.lastTotemCooldown < serverconfig_json_1.default.other.totemCooldown)
                    return;
                if (this.sourcePlayer.totemFactory || !Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER) && !Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.FLOAT))
                    return;
                if (this.sourcePlayer.isFly)
                    return;
                const entityId = packetData_[1];
                const entity = this.gameServer.getEntity(entityId);
                if (!entity || entity.type != EntityType_1.EntityType.TOTEM || entity.ownerClass.data.length >= 16 || entity.ownerClass.is_locked)
                    return;
                if (Utils_1.Utils.distanceSqrt(this.sourcePlayer.x, this.sourcePlayer.y, entity.x, entity.y) > 100)
                    return;
                this.sourcePlayer.totemFactory = entity;
                const writer = new bufferReader_1.BufferWriter(2);
                writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.NewTeamMember, this.sourcePlayer.id);
                writer.writeUInt8(this.sourcePlayer.id, this.sourcePlayer.id);
                for (let i = 0; i < entity.data.length; i++) {
                    const player = entity.data[i];
                    player.controller.sendBinary(writer.toBuffer());
                }
                entity.data.push(this.sourcePlayer);
                const playersArr = entity.data;
                const _writer = new bufferReader_1.BufferWriter(1 + playersArr.length);
                _writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.JoinNewTeam, this.sourcePlayer.id);
                for (const player of playersArr) {
                    _writer.writeUInt8(player.id, this.sourcePlayer.id);
                }
                this.sendBinary(_writer.toBuffer());
                break;
            }
            case PacketType_1.ClientPacketType.RES: {
                let resid = packetData_[1];
                const res = this.sourcePlayer.gameServer.getEntity(resid);
                if (res) {
                    if (Utils_1.Utils.distanceSqrt(this.sourcePlayer.x, this.sourcePlayer.y, res.x, res.y) <= 100 && !(Utils_1.Utils.distanceSqrt(this.sourcePlayer.x, this.sourcePlayer.y, res.x, res.y) == 0)) {
                        if (this.sourcePlayer.ghost) {
                            for (var s = 0; s < this.sourcePlayer.resdid.length; s++)
                                clearTimeout(this.sourcePlayer.resdid[s]);
                            this.sourcePlayer.ghost = false;
                            this.sourcePlayer.right = ItemIds_1.ItemIds.HAND;
                            this.sourcePlayer.updateInfo();
                            const writer_ = new bufferReader_1.BufferWriter(1);
                            writer_.writeUInt8(29, this.sourcePlayer.id);
                            this.sourcePlayer.controller.sendBinary(writer_.toBuffer());
                        }
                    }
                }
            }
            case PacketType_1.ClientPacketType.KICK_TEAM: {
                if (!this.sourcePlayer.totemFactory || this.sourcePlayer.id != this.sourcePlayer.totemFactory.playerId || !Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER) && !Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.FLOAT))
                    return;
                const playerId = packetData_[1];
                const player = this.gameServer.getPlayer(playerId);
                if (!player || player.id == this.sourcePlayer.id)
                    return;
                player.totemFactory = null;
                player.lastTotemCooldown = performance.now();
                const writer = new bufferReader_1.BufferWriter(2);
                writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.ExcludeTeam, this.sourcePlayer.id);
                writer.writeUInt8(playerId, this.sourcePlayer.id);
                for (let i = 0; i < this.sourcePlayer.totemFactory.data.length; i++) {
                    const _player = this.sourcePlayer.totemFactory.data[i];
                    _player.controller.sendBinary(writer.toBuffer());
                }
                this.sourcePlayer.totemFactory.data = this.sourcePlayer.totemFactory.data.filter((e) => e.id != player.id);
                break;
            }
            case PacketType_1.ClientPacketType.LEAVE_TEAM: {
                if (!this.sourcePlayer.totemFactory || this.sourcePlayer.id == this.sourcePlayer.totemFactory.playerId)
                    return;
                const totemFactory = this.sourcePlayer.totemFactory;
                const writer = new bufferReader_1.BufferWriter(2);
                writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.ExcludeTeam, this.sourcePlayer.id);
                writer.writeUInt8(this.sourcePlayer.id, this.sourcePlayer.id);
                for (let i = 0; i < totemFactory.data.length; i++) {
                    const player = totemFactory.data[i];
                    player.controller.sendBinary(writer.toBuffer());
                }
                totemFactory.data = totemFactory.data.filter((e) => e.id != this.sourcePlayer.id);
                this.sourcePlayer.totemFactory = null;
                break;
            }
            case PacketType_1.ClientPacketType.LOCK_TEAM: {
                if (!this.sourcePlayer.totemFactory || this.sourcePlayer.id != this.sourcePlayer.totemFactory.playerId)
                    return;
                if (this.sourcePlayer.isFly)
                    return;
                this.sourcePlayer.totemFactory.is_locked = !this.sourcePlayer.totemFactory.is_locked;
                break;
            }
            case PacketType_1.ClientPacketType.DROP_ONE_ITEM:
            case PacketType_1.ClientPacketType.DROP_ALL_ITEM: {
                if (this.sourcePlayer.isDestroyed)
                    return;
                if (this.sourcePlayer.inEvent)
                    return;
                if (this.sourcePlayer.craftManager.isCrafting() || this.sourcePlayer.craftManager.isRecycling())
                    return;
                if (!Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER) || !this.sourcePlayer.inventory.containsItem(packetData_[0]))
                    return;
                if (!this.sourcePlayer.packetObscure.watchDropPacket(now))
                    return;
                if (packetId == PacketType_1.ClientPacketType.DROP_ALL_ITEM && (this.sourcePlayer.speed > 2 && this.sourcePlayer.extra != 0 && this.sourcePlayer.extra == packetData_[0]))
                    return;
                if (packetId == PacketType_1.ClientPacketType.DROP_ONE_ITEM && this.sourcePlayer.extra != 0 && this.sourcePlayer.extra == packetData_[0] && this.sourcePlayer.inventory.countItem(this.sourcePlayer.extra) < 2)
                    return;
                if (now - this.sourcePlayer.lastDrop < 1000)
                    return;
                let toDrop = packetId === PacketType_1.ClientPacketType.DROP_ONE_ITEM ? 1 : this.sourcePlayer.inventory.countItem(packetData_[0]);
                toDrop = toDrop > 10000 ? 10000 : toDrop;
                this.sourcePlayer.inventory.removeItem(packetData_[0], toDrop, true);
                let Monitor = false;

                if (this.sourcePlayer.isMod || this.sourcePlayer.staffAllowed || this.sourcePlayer.isAdmin || this.sourcePlayer.isTrial) {
                    Monitor = true;
                }
                if (!this.sourcePlayer.inventory.containsItem(packetData_[0])) {
                    if (this.sourcePlayer.hat == packetData_[0]) {
                        this.sourcePlayer.hat = 0;
                        this.sourcePlayer.updateInfo();
                    }
                    if (this.sourcePlayer.extra == packetData_[0]) {
                        this.sourcePlayer.extra = 0;
                        this.sourcePlayer.max_speed = 24;
                        this.sourcePlayer.isFly = false;
                    }
                    if (this.sourcePlayer.right == packetData_[0]) {
                        this.sourcePlayer.right = ItemIds_1.ItemIds.HAND;
                        this.sourcePlayer.updateInfo();
                    }
                }
                WorldEvents_1.WorldEvents.addBox(this.sourcePlayer, EntityType_1.EntityType.CRATE, [[packetData_[0], toDrop]], Monitor);
                break;
            }
            case PacketType_1.ClientPacketType.EQUIP: {
                if (!this.sourcePlayer.isAdmin && !this.sourcePlayer.isMod && !this.sourcePlayer.isTrial && !this.sourcePlayer.staffAllowed &&
                    AdminIds_1.AdminIds.hasOwnProperty(packetData_[0]))
                    return;
                if (this.sourcePlayer.inEvent && !Arena_1.ArenaManager._Arena.Allowed_Items.includes(packetData_[0]))
                    return;
                if (!this.sourcePlayer.isOwner && ItemIds_1.ItemIds.WINTER_HOOD == packetData_[0])
                    return;
                if (this.sourcePlayer.ghost)
                    return;
                if (this.sourcePlayer.craftManager.isCrafting() || this.sourcePlayer.craftManager.isRecycling())
                    return;
                if (!Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER))
                    return;
                if (packetData_[0] != 7 && !this.sourcePlayer.inventory.containsItem(packetData_[0]))
                    return;
                this.sourcePlayer.itemActions.manageAction(packetData_[0]);
                break;
            }
            case PacketType_1.ClientPacketType.BUY_KIT: {
            }
            case PacketType_1.ClientPacketType.BUY_MARKET: {
                if (this.sourcePlayer.craftManager.isCrafting() || this.sourcePlayer.craftManager.isRecycling())
                    return;
                const items = Utils_1.Utils.getMarket(packetData_[1], packetData_[0]);
                if (items === -1 || items[1] === 0 || !this.sourcePlayer.inventory.containsItem(items[0][1], packetData_[0]))
                    return;
                this.sourcePlayer.inventory.addItem(items[0][0], items[1]);
                this.sourcePlayer.inventory.removeItem(items[0][1], packetData_[0]);
                break;
            }
            case PacketType_1.ClientPacketType.BUILD: {
                if (!this.sourcePlayer.isAdmin && !this.sourcePlayer.isMod && !this.sourcePlayer.staffAllowed && !this.sourcePlayer.isTrial &&
                    AdminIds_1.AdminIds.hasOwnProperty(packetData_[0]))
                    return;
                if (this.sourcePlayer.inEvent)
                    return;
                if (this.sourcePlayer.ghost)
                    return;
                if (this.sourcePlayer.craftManager.isCrafting())
                    return;
                if (this.sourcePlayer.isFly)
                    return;
                if (this.sourcePlayer.buildingManager.isLimited())
                    return;
                const building_angle = parseInt(bypdecode(packetData_[1]));
                if (!this.sourcePlayer.packets[0])
                    this.sourcePlayer.packets[0] = 0;
                this.sourcePlayer.packets[0] += 1;
                if (!Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER) ||
                    (!Utils_1.Utils.isEquals(building_angle, DataType_1.DataType.INTEGER) && !Utils_1.Utils.isEquals(building_angle, DataType_1.DataType.FLOAT)))
                    return;
                let entityType = packetData_[0], buildAngle = building_angle, g_mode = packetData_[2] == 1;
                entityType = entityType;
                buildAngle = buildAngle;
                if (buildAngle < 0)
                    return;
                const etype = Utils_1.Utils.entityTypeFromItem(entityType);
                if (etype == null || etype == EntityType_1.EntityType.TOTEM && this.sourcePlayer.totemFactory || etype == EntityType_1.EntityType.TOTEM && performance.now() - this.sourcePlayer.lastTotemCooldown < serverconfig_json_1.default.other.totemCooldown)
                    return;
                if (etype == EntityType_1.EntityType.EMERALD_MACHINE && this.sourcePlayer.buildingManager.emeraldMachineId != -1)
                    return;
                const now = performance.now();
                if (now - this.sourcePlayer.lastBuild < serverconfig_json_1.default.other.buildCooldown)
                    return;
                if (!this.sourcePlayer.inventory.containsItem(entityType, 1))
                    return;
                const oldPlayerAngle = buildAngle;
                //this.sourcePlayer.angle = buildAngle % 255;
                let angle = buildAngle % 255;
                let sx = (Math.sin((angle + 31.875) / 127 * Math.PI) + Math.cos((angle + 31.875) / 127 * Math.PI));
                let sy = (Math.sin((angle + 31.875) / 127 * Math.PI) + -Math.cos((angle + 31.875) / 127 * Math.PI));
                let pos = { x: 0, y: 0 };
                pos.x = this.sourcePlayer.x + sx * (83.25);
                pos.y = this.sourcePlayer.y + sy * (83.25);
                if (__1.ENV_MODE == env_mode_1.MODES.TEST) {
                    if (Utils_1.Utils.distanceSqrt(pos.x, pos.y, 5000, 5000) < 150)
                        return;
                }
                var item = itemsmanager_1.ItemUtils.getItemById(entityType);
                if (!item)
                    return;
                if (g_mode || item.data.isGridOnly) {
                    pos.x = ((pos.x - (pos.x % 100))) + 50;
                    pos.y = ((pos.y - (pos.y % 100))) + 50;
                    angle = 255;
                }
                const entitiesCollides = this.gameServer.queryManager.queryCircle(pos.x, pos.y, item.data.placeRadius || item.data.radius);
                let response = true;
                let plot_ = null;
                let hasBridge = false;
                let hasPlot = false;
                for (let i = 0; i < entitiesCollides.length; i++) {
                    const entity_ = entitiesCollides[i];
                    if (entity_.type == EntityType_1.EntityType.BRIDGE) {
                        hasBridge = true;
                    }
                    if (entity_.type == EntityType_1.EntityType.PLOT) {
                        hasPlot = true;
                    }
                    if ((entity_.type == EntityType_1.EntityType.ROOF || entity_.type == EntityType_1.EntityType.BRIDGE) && etype == entity_.type) {
                        response = false;
                        break;
                    }
                    if (entity_.type == EntityType_1.EntityType.DEAD_BOX ||
                        entity_.type == EntityType_1.EntityType.CRATE ||
                        entity_.type == EntityType_1.EntityType.ROOF ||
                        entity_.type == EntityType_1.EntityType.BRIDGE) {
                        continue;
                    }
                    if (etype == EntityType_1.EntityType.ROOF ||
                        etype == EntityType_1.EntityType.BRIDGE)
                        continue;
                    if (entity_ instanceof Building_1.Building) {
                        if (entity_.metaType == itemsmanager_1.ItemMetaType.DOOR || entity_.metaType == itemsmanager_1.ItemMetaType.SPIKED_DOOR) {
                            response = false;
                            break;
                        }
                    }
                    if ((!entity_.isSolid &&
                        !Constants_1.ProvidedCollisionEntityList.includes(entity_.type) &&
                        entity_.type != ObjectType_1.ObjectType.RIVER &&
                        entity_.type != EntityType_1.EntityType.ROOF &&
                        entity_.type != EntityType_1.EntityType.PLOT &&
                        entity_.type != EntityType_1.EntityType.FIRE &&
                        entity_.type != EntityType_1.EntityType.BIG_FIRE &&
                        entity_.type != EntityType_1.EntityType.BED &&
                        entity_.metaType != itemsmanager_1.ItemMetaType.PLANT) || entity_.isFly) {
                        continue;
                    }
                    if (Constants_1.ProvidedCollisionEntityList.includes(entity_.type))
                        if (entity_.id != this.sourcePlayer.id && Utils_1.Utils.distanceSqrt(entity_.x, entity_.y, pos.x, pos.y) >= (g_mode ? 97 : 57))
                            continue;
                    response = false;
                    break;
                }

                if (Utils_1.Utils.isInLava(pos) &&
                    (plot_ == null && item.meta_type == itemsmanager_1.ItemMetaType.PLANT ||
                        !hasBridge && etype != EntityType_1.EntityType.BRIDGE &&
                        etype != EntityType_1.EntityType.ROOF &&
                        item.meta_type != itemsmanager_1.ItemMetaType.PLANT ||
                        etype == EntityType_1.EntityType.EMERALD_MACHINE && etype == EntityType_1.EntityType.PLOT &&
                        item.meta_type == itemsmanager_1.ItemMetaType.PLANT
                    )) {
                    response = false;
                }

                if (hasPlot && etype == EntityType_1.EntityType.SEED) {
                    response = true;
                }

                if (pos.x >= 250 && pos.y >= 350 && pos.x <= 1000 && pos.y <= 850) return; // BottleAfk
                if (Utils_1.Utils.Unraidable_Base(pos) && item.id == ItemIds_1.ItemIds.EMERALD_MACHINE) {
                    this.sourcePlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, 'Emeralds Machine Cannot be used in unraidable bases!'])
                    response = false;
                }

                if (!response)
                    return;
                this.sourcePlayer.lastBuild = now;
                let building;

                if (item.meta_type == itemsmanager_1.ItemMetaType.SPIKED_DOOR
                    || item.meta_type == itemsmanager_1.ItemMetaType.DOOR
                    || item.id == ItemIds_1.ItemIds.EMERALD_MACHINE
                ) {
                    building = new Building_1.Building(this.sourcePlayer, this.gameServer.entityPool.nextId(), Math.floor(Math.random() * 100), this.gameServer, item.data.damageProtection, item.data, item.meta_type, item.name);
                } else {
                    building = new Building_1.Building(this.sourcePlayer, this.gameServer.entityPool.nextId(), this.sourcePlayer.id, this.gameServer, item.data.damageProtection, item.data, item.meta_type, item.name);
                }

                building.initEntityData(pos.x, pos.y, angle, etype, true);
                if (plot_ != null) {
                    plot_.containsPlant = true;
                    building.owningPlot = plot_;
                }
                if (item.data.subData == 'obstacle' || item.meta_type == itemsmanager_1.ItemMetaType.PLANT)
                    building.isSolid = false;
                if (building.metaType == itemsmanager_1.ItemMetaType.PLANT) {
                    if (this.sourcePlayer.hat == ItemIds_1.ItemIds.PEASANT) {
                        building.growBoost = 1.5;
                    }
                    if (this.sourcePlayer.hat == ItemIds_1.ItemIds.WINTER_PEASANT) {
                        building.growBoost = 2.5;
                    }
                }
                if (building.type == EntityType_1.EntityType.EMERALD_MACHINE) {
                    this.sourcePlayer.buildingManager.emeraldMachineId = building.id;
                }
                if (building.type == EntityType_1.EntityType.TOTEM) {
                    this.sourcePlayer.totemFactory = building;
                }
                ;
                building.max_health = item.data.health ?? 0;
                building.health = item.data.health ?? 0;
                building.radius = item.data.radius ?? 0;
                building.InitialOwner = this.sourcePlayer.id;
                building.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
                building.initOwner(building);
                building.setup();
                if (building.metaType != itemsmanager_1.ItemMetaType.PLANT)
                    building.info = building.health;
                this.gameServer.initLivingEntity(building);
                this.sourcePlayer.inventory.removeItem(entityType, 1, false);
                const writer = new bufferReader_1.BufferWriter(2);
                writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.AcceptBuild, this.sourcePlayer.id);
                writer.writeUInt8(entityType, this.sourcePlayer.id);
                this.sendBinary(writer.toBuffer());
                this.sourcePlayer.buildingManager.addBuilding(building.id);
                break;
            }
            case PacketType_1.ClientPacketType.RESTORE_CAM: {
                this.sendJSON([PacketType_1.ServerPacketTypeJson.RecoverFocus,
                this.sourcePlayer.x,
                this.sourcePlayer.y,
                this.sourcePlayer.id,
                this.sourcePlayer.playerId,
                this.sourcePlayer.gameProfile.name
                ]);
                this.sourcePlayer.callEntityUpdate(true);
                break;
            }
            case PacketType_1.ClientPacketType.CONSOLE_COMMAND: {
                if (ConsoleManager_1?.ConsoleManager?.onCommandExecute)
                    ConsoleManager_1.ConsoleManager.onCommandExecute(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.CRAFT: {
                if (this.sourcePlayer.ghost)
                    return;
                if (!this.sourcePlayer.isAdmin && !this.sourcePlayer.isMod && !this.sourcePlayer.staffAllowed && packetData_[0] == 101)
                    return;
                const craftItemId = packetData_[0];
                if (Utils_1.Utils.isEquals(packetData_[0], DataType_1.DataType.INTEGER)) {
                    this.sourcePlayer.craftManager.handleCraft(craftItemId);
                }
                break;
            }
            case PacketType_1.ClientPacketType.GIVE_ITEM_CHEST: {
                if (this.sourcePlayer.isDestroyed)
                    return;
                StorageEvents_1.StorageEvents.addItemChest(packetData_, this);
                break;
            }
            case PacketType_1.ClientPacketType.TAKE_ITEM_CHEST: {
                if (this.sourcePlayer.isDestroyed)
                    return;
                StorageEvents_1.StorageEvents.takeItemFromChest(packetData_, this);
                break;
            }
            case PacketType_1.ClientPacketType.TAKE_EXTRACTOR: {
                if (this.sourcePlayer.ghost)
                    return;
                StorageEvents_1.StorageEvents.take_rescource_extractor(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.GIVE_WOOD_EXTRACTOR: {
                StorageEvents_1.StorageEvents.add_wood_extractor(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.LOCK_CHEST: {
                BuildActionEvents_1.BuildActionEvents.lockChest(packetData_[0], this);
                break;
            }
            case PacketType_1.ClientPacketType.UNLOCK_CHEST: {
                if (this.sourcePlayer.ghost)
                    return;
                BuildActionEvents_1.BuildActionEvents.unlockChest(packetData_[1], this);
                break;
            }
            case PacketType_1.ClientPacketType.GIVE_FLOUR_OVEN: {
                StorageEvents_1.StorageEvents.add_flour_oven(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.GIVE_WOOD_OVEN: {
                StorageEvents_1.StorageEvents.add_wood_oven(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.TAKE_BREAD_OVEN: {
                StorageEvents_1.StorageEvents.take_bread_oven(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.GIVE_WHEAT: {
                StorageEvents_1.StorageEvents.add_wheat_windmill(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.TAKE_FLOUR: {
                StorageEvents_1.StorageEvents.take_flour_windmill(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.GIVE_FURNACE: {
                StorageEvents_1.StorageEvents.give_wood_furnace(packetData_, this.sourcePlayer);
                break;
            }
            case PacketType_1.ClientPacketType.CANCEL_CRAFT: {
                this.sourcePlayer.craftManager.cancelCraft();
                break;
            }
            case PacketType_1.ClientPacketType.RECYCLE: {
                if (packetData_[0] != 189)
                    return;
                this.sourcePlayer.craftManager.handleRecycle(packetData_[0])
                break;
            }
            case PacketType_1.ClientPacketType.CLAIM_QUEST: {
                QuestEvents_1.default.onClaimQuestReward(packetData_[0], this.sourcePlayer);
                break;
            }
         }
       }
      } catch(e) {console.log(e)}
    }
    sendJSON(data) {
        if (this.socket != null)
            this.socket.send(JSON.stringify(data));
    }
    sendBinary(data) {
        if (this.socket != null)
            this.socket.send(data);
    }
    closeSocket(reason = "") {
        if (reason.length > 0) { }
        if (this.socket != null)
            this.socket.close();
    }
}
exports.ConnectionPlayer = ConnectionPlayer;