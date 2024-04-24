"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitsManager = void 0;


const ItemIds_1 = require("../enums/ItemIds");
const kits = require("../discord-bot/AppData/kits.json");
const Config = require("./AppData/config.json");
const fs = require('fs');
const path = require('path');
const ConsoleManager_1 = require("../models/ConsoleManager");
const AdminLogins_1 = require("../discord-bot/AdminLogins");
const { Utils } = require("../utils/Utils");
const PacketType_1 = require("../enums/PacketType");
const db = require('./db.js');


class KitsManager {
    static GameServer
    static Cooldown = []

    constructor(GameServer) {
        KitsManager.GameServer = GameServer;
    }

    static USE(Intercation, GameServer, sourcePlayer) {
        return Use(Intercation, GameServer, sourcePlayer);
    }

    static PURCHASE(Intercation, GameServer, sourcePlayer) {
        return Purchase(Intercation, GameServer, sourcePlayer);
    }

    static INTERAC(Intercation, GameServer, sourcePlayer) {
        return Kit_Intercation(Intercation, GameServer, sourcePlayer);
    }

    static Add_CoolDown(Interaction) {
        let Member_ID = Interaction.member.id;
        this.Cooldown[Member_ID] = {}
        this.Cooldown[Member_ID].Time = performance.now()
    }

    static Check_CoolDown(Interaction) {
        let Member_ID = Interaction.member.id;

        if (Config.Owners.includes(Member_ID)) return true;

        if (this.Cooldown[Member_ID]) {
            let lastUsed = this.Cooldown[Member_ID]?.Time || 0;
            if (this.Check_Booster(Interaction)) {
                if (performance.now() - lastUsed >= Config.Delay_Time) {
                    this.Cooldown[Member_ID].Time = performance.now()
                    return true;
                }
            };
            return false;
        } else {
            this.Cooldown[Member_ID] = {}
            this.Cooldown[Member_ID].Time = performance.now()
            return true;
        }
    }


    static Check_Owners(Interaction) {
        let Member_ID = Interaction.member.id;
        if (Config.Owners.includes(Member_ID)) {
            return true;
        } else {
            return false;
        }
    }

    static Shop_Owners(Interaction) {
        let Member_ID = Interaction.member.id;
        if (Config.Owners.includes(Member_ID) || Config.ShopOwner.includes(Member_ID)) {
            return true;
        } else {
            return false;
        }
    }

    static Check_CoOwners(Interaction) {
        let Roles = Interaction.member.roles.cache.map(role => role.id);
        let Member_ID = Interaction.member.id;
        if (Config.CoOwners.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
            return true;
        } else {
            return false;
        }
    }

    static Check_Admin(Interaction, role) {
        let Roles = Interaction.member.roles.cache.map(role => role.id);
        let Member_ID = Interaction.member.id;

        if (this.Check_Owners(Interaction)) {
            return true;
        }
        switch (role) {
            case 'admin':
            if (AdminLogins_1.AdminLogins.CheckStaff(Interaction)) {
                if (Config.Admins_Roles.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
                    return true;
                }
            }
            break;
            case 'architect':
            if (AdminLogins_1.AdminLogins.CheckStaff(Interaction)) {
                if (Config.Architect.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
                    return true;
                }
            }
            break;
            case 'janitor':
            if (AdminLogins_1.AdminLogins.CheckStaff(Interaction)) {
                if (Config.Janitor.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
                    return true;
                }
            }
            break;
            case 'manager':
            if (AdminLogins_1.AdminLogins.CheckStaff(Interaction)) {
                if (Config.Manager.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
                    return true;
                }
            }
            break;
    }

    return false;

    }

    static Check_Booster(Interaction) {

        let hasBoosterRole = Interaction.member.roles.cache.some(role => role.name === 'booster');

        if (hasBoosterRole || Config.Owners.includes(Interaction.member.id)) return true;
        else return false;

    }

    static VERIFY(Intercation, KIT_TYPE) {
        switch (KIT_TYPE) {
            case 'architect':
                if (this.Check_Admin(Intercation, 'architect')) {
                    return { Verify_Result: true, gem: true }
                } else {
                    return { Verify_Result: false, Reason: '`' + 'You dont Have The Required Permissions!' + '`' };
                }
                break;
            case 'janitor':
                if (this.Check_Admin(Intercation, 'janitor')) {
                    return { Verify_Result: true, gem: true }
                } else {
                    return { Verify_Result: false, Reason: '`' + 'You dont Have The Required Permissions!' + '`' };
                }
                break;
            case 'manager':
                if (this.Check_Admin(Intercation, 'manager')) {
                    return { Verify_Result: true, gem: true }
                } else {
                    return { Verify_Result: false, Reason: '`' + 'You dont Have The Required Permissions!' + '`' };
                }
                break;
            case 'booster':
                if (this.Check_Booster(Intercation)) {
                    if (this.Check_CoolDown(Intercation)) {
                        return { Verify_Result: true, gem: true }
                    } else {
                        let remainingTime = Config.Delay_Time - (performance.now() - this.Cooldown[Intercation.member.id].Time);
                        let requiredTime = Math.round(remainingTime / 60000);
                        let timeUnit = "minutes";
                        if (requiredTime === 0) {
                            requiredTime = Math.round(remainingTime / 1000);
                            timeUnit = "seconds";
                        }
                        return { Verify_Result: false, Reason: '`' + `${requiredTime} ${timeUnit} remaining before you can use the bot!` + '`', gem: true };
                    }
                } else {
                    return { Verify_Result: false, Reason: '`' + 'You dont Have The Required Permissions!' + '`' }
                }
                break;
        }
    }

