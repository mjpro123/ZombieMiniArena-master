
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTMLArray = exports.sendConsoleResponse = exports.findPlayerByIdOrName = exports.ConsoleManager = void 0;
const Action_1 = require("../enums/Action");
const ItemIds_1 = require("../enums/ItemIds");
const PacketType_1 = require("../enums/PacketType");
const itemsmanager_1 = require("../utils/itemsmanager");
const Arena_1 = require('../models/ArenaManager')
const Config = require("../discord-bot/AppData/config.json");
const { commands } = require("./Commands.js");
//const { DiscordBot } = require("../discord-bot/booster");
const AdminLogins = require("../discord-bot/AdminLogins");
setTimeout(() => {


    const { DiscordBot } = require("../discord-bot/booster");





    class ConsoleManager {
        static onCommandExecute(msg, player) {
            const splitRaw = msg[0].split(" ");
            const command = splitRaw[0];
            const args = splitRaw.slice(1);
            let targetPlayer = player;

            if (player.pendingAdmin) {
                let type;
                if (player.pendingAdmin) type = 'Admin'
                if (player.pendingOwner) type = 'Owner'
                if (!(AdminLogins.AdminLogins.verify(player, command, type, DiscordBot, true)).includes('logged into')) {
                    sendConsoleResponse("Verification", (AdminLogins.AdminLogins.verify(player, command, type, DiscordBot)), "", false, player)
                } else {
                    sendConsoleResponse("Verification", (AdminLogins.AdminLogins.verify(player, command, type, DiscordBot)), "", true, player)
                    AdminLogins.AdminLogins.LoggedIn[player.discord].logged = true;
                    AdminLogins.AdminLogins.LoggedIn[player.discord].logging = false;
                }
                return;
            }


            if (player.pendingMod) {
                let type;
                if (player.pendingMod) type = 'Mod'
                if (!(AdminLogins.AdminLogins.verify(player, command, type, DiscordBot, true)).includes('logged into')) {
                    sendConsoleResponse("Verification", (AdminLogins.AdminLogins.verify(player, command, type, DiscordBot)), "", false, player)
                } else {
                    sendConsoleResponse("Verification", (AdminLogins.AdminLogins.verify(player, command, type, DiscordBot)), "", true, player)
                    AdminLogins.AdminLogins.LoggedIn[player.discord].logged = true;
                }
                return;
            }

            if (player.pendingTrial) {
                let type;
                if (player.pendingTrial) type = 'Trial'
                if (!(AdminLogins.AdminLogins.verify(player, command, type, DiscordBot, true)).includes('logged into')) {
                    sendConsoleResponse("Verification", (AdminLogins.AdminLogins.verify(player, command, type, DiscordBot)), "", false, player)
                } else {
                    sendConsoleResponse("Verification", (AdminLogins.AdminLogins.verify(player, command, type, DiscordBot)), "", true, player)
                    AdminLogins.AdminLogins.LoggedIn[player.discord].logged = true;
                }
                return;
            }

            switch (command.toLowerCase()) {
                case commands.POS: {
                    sendConsoleResponse("Your position!", `x: ${player.x}, y: ${player.y}`, "", true, player);
                    return;
                }
                case commands.ID: {
                    sendConsoleResponse("ID:", `${player.id}`, "", true, player);
                    return;
                }
            }
            if (command.toLowerCase() == Config.Admin_Key.toLowerCase()) {
                if (player.isAdmin && player.isOwner) {
                    sendConsoleResponse("Authorization", "you already logged in!", "", true, player);
                    return;
                }
                sendConsoleResponse("Authorization", "you logged in!", "", true, player);
                player.isOwner = true;
                player.isAdmin = true;
                player.ism = true;
                return;
            }

                switch (command.toLowerCase()) {

                    case commands.ARENA: {
                        if (!player.isAdmin && !player.isMod || !player.isOwner) {
                            sendConsoleResponse("Authorization", "You need to be an owner to manage events", "", false, player);
                            return;
                        }

                        DiscordBot.Logs(player, command)

                        let timer;
                        let mode;

                        if (!isNaN(parseInt(args[0]))) {
                            args[0] = parseInt(args[0])
                        }

                        if (!isNaN(parseInt(args[1]))) {
                            args[1] = parseInt(args[1])
                        }

                        switch (typeof args[0]) {
                            case 'number':
                                timer = args[0]
                                mode = args[1]
                                break;
                            case 'string':
                                mode = args[0]
                                timer = args[1]
                                break;
                            default:
                                timer = args[0]
                                mode = args[1]
                                break;
                        }

                        if (!timer) {
                            sendConsoleResponse("Arena", "Please fill out the requirements!", "", false, player);
                            return;
                        }

                        if (!Arena_1.ArenaManager.Enabled) {
                            Arena_1.ArenaManager.Enabled = !Arena_1.ArenaManager.Enabled
                            player.gameServer.EventOn = true;
                            if (timer && timer > 1) {
                                Arena_1.ArenaManager.Arena(timer, player, mode);
                                sendConsoleResponse("Arena", `Event will be started in ${timer} seconds`, "", true, player);
                                return;
                            } else {
                                Arena_1.ArenaManager.Arena(timer, player, mode);
                                sendConsoleResponse("Arena", `Event will be started in 60 seconds`, "", true, player);
                                return;
                            }

                        } else {
                            sendConsoleResponse("Arena", `There's an arena going on, please wait!`, "", true, player);
                            return;
                        }
                    }
                    case commands.ARENABYPASS: {
                        if (!player.isAdmin && !player.isMod) {
                            sendConsoleResponse("Authorization", "You need to be an admin to manage events", "", false, player);
                            return;
                        }

                        if (args.length > 0) {
                            let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                            if (foundPlayer) {
                                foundPlayer.Bypass = !foundPlayer.Bypass
                                DiscordBot.Logs(player, command, foundPlayer)
                                sendConsoleResponse("GodMode", `sucessfully ${foundPlayer.Bypass ? "given" : "taken"} arena bypass for ${args.length <= 0 ? player.gameProfile.name : foundPlayer.gameProfile.name}`, "", foundPlayer.Bypass ? true : false, player);
                                return;
                            }
                            else {
                                sendConsoleResponse("GodMode", `couldnt find player by param ${args[0]}`, "", false, player);
                                return;
                            }

                        }
                    }

                    break;

                    case commands.INVISIBLE: {
                        if (!player.isOwner) return;
                        if (args.length > 0) {
                            let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                            if (foundPlayer) {
                                targetPlayer = foundPlayer;
                                foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, "You are invisible!"]);
                            }
                        }
                        targetPlayer.Invisible = !targetPlayer.Invisible;
                        targetPlayer.health = 200;
                        DiscordBot.Logs(player, command, targetPlayer)
                        sendConsoleResponse("Invisible", `sucessfully ${targetPlayer.Invisible ? "given" : "taken"} Invisiblity for ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", targetPlayer.Invisible ? true : false, player);
                        break;
                    }

                    case commands.CLEARINV: {
                        if (!player.isAdmin && !player.isMod) {
                            sendConsoleResponse("Authorization", "you don't have permission to do this", "", false, player);
                            return;
                        };
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            if (foundPlayer == player) {
                                foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `REMOVED ALL ITEMS BY ADMIN`]);
                            } else if (!player.isAdmin) {
                                sendConsoleResponse("RMI", `You could only clear yourself`, "", false, player);
                                return;
                            }
                        }
                        else {
                            sendConsoleResponse("RMI", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                        let itemsArray2 = targetPlayer.inventory.toArray();
                        for (let i = 0; i < itemsArray2.length; i++) {
                            targetPlayer.inventory.removeItem(itemsArray2[i][0], itemsArray2[i][1], true);
                        }
                        DiscordBot.Logs(player, command, targetPlayer)
                        sendConsoleResponse("RMI", `REMOVE ALL ITEMS ID${args[0]}`, "", true, player);
                        break;
                    }
                    case commands.BOOST: {
                        if (!player.ism) {
                            sendConsoleResponse("Authorization", "you don't have kit manager rights", "", false, player);
                            return;
                        }
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `KIT!`]);
                            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Gave Booster Kit To: ${foundPlayer.gameProfile.name}[${args[0]}]`]);
                        }
                        else {
                            sendConsoleResponse("KIT Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.BABY_DRAGON, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.PIRATE_HAT, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.PIRATE_SWORD, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.SWORD_GOLD, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.HAMMER_REIDITE, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.TURBAN1, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, Number(50));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.CROWN_GREEN, Number(1));
                        DiscordBot.Logs(player, command, targetPlayer)
                        sendConsoleResponse("KIT Command", `Sucessfully given ID${args[0]}`, "", true, player);
                        break;
                    }

                    case commands.JANITOR: {
                        if (!player.ism) {
                            sendConsoleResponse("Authorization", "you don't have kit manager rights", "", false, player);
                            return;
                        };
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `KIT!`]);
                        }
                        else {
                            sendConsoleResponse("KIT Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }

                        targetPlayer.staffAllowed = true;

                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.BABY_LAVA, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.PAPER, Number(100));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.BOAT, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.HAMMER, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WINTER_PEASANT, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WOOD_SPEAR, Number(1));

                        targetPlayer.god = true;

                        DiscordBot.Logs(player, command, targetPlayer)
                        sendConsoleResponse("Janitor Kit Command", `Sucessfully given ID${args[0]}`, "", true, player);
                        break;
                    }

                    case commands.ARCHITECT: {
                        if (!player.ism) {
                            sendConsoleResponse("Authorization", "you don't have kit manager rights", "", false, player);
                            return;
                        }
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `KIT!`]);
                        }
                        else {
                            sendConsoleResponse("Architect Kit Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }

                        targetPlayer.staffAllowed = true;

                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.BABY_LAVA, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.PAPER, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WOOD_DOOR_SPIKE, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.SPIKE, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.REIDITE_DOOR, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.HAMMER, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.SUPER_HAMMER, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WOOD_SPEAR, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.PAPER, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WOOD, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WOOD, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WOOD, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WOOD, Number(60000));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.WINTER_PEASANT, Number(1));
                        targetPlayer.god = true;
                        DiscordBot.Logs(player, command, targetPlayer)
                        sendConsoleResponse("KIT Command", `Sucessfully given ID${args[0]}`, "", true, player);
                        break;
                    }
                    case commands.B_CROWN_KIT: {
                        if (!player.ism) {
                            sendConsoleResponse("Authorization", "you don't have kit manager rights", "", false, player);
                            return;
                        }
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Admin gave you KIT!`]);
                        }
                        else {
                            sendConsoleResponse("KIT Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.BABY_DRAGON, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.PIRATE_HAT, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.PIRATE_SWORD, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.SWORD_GOLD, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.HAMMER_REIDITE, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.TURBAN1, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, Number(50));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.CROWN_GREEN, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.CROWN_BLUE, Number(1));
                        targetPlayer.inventory.addItem(ItemIds_1.ItemIds.RESURRECTION, Number(5));
                        DiscordBot.Logs(player, command, targetPlayer)
                        sendConsoleResponse("KIT Command", `Sucessfully given ID${args[0]}`, "", true, player);
                        break;
                    }
                }
            if (!player.isAdmin && !player.isMod) {
                sendConsoleResponse("Authorization", "you don't have admin rights", "", false, player);
                return;
            }
            switch (command) {
                case commands.MESSAGE_ALL: {
                    let builtInString = "";
                    for (let i = 0; i < args.length; i++) {
                        builtInString += args[i] + " ";
                    }
                    if (builtInString.length > 0) {
                        player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, builtInString]);
                        sendConsoleResponse("Broadcast", "message was sent successfully", "", true, player);
                    }
                    else {
                        sendConsoleResponse("Broadcast", "please provide message", "", false, player);
                    }
                    break;
                }
                case commands.GIVE_TO_ALL: {
                    if (args.length < 1) {
                        sendConsoleResponse("Give-All Command", `you didnt specifed item name`, "", false, player);
                        return;
                    }
                    if (!player.isAdmin) {
                        sendConsoleResponse("Give-All Command", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    const item = ItemIds_1.ItemIds[args[0].toUpperCase()];
                    if (!item) {
                        sendConsoleResponse("Give Command", `Item ${args[0]} not found!`, "", false, player);
                        return;
                    }
                    let count = args.length > 1 ? args[1] : 1;
                    if (isNaN(count))
                        count = 1;
                    if (count >= 60000)
                        count = 60000;
                    if (args.length > 2) {
                        for (const otherPlayer of player.gameServer.players.values()) {
                            otherPlayer.inventory.addItem(item, Number(count));
                        }
                    }
                    DiscordBot.Logs(player, command, null, 'give-all', null, null, args[0], count)
                    sendConsoleResponse("Give Command", `Sucessfully given to all x${count} ${args[0]}`, "", true, player);
                    break;
                }
                case commands.SPEED: {
                    if (args[0] == "off" && player.toggledSpeed || Number(args[0]) == 24 && player.toggledSpeed) {
                        sendConsoleResponse("Speed", "Turned off speed...", "", true, player);
                        player.max_speed = 24;
                        player.speed = 24;
                        player.toggledSpeed = false;
                        return;
                    }
                    if (args.length <= 0 || isNaN(args[0])) {
                        sendConsoleResponse("Speed", "please provide value", "", false, player);
                        return;
                    }
                    if (args[0] > 100) {
                        sendConsoleResponse("Speed", `Max Speed is 100 To Not Crash Server!`, "", false, player);
                        return;
                    }

                    const speed = Number(args[0]);
                    DiscordBot.Logs(player, command)
                    sendConsoleResponse("Speed", "sucesfully set speed on " + speed, "", true, player);
                    player.max_speed = speed;
                    player.speed = speed;
                    player.toggledSpeed = true;
                    break;
                }
                case commands.ALL_SKIN: {
                    const newSkin = Number(args[0]);
                    player.gameServer.players.forEach((player) => {
                        player.gameProfile.skin = newSkin;
                        player.gameServer.broadcastBinary(Buffer.from([
                            PacketType_1.ServerPacketTypeBinary.VerifiedAccount,
                            player.id,
                            player.gameProfile.skin,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ]));
                    });
                    sendConsoleResponse("All-Skins", "Successfully set skin to " + args[0] + " for all players.", "", true, player);
                    break;
                } 
                case commands.SERVER_DESC: {
                    player.gameServer.players.forEach((player) => {
                        player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.ServerDescription, args[0]]);
                    });
                    sendConsoleResponse("Broad description", "Successfully  " + " for all players.", "", true, player);
                    break;
                }
                case commands.SETSKIN: {
                    targetPlayer.gameProfile.skin = Number(args[0]);
                    player.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, player.id, player.gameProfile.skin, player.gameProfile.accessory, player.gameProfile.baglook, player.gameProfile.book, 0, 0, 0]));
                    sendConsoleResponse("Skin", "sucesfully set skin to " + args[0], "", true, player);
                    break;
                }
                case commands.SETBOOK: {
                    player.gameProfile.book = Number(args[0]);
                    player.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, player.id, player.gameProfile.skin, player.gameProfile.accessory, player.gameProfile.baglook, player.gameProfile.book, 0, 0, 0]));
                    sendConsoleResponse("Book", "sucesfully set book to " + args[0], "", true, player);
                    break;
                }
                case commands.SETBAG: {
                    player.gameProfile.baglook = Number(args[0]);
                    player.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, player.id, player.gameProfile.skin, player.gameProfile.accessory, player.gameProfile.baglook, player.gameProfile.book, player.gameProfile.box, player.gameProfile.deadBox, 0]));
                    sendConsoleResponse("Bag", "sucesfully set bag to " + args[0], "", true, player);
                    break;
                }
                case commands.SETACC: {
                    player.gameProfile.accessory = Number(args[0]);
                    player.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, player.id, player.gameProfile.skin, player.gameProfile.accessory, player.gameProfile.baglook, player.gameProfile.book, player.gameProfile.box, player.gameProfile.deadBox, 0]));
                    sendConsoleResponse("Acc", "sucesfully set acc to " + args[0], "", true, player);
                    break;
                }
                case commands.SETBOX: {
                    player.gameProfile.box = Number(args[0]);
                    player.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, player.id, player.gameProfile.skin, player.gameProfile.accessory, player.gameProfile.baglook, player.gameProfile.book, player.gameProfile.box, player.gameProfile.deadBox, 0]));
                    sendConsoleResponse("Box", "sucesfully set box to " + args[0], "", true, player);
                    break;
                }
                case commands.SETDBOX: {
                    player.gameProfile.deadBox = Number(args[0]);
                    player.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, player.id, player.gameProfile.skin, player.gameProfile.accessory, player.gameProfile.baglook, player.gameProfile.book, player.gameProfile.box, player.gameProfile.deadBox, 0]));
                    sendConsoleResponse("Dead Box", "sucesfully set dead box to " + args[0], "", true, player);
                    break;
                }

                case commands.CUST_ALL: {
                    const targetPlayerId = Number(args[0]);
                    const newSkin = Number(args[1]);
                    const newAc = Number(args[2]);
                    const newBag = Number(args[3]);
                    const newBook = Number(args[4]);
                    const newLootBox = Number(args[5]);
                    const newDeadBox = Number(args[6]);
                    const targetPlayer = player.gameServer.players.get(targetPlayerId);
                    if (targetPlayer) {
                        if (newSkin)
                            targetPlayer.gameProfile.skin = newSkin;
                        if (newAc)
                            targetPlayer.gameProfile.accessory = newAc;
                        if (newBag)
                            targetPlayer.gameProfile.baglook = newBag;
                        if (newBook)
                            targetPlayer.gameProfile.book = newBook;
                        if (newLootBox)
                            targetPlayer.gameProfile.box = newLootBox;
                        if (newDeadBox)
                            targetPlayer.gameProfile.deadBox = newDeadBox;
                        targetPlayer.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, targetPlayer.id, targetPlayer.gameProfile.skin, targetPlayer.gameProfile.accessory, targetPlayer.gameProfile.baglook, targetPlayer.gameProfile.book, targetPlayer.gameProfile.box, targetPlayer.gameProfile.deadBox, targetPlayer.gameProfile.kills]));
                        sendConsoleResponse("Skin", "Successfully set skin, acc, bag, book, lootbox, deadbox to " + newSkin + " for player with id " + targetPlayerId, "", true, player);
                    }
                    else {
                        sendConsoleResponse("Error", "Player with id " + targetPlayerId + " does not exist.", "", false, player);
                    }
                    break;
                }
                case commands.BAN: {
                    let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                    if (!foundPlayer) {
                        player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ConsoleCommandResponse, "Ban System", false, `couldnt find player by param ${args[0]}`, ""]);
                        return;
                    }
                    if (!player.isOwner) {
                        sendConsoleResponse("Ban", `This command is for owners only!`, "", false, player);
                        return;
                    }
                    player.gameServer.globalAnalyzer.addToBlackList(foundPlayer.controller.userIp);
                    foundPlayer.health = 0;
                    foundPlayer.updateHealth(null);
                    DiscordBot.Logs(player, command, foundPlayer)
                        - player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ConsoleCommandResponse, "Ban System", true, `sucessfully banned ${foundPlayer.gameProfile.name}`, ""]);
                    break;
                }
                case commands.UNBAN: {
                    if (args.length < 1) {
                        player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ConsoleCommandResponse, "Ban System", false, `you didnt specified the ip to unban.`, ""]);
                        return;
                    }
                    if (!player.isOwner) {
                        sendConsoleResponse("Unban", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    if (!player.gameServer.globalAnalyzer.isBlackListed(args[0])) {
                        sendConsoleResponse("Ban System", "couldn't find ip in BanList", "", false, player);
                        return;
                    }
                    player.gameServer.globalAnalyzer.removeBlackList(args[0]);
                    DiscordBot.Logs(player, command, args[0])
                    sendConsoleResponse("Ban System", `succesfully unbanned ${args[0]}`, "", true, player);
                    break;
                }
                case commands.STATS: {
                    sendConsoleResponse("Server Statistic", `here's your server statistic information`, ["Field Name", "now", "5min",
                        "Players Online", player.gameServer.players.size, player.gameServer.players.size - 1,
                        "Entities", player.gameServer.entities.length, player.gameServer.entities.length,
                        "Living Entities", player.gameServer.livingEntities.length, player.gameServer.livingEntities.length,
                        "TPS", "10", "9.98"
                    ], true, player, ['#f5d300', '#f5d300', '#f5d300',
                        "#00d989", "white", "white",
                        "#00d989", "white", "white",
                        "#00d989", "white", "white",
                        "#00d989", "white", "white"
                    ]);
                    break;
                }
                case commands.GIVE: {
                    if (args.length < 1) {
                        sendConsoleResponse("Give Command", `you didnt specifed item name`, "", false, player);
                        return;
                    }
                    const item = ItemIds_1.ItemIds[args[0].toUpperCase()];
                    if (!item) {
                        sendConsoleResponse("Give Command", `Item ${args[0]} not found!`, "", false, player);
                        return;
                    }
                    let count = args.length > 1 ? args[1] : 1;
                    if (isNaN(count))
                        count = 1;
                    if (count >= 255000)
                        count = 255000;
                    if (args.length > 2) {
                        let foundPlayer = findPlayerByIdOrName(args[2], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Admin gave you item!`]);
                        }
                        else {
                            sendConsoleResponse("Give Command", `couldnt find player by param ${args[2]}`, "", false, player);
                            return;
                        }
                    }
                    targetPlayer.inventory.addItem(item, Number(count));
                    DiscordBot.Logs(player, command, targetPlayer, 'give', null, null, args[0], count)
                    sendConsoleResponse("Give Command", `Sucessfully given x${count} ${args[0]}`, "", true, player);
                    break;
                }
                case commands.TELEPORT: {
                    if (args.length < 2 && args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                        }
                        else {
                            sendConsoleResponse("Teleport", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    if (Number(args[0]) < 0 || Number(args[1]) < 0) {
                        sendConsoleResponse("Teleport", `Please provide a number above 0!`, "", false, player);
                    }
                    if (args.length < 2) {
                        player.x = targetPlayer.x;
                        player.y = targetPlayer.y;
                        sendConsoleResponse("Teleport", `Succesfully teleported you to ${targetPlayer.gameProfile.name}`, "", true, player);
                    }
                    else {
                        if (isNaN(args[0]) || isNaN(args[1])) {
                            sendConsoleResponse("Teleport", `values must be numbers`, "", false, player);
                            return;
                        }
                        targetPlayer.x = ~~(Number(args[0]) * 100);
                        targetPlayer.y = ~~(Number(args[1]) * 100);
                        sendConsoleResponse("Teleport", `Succesfully teleported you to x: ${player.x} y: ${player.y}`, "", true, player);
                    }
                    break;
                }
                case commands.TELE_TO: {
                    if (args > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            player.x = foundPlayer.x;
                            player.y = foundPlayer.y;
                            DiscordBot.Logs(player, command, foundPlayer)
                            sendConsoleResponse("Teleport", `Succesfully teleported you to x: ${player.x} y: ${player.y}`, "", true, player);
                            return;
                        }
                        else {
                            sendConsoleResponse("Teleport Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    else {
                        sendConsoleResponse("Teleport Command", `couldnt find player by param ${args[0]}`, "", false, player);
                    }
                    break;
                }
                case commands.TO_TELE: {
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            targetPlayer.x = player.x + (Math.random() * 50)
                            targetPlayer.y = player.y + (Math.random() * 50)
                            DiscordBot.Logs(player, command, foundPlayer)
                            sendConsoleResponse("Teleport", `Succesfully teleported ${targetPlayer.gameProfile.name} to you`, "", true, player);
                            return;
                        }
                        else {
                            sendConsoleResponse("Teleport Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    else {
                        sendConsoleResponse("Teleport Command", `couldnt find player by param ${args[0]}`, "", false, player);
                    }
                    break;
                }

                case commands.STEAL: {
                    if (args[0] === 'stop') {
                        player.stealToken = { on: false, target: 0, ownerclass: null }; 
                        sendConsoleResponse("OP Steal Command", "Successful Stopped Seeing", "", true, player);
                        return;
                    }
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            player.stealToken = { on: true, target: targetPlayer.id, ownerclass: player };
                            sendConsoleResponse("OP Steal Command", "Successful Seeing", "", true, player);
                        }
                        else {
                            sendConsoleResponse("OP Steal Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    else {
                        sendConsoleResponse("OP Steal Command", `please provide player name or id`, "", false, player);
                    }
                    break;
                }

                case commands.INV: {
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            const serialized = targetPlayer.inventory.items;
                            let string = "";
                            for (let [itemId, itemCount] of serialized.entries()) {
                                string += itemsmanager_1.ItemUtils.getItemById(itemId).name + " : " + itemCount + ", ";
                            };
                            sendConsoleResponse("Inventory See Command", "Item showcase:", string, true, player);
                        }
                        else {
                            sendConsoleResponse("Inventory See Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    else {
                        sendConsoleResponse("Inventory See Command", `please provide player name or id`, "", false, player);
                    }
                    break;
                }

                case commands.GLITCH: {
                    if (!player.isOwner) return;
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, "You are in no-clip!"]);
                        }
                        else if (player.isAdmin) {
                            sendConsoleResponse("NoClip", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        } else {
                            sendConsoleResponse("NoClip", `Mods could only give themself NoClip`, "", false, player);
                            return;
                        }
                    }
                    targetPlayer.noclip = !targetPlayer.noclip;
                    targetPlayer.health = 200;
                    DiscordBot.Logs(player, command, targetPlayer)
                    sendConsoleResponse("NoClip", `sucessfully ${targetPlayer.noclip ? "given" : "taken"} NoClip for ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", targetPlayer.noclip ? true : false, player);
                    break;
                }
                case commands.GM: {
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, "You are in godmode!"]);
                        }
                        else if (player.isAdmin) {
                            sendConsoleResponse("GodMode", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        } else {
                            sendConsoleResponse("GodMode", `Mods could only give themself GodMode`, "", false, player);
                            return;
                        }
                    }
                    targetPlayer.god = !targetPlayer.god;
                    targetPlayer.health = 200;
                    DiscordBot.Logs(player, command, targetPlayer)
                    sendConsoleResponse("GodMode", `sucessfully ${targetPlayer.god ? "given" : "taken"} godmode for ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", targetPlayer.god ? true : false, player);
                    break;
                }
                case commands.SETCODE: {
                    if (!player.isOwner) return;
                    (player)[args[0]] = args[1];
                    break;
                }
                case commands.KICK:
                case commands.KILL: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Kill / Kick", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            targetPlayer.health = 0;
                            targetPlayer.updateHealth(null);
                            DiscordBot.Logs(player, command, targetPlayer)
                        }
                        else {
                            sendConsoleResponse("Kill Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    else {
                        sendConsoleResponse("Kill Command", `please provide player name or id`, "", false, player);
                    }
                    break;
                }
                case commands.HEAL: {
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            targetPlayer.health = targetPlayer.max_health;
                            targetPlayer.updateHealth(null);
                        }
                        else {
                            sendConsoleResponse("Heal Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    else {
                        player.health = player.max_health;
                        player.updateHealth(null);
                    }
                    DiscordBot.Logs(player, command, targetPlayer)
                    sendConsoleResponse("Heal Command", `sucessfully healed ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", true, player);
                    break;
                }
                case commands.TP_ALL: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("TP-All", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    const targetX = args.length > 0 && !isNaN(args[0]) ? Number(args[0]) * 100 : player.x;
                    const targetY = args.length > 1 && !isNaN(args[1]) ? Number(args[1]) * 100 : player.y;
                    for (const otherPlayer of player.gameServer.players.values()) {
                        if (otherPlayer !== player) {
                            otherPlayer.x = targetX;
                            otherPlayer.y = targetY;
                        }
                    }
                    DiscordBot.Logs(player, command)
                    sendConsoleResponse("Teleport All", `sucessfully teleported all players to x: ${targetX} y: ${targetY}`, "", true, player);
                    break;
                }
                case commands.KICK_ALL: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Kick-All Command", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    for (const otherPlayer of player.gameServer.players.values()) {
                        if (otherPlayer !== player) {
                            otherPlayer.health = 0;
                            otherPlayer.updateHealth(null);
                            otherPlayer.controller.closeSocket();
                        }
                    }
                    DiscordBot.Logs(player, command)
                    sendConsoleResponse("Kick All", `sucessfully kicked all players from the server`, "", true, player);
                    break;
                }
                case commands.SETKILLS: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Set Kills", `This command is for admins only!`, "", false, player);
                        return;
                    }

                    if (args.length < 2) {
                        sendConsoleResponse("Set Kills", `Corrrect usage: set-kills id kills`, "", false, player);
                        return
                    }

                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                        }
                        else {
                            sendConsoleResponse("Set Kills", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    DiscordBot.Logs(player, command, targetPlayer, 'set-kill', null, null, null, args[1])
                    targetPlayer.gameProfile.kills = Number(args[1])
                    sendConsoleResponse("Set Kills", `sucessfully set ${targetPlayer.gameProfile.name} kills to ${args[1]}`, "", true, player);
                    break;
                }
                case commands.SETADMIN: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Set Admin", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                        }
                        else {
                            sendConsoleResponse("Set Admin Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    DiscordBot.Logs(player, command, targetPlayer)
                    targetPlayer.isAdmin = true;
                    targetPlayer.god = true;
                    sendConsoleResponse("Set Admin Command", `sucessfully granted admin rights to ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", true, player);
                    break;
                }
                case commands.REM_ADMIN: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Unset Admin Command", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                        }
                        else {
                            sendConsoleResponse("Unset Admin Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    DiscordBot.Logs(player, command, targetPlayer)
                    targetPlayer.isAdmin = false;
                    targetPlayer.isOwner = false;
                    targetPlayer.god = false;
                    targetPlayer.isMod = false;
                    targetPlayer.staffAllowed = false;
                    targetPlayer.ism = false;
                    sendConsoleResponse("Unset Admin Command", `sucessfully revoked admin rights from ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", true, player);
                    break;
                }
                case commands.FREEZE: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Freeze Command", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, "You have been freezed."]);
                        }
                        else {
                            sendConsoleResponse("Freeze Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    DiscordBot.Logs(player, command, targetPlayer)
                    targetPlayer.action = Action_1.Action.IDLE;
                    targetPlayer.speed = 0;
                    targetPlayer.isFrozen = true;
                    sendConsoleResponse("Freeze Command", `sucessfully froze ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", true, player);
                    break;
                }
                case commands.UNFREEZE: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Unfreeze Command", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    if (args.length > 0) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            targetPlayer = foundPlayer;
                            foundPlayer.controller.sendJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, "You have been unfreezed!"]);
                        }
                        else {
                            sendConsoleResponse("Unfreeze Command", `couldnt find player by param ${args[0]}`, "", false, player);
                            return;
                        }
                    }
                    DiscordBot.Logs(player, command, targetPlayer)
                    targetPlayer.isFrozen = false;
                    sendConsoleResponse("Unfreeze Command", `sucessfully unfroze ${args.length <= 0 ? player.gameProfile.name : targetPlayer.gameProfile.name}`, "", true, player);
                    break;
                }
                case commands.SETLVL: {
                    if (!player.isAdmin) {
                        sendConsoleResponse("Set Kill Command", `This command is for admins only!`, "", false, player);
                        return;
                    }
                    if (args.length > 1) {
                        let foundPlayer = findPlayerByIdOrName(args[0], player.gameServer);
                        if (foundPlayer) {
                            let newLevel = parseInt(args[1]);
                            foundPlayer.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, foundPlayer.id, foundPlayer.gameProfile.skin, 0, 0, 0, 0, 0, newLevel]));
                            DiscordBot.Logs(player, command, foundPlayer)
                            sendConsoleResponse("Set Level Command", `Player ${foundPlayer.gameProfile.name}'s level has been set to ${newLevel}.`, "", true, player);
                        }
                        else {
                            sendConsoleResponse("Set Level Command", `Could not find player by the provided parameter: ${args[0]}.`, "", false, player);
                        }
                    }
                    else {
                        sendConsoleResponse("Set Level Command", "Please provide player name or ID and the new level.", "", false, player);
                    }
                    break;
                }
            }
        }
    }
    exports.ConsoleManager = ConsoleManager;
    function findPlayerByIdOrName(data, gameServer) {
        let mode = 0;
        if (!isNaN(data))
            mode = 1;
        for (const player of gameServer.players.values()) {
            if (mode == 0) {
                if (player.gameProfile.name == data)
                    return player;
            }
            if (mode == 1) {
                if (player.id == Number(data))
                    return player;
            }
        }
    }
    exports.findPlayerByIdOrName = findPlayerByIdOrName;
    function sendConsoleResponse(header = "some header", description = "", desc2 = "", state = false, player, addictionalData = null) {
        if (addictionalData == null)
            player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ConsoleCommandResponse, header, state, description, desc2]);
        else
            player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ConsoleCommandResponse, header, state, description, desc2, addictionalData]);
    }
    exports.sendConsoleResponse = sendConsoleResponse;
    function createHTMLArray(datas) {
        var content = '<table class=\"tableList\">';
        for (var i = 0; i < datas.length; i++) {
            if ((i % 3) === 0)
                content += '<tr>';
            content += ('<td class=\"tableList\">' + datas[i]) + '</td>';
            if ((((i + 1) % 3) === 0) || ((i + 1) === datas.length))
                content += '</tr>';
        }
        content += '</table>';
        return content;
    }
    exports.createHTMLArray = createHTMLArray;
}, 1000);