    static BOOSTER(sourcePlayer, gem) {
        kits.booster.forEach(({ name, amount }) => {
            if (!gem) {
                if (Utils.isGem(ItemIds_1.ItemIds[name])) {
                    return;
                }
            }
            sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount);
        });
    }

    static ADMKIT(sourcePlayer, type, gem) {
        switch(type) {
            case 'manager':
            kits.manager.forEach(({ name, amount }) => {
             if (!gem) {
                 if (Utils.isGem(ItemIds_1.ItemIds[name])) {
                     return;
                 }
             }
             sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount);
            });
            sourcePlayer.isAdmin = true;
            sourcePlayer.god = true
            break;
            case 'janitor':
            kits.janitor.forEach(({ name, amount }) => {
             if (!gem) {
                 if (Utils.isGem(ItemIds_1.ItemIds[name])) {
                     return;
                 }
             }
             sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount);
            });
            sourcePlayer.staffAllowed = true;
            sourcePlayer.god = true
            break;
            case 'architect':
            kits.architect.forEach(({ name, amount }) => {
             if (!gem) {
                 if (Utils.isGem(ItemIds_1.ItemIds[name])) {
                     return;
                 }
             }
             sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount);
            });
            sourcePlayer.staffAllowed = true;
            sourcePlayer.god = true
            break;
        };
    }
}

function fancy(name, amount) {
    var s=amount>1?'s':'';
    switch (name) {
        case 'midas':
            return (`Midas Kit${s}`);
            break;
        case 'blue_crown':
            return (`Blue Crown${s}`);
            break;
        case 'boostkit':
            return (`Booster Kit${s}`);
            break;
        case 'firefly':
            return (`Fire${s==='s'?'flies':'fly'}`);
            break;
        case 'flowerhat':
            return (`Flower Hat${s}`);
            break;
        case 'bgems':
            return (`Blue Gem${s}`);
            break;
        case 'crownkit':
            return (`Crown Kit${s}`);
            break;
    }
}

function Use(Interaction, GameServer, DiscordBot) {
    const data = db.get(`${Interaction.user.id}${Interaction.guildId}`);

    if (!data || data == [] || data == "None" || data == "") {
        return `You need to purchase **an item** before using this!`;
    } else 
    {

    var AllData = data.split(" ");

    const id = Interaction.options.data[2].value;

    const Player = ConsoleManager_1.findPlayerByIdOrName(Number(id), GameServer);

    if (!Player) return '`' + 'ID: [' + Number(id) + '] **Not Found**!' + '`';

    var amountUsed = Interaction.options.data[0].value;

    if (Number(amountUsed) < 1) return `You must pick a value above **0!**`;

    var item = Interaction.options.data[1].value;
    var found = false;

    for (let i = 1; i < AllData.length; i+=2) {
        const fullData = AllData[i]+" "+AllData[i+1];
        if (item === AllData[i+1]) {
            found = true;
            if (Number(amountUsed) > Number(AllData[i])) {
                return `You cannot use **${amountUsed}** amount of **${item}** because you only have **${AllData[i]}** amount!`
            } else {
                var amount = null;
                if ((Number(AllData[i]) - Number(amountUsed)) === 0) {
                    amount = '';
                } else {
                    amount = (" "+(Number(AllData[i]) - Number(amountUsed)) + " " + item);
                }

                const replica = data.replace(' '+fullData, amount);

                db.set(`${Interaction.user.id}${Interaction.guildId}`, `${replica}`)
            };
        };
    };

    if(!found) {
        return `You need to purchase **${fancy(item, 0)}** before using this!`;
    };

    switch(item) {
        case 'midas':
            kits.midas.forEach(({ name, amount }) => {
                Player.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount * Number(amountUsed));
            });
            break;
        case 'blue_crown':
                Player.inventory.addItem(ItemIds_1.ItemIds.CROWN_BLUE, Number(amountUsed));
            break;
        case 'boostkit':
            kits.booster.forEach(({ name, amount }) => {
                Player.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount * Number(amountUsed));
            });   
            break;
        case 'firefly':
                Player.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, Number(amountUsed));
            break;
        case 'flowerhat':
                Player.inventory.addItem(ItemIds_1.ItemIds.FLOWER_HAT, Number(amountUsed));
            break;
        case 'bgems':
                Player.inventory.addItem(ItemIds_1.ItemIds.GEMME_BLUE, Number(amountUsed));
            break;
        case 'crownkit':
            kits.crownkit.forEach(({ name, amount }) => {
                Player.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount * Number(amountUsed));
            }); 
            break;
    }
    
    return `Successfully Used **${amountUsed} ${fancy(item, amountUsed)}** on **ID: [${id}]**`;
    };
};


function Purchase(Interaction, GameServer, DiscordBot) {
    if(!KitsManager.Shop_Owners(Interaction)) return '`' + `You need to be a **Shop Owner / Game Owner**!` + '`';
    var data = db.get(`${Interaction.user.id}${Interaction.guildId}`);

    if (!data || data == [] || data == "") {
        data = "";
    };

    var setted = false;
    var AllData = data.split(" ");
    var item = Interaction.options.data[1].value;

    for (let i = 1; i < AllData.length; i+=2) {
        const fullData = AllData[i]+" "+AllData[i+1];
        if (item === AllData[i+1]) {
            const replica = data.replace(' '+fullData, ' ' + Number(Interaction.options.data[2].value) + Number(AllData[i]) + ' ' + AllData[i+1]);
            db.set(`${Interaction.user.id}${Interaction.guildId}`, `${replica}`);
            setted = true;
        };
    };

    if (!setted) {
        db.set(`${Interaction.options.data[0].user.id}${Interaction.guildId}`, `${data} ${Interaction.options.data[2].value} ${Interaction.options.data[1].value}`)
    };

    return `Successfully Added **${Interaction.options.data[2].value} ${fancy(Interaction.options.data[1].value, Number(Interaction.options.data[2].value))}** To **[${Interaction.options.data[0].user}]**!`;
}

function Kit_Intercation(Intercation, GameServer, DiscordBot) {
    let KIT_TYPE = Intercation.commandName;
    let PLAYER_ID;

    if (Config.Booster_Channel != Intercation.channel.id && !KitsManager.Check_Owners(Intercation)) return '`' + `${KIT_TYPE} Command Does't Work Here!` + '`';

    for (let i = 0; i < Intercation.options._hoistedOptions.length; i++) {
        const option = Intercation.options._hoistedOptions[i];
        if (option.name === 'id') {
            PLAYER_ID = option.value;
        }
    }

    const Player = ConsoleManager_1.findPlayerByIdOrName(Number(PLAYER_ID), GameServer)

    if (!Player) return '`' + 'ID: [' + Number(PLAYER_ID) + '] Not Found!' + '`';

    switch (KIT_TYPE) {
        case 'manager': {
            if (KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']) {
                KitsManager.ADMKIT(Player, KIT_TYPE, KitsManager.VERIFY(Intercation, KIT_TYPE)['gem'])
                DiscordBot.Logs(null, null, Player, 'manager', Intercation, KIT_TYPE)
                return '`' + 'Manager Kit Added SuccessFully To ID: ' + `[${PLAYER_ID}]` + '`';
            } else return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
        }
        break;
        case 'janitor': {
            if (KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']) {
                KitsManager.ADMKIT(Player, KIT_TYPE, KitsManager.VERIFY(Intercation, KIT_TYPE)['gem'])
                DiscordBot.Logs(null, null, Player, 'janitor', Intercation, KIT_TYPE)
                return '`' + 'Janitor Kit Added SuccessFully To ID: ' + `[${PLAYER_ID}]` + '`';
            } else return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
        }
        break;
        case 'architect': {
            if (KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']) {
                KitsManager.ADMKIT(Player, KIT_TYPE, KitsManager.VERIFY(Intercation, KIT_TYPE)['gem'])
                DiscordBot.Logs(null, null, Player, 'architect', Intercation, KIT_TYPE)
                return '`' + 'Architect Kit Added SuccessFully To ID: ' + `[${PLAYER_ID}]` + '`';
            } else return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
        }
        break;
        case 'booster':
            if (KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']) {
                KitsManager.BOOSTER(Player, KitsManager.VERIFY(Intercation, KIT_TYPE)['gem'])
                DiscordBot.Logs(null, null, Player, 'booster', Intercation, KIT_TYPE)
                KitsManager.Add_CoolDown(Intercation);
                GameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Gave Booster Kit To: ${Player.gameProfile.name}[${Player.id}]`]);
                return '`' + 'Booster Kit Added SuccessFully To ID: ' + `[${PLAYER_ID}]` + '`';
            } else return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
        break;
    }

}

exports.KitsManager = KitsManager;