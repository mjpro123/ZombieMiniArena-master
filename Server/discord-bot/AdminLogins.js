"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLogins = void 0;

const AdminIds_1 = require("../enums/AdminIds");
const Config = require("./AppData/config.json");
const Admin_Config = require("./AppData/admin.json");
const KitsManager_1 = require("./Bot");
const Arena_1 = require('../models/ArenaManager');
const ConsoleManager_1 = require("../models/ConsoleManager");
const fs = require('fs');
const path = require('path');
const { ItemIds } = require("../enums/ItemIds");

class AdminLogins {
    static verify_keys = {};
    static LoginStats = true;
    static LoggedIn = {}

    static ProtectionMode(gameServer) {
        if (this.LoginStats) {
            this.LoginStats = false;

            gameServer.players.forEach(player => {
                let cleared = false;
                let admin = false;
                let itemsArray = player.inventory.toArray()

                for (let i = 0; i < itemsArray.length; i++) {
                    let item = itemsArray[i][0];
                    let amount = itemsArray[i][1];

                    if (player.isAdmin || player.isMod || player.isTrial || player.staffAllowed) {
                        admin = true;
                        player.inventory.removeItem(item, Number(amount));
                    }

                    for (const adminItem in AdminIds_1.AdminIds) {
                        let AdminItem = AdminIds_1.AdminIds[adminItem];
                        if (
                            (player.hat == AdminItem || player.right == AdminItem || player.extra == AdminItem) &&
                            !cleared
                        ) {
                            Arena_1.ArenaManager.Clear(player);
                        }
                    }
                }

                if (admin) {
                    player.god = false;
                    player.isAdmin = false;
                    player.isMod = false;
                    player.isTrial = false;
                    player.speed = 24
                }
            })

            return 'Successfully cleared all players and locked admin/mod! Only owners can login!'
        } else {
            this.LoginStats = true;
            return 'Successfully unlocked admin/mod! Everyone can login again.'
        }
    }

    static GenerateRandomKey(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomKey = '';
        for (let i = 0; i < length; i++) {
            randomKey += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomKey;
    }

    static SEARCH(interaction, gameServer) {
        let item;

        for (let i = 0; i < interaction.options._hoistedOptions.length; i++) {
            const option = interaction.options._hoistedOptions[i];
            if (option.name === 'item') {
                item = option.value;
            }
        }

        item = item.toString().toUpperCase()
        const ITEM = ItemIds[item]

        if (!ITEM) {
            return `${item} Is not a valid item`
        }

        let string = '';

        gameServer.players.forEach(player => {
            if (player.inventory.containsItem(ITEM)) {
                string += `${player.gameProfile.name} | ${player.id} has ${player.inventory.countItem(ITEM)} ${item}\n`;
            }
        });

        return string;
    }

    static SaveConfig(type, s, id) {
        let config_;
        let fileContents;
        let filePath;
        type = type.toLowerCase()
        type === 'admin' || type == 'mod' || type == 'trial' ? (config_ = Admin_Config, filePath = path.join(__dirname, 'AppData', 'admin.json'))
            : type === 'config' ? (config_ = Config, filePath = path.join(__dirname, 'AppData', 'config.json')) : type;

        if (!config_) {
            return 'Failure To Load Config';
        }

        fileContents = fs.readFileSync(filePath, 'utf8');

        if (!fileContents) {
            return 'Failure to Save Config';
        }

        const currentConfig = JSON.parse(fileContents);

        if (JSON.stringify(currentConfig) !== JSON.stringify(config_)) {
            const updatedConfigJSON = JSON.stringify(config_, null, 2);
            fs.writeFileSync(filePath, updatedConfigJSON, 'utf8');
        }

        return `Successfuly ${s ? 'Assigned' : 'Removed'} ${type} ${s ? 'to' : 'from'} <@&${id}>`
    }

    static CheckStaff(interaction) {
        if (KitsManager_1.KitsManager.Check_Owners(interaction)) {
            return true;
        }
        let Roles = interaction.member.roles.cache.map(role => role.id);
        let Member_ID = interaction.member.id;

        if (Roles.some(role => Config.Staff_Whitelist.includes(role))) {
            return true;
        }
        return false;
    }


    static setOwners(interaction) {
        let id;
        let found = false;
        for (let i = 0; i < interaction.options._hoistedOptions.length; i++) {
            const option = interaction.options._hoistedOptions[i];
            if (option.name === 'id') {
                id = option.value;
            }
        }

        for (let i = 0; i < Config.Owners.length; i++) {
            if (id == Config.Owners[i]) {
                found = true;
            }
        }
        if (found) {
            return 'User is already a bot owner'
        }

        Config.Owners.push(id)
        this.SaveConfig('config', false, id)
        return `Successfully added <@${id}> to bot owners`;
    }


    static SetAdmin(interaction) {

        let type;
        let id;
        let found = false;
        for (let i = 0; i < interaction.options._hoistedOptions.length; i++) {
            const option = interaction.options._hoistedOptions[i];
            if (option.name === 'type') {
                type = option.value;
            }
            if (option.name === 'role-id') {
                id = option.value;
            }
        }

        switch (type) {
            case 'MOD':
                for (let i = 0; i < Admin_Config.Mod_Auth.length; i++) {
                    if (Admin_Config.Mod_Auth[i] == id) {
                        found = true;
                    }
                }
                if (found) {
                    return `This role already exists in mods`
                }
                Admin_Config.Mod_Auth.push(id)
                break;

            case 'ADMIN':
                for (let i = 0; i < Admin_Config.Admin_Auth.length; i++) {
                    if (Admin_Config.Admin_Auth[i] == id) {
                        found = true;
                    }
                }
                if (found) {
                    return `This role already exists in admins`
                }
                Admin_Config.Admin_Auth.push(id)
                break;
            case 'TRIAL':
                for (let i = 0; i < Admin_Config.Trial_Auth.length; i++) {
                    if (Admin_Config.Trial_Auth[i] == id) {
                        found = true;
                    }
                }
                if (found) {
                    return `This role already exists in admins`
                }
                Admin_Config.Trial_Auth.push(id)
                break;
        }

        return (this.SaveConfig(type, true, id))
    }

    static RemoveAdmin(interaction) {

        let type;
        let id;
        let found = false;

        for (let i = 0; i < interaction.options._hoistedOptions.length; i++) {
            const option = interaction.options._hoistedOptions[i];
            if (option.name === 'type') {
                type = option.value;
            }
            if (option.name === 'role-id') {
                id = option.value;
            }
        }



        switch (type) {
            case 'MOD':
                for (let i = 0; i < Admin_Config.Mod_Auth.length; i++) {
                    if (Admin_Config.Mod_Auth[i] == id) {
                        found = true;
                        delete Admin_Config.Mod_Auth[i];
                    }
                }
                if (!found) {
                    return `<@&${id}> does not exist in ${type.toLowerCase()}s`
                }
                Admin_Config.Mod_Auth.splice(Admin_Config.Mod_Auth.indexOf(id), 1);
                break;

            case 'ADMIN':
                for (let i = 0; i < Admin_Config.Admin_Auth.length; i++) {
                    if (Admin_Config.Admin_Auth[i] == id) {
                        found = true;
                    }
                }
                if (!found) {
                    return `<@&${id}> does not exist in ${type.toLowerCase()}s`
                }
                Admin_Config.Admin_Auth.splice(Admin_Config.Admin_Auth.indexOf(id), 1);
                break;
            case 'TRIAL':
                for (let i = 0; i < Admin_Config.Trial_Auth.length; i++) {
                    if (Admin_Config.Trial_Auth[i] == id) {
                        found = true;
                    }
                }
                if (!found) {
                    return `<@&${id}> does not exist in ${type.toLowerCase()}s`
                }
                Admin_Config.Trial_Auth.splice(Admin_Config.Trial_Auth.indexOf(id), 1);
                break;
        }

        return (this.SaveConfig(type, false, id))
    }


    static Login(id, type, name, gameServer, Member_ID) {
        if (this.LoginStats || Config.Owners.includes(Member_ID)) {
            let player = ConsoleManager_1.findPlayerByIdOrName(Number(id), gameServer)
            let message;
            if (!player) {
                return 'Failed to Find The Player [AUTH]'
            }
            if (!player.isAdmin && !player.isMod) {
                let key = this.GenerateRandomKey(6);
                if (this.LoggedIn[Member_ID]?.logging) {
                    message = `Cancelled your previous logging session! You can login in new session with [${key}]`
                    let id = this.LoggedIn[Member_ID].id
                    let target = ConsoleManager_1.findPlayerByIdOrName(Number(id), gameServer)
                    if (target) {
                        target.pendingAdmin = false;
                        target.pendingMod = false;
                        target.pendingTrial = false;
                        target.pendingOwner = false;
                    }
                    delete this.LoggedIn[Member_ID]
                } else {
                    message = `Go to game console and paste the key [${key}] to complete login!`
                }
                this.verify_keys[player.id] = {};
                this.verify_keys[player.id].access = key;
                this.verify_keys[player.id].name = name;

                if (!this.LoggedIn[Member_ID]) {
                    this.LoggedIn[Member_ID] = {}
                    this.LoggedIn[Member_ID].id = player.id
                    this.LoggedIn[Member_ID].logged = false;
                    this.LoggedIn[Member_ID].logging = true;
                    player.discord = Member_ID;
                } else {
                    if (this.LoggedIn[Member_ID].logged) {
                        let target = ConsoleManager_1.findPlayerByIdOrName(Number(this.LoggedIn[Member_ID].id), gameServer)
                        if (target) {
                            let itemsArray = target.inventory.toArray()

                            for (let i = 0; i < itemsArray.length; i++) {
                                let item = itemsArray[i][0];
                                let amount = itemsArray[i][1];

                                player.inventory.removeItem(item, amount)
                            }
                            target.god = false;
                            target.health = 0;
                            target.updateHealth()
                        }
                        this.LoggedIn[Member_ID] = {}
                        this.LoggedIn[Member_ID].id = player.id
                        this.LoggedIn[Member_ID].logged = false;
                        this.LoggedIn[Member_ID].logging = true;
                        player.discord = Member_ID;
                        message = `Cleared Your Previous Admin Token! Go to game console and paste the key [${key}] to complete login!`
                    }
                }

                if (type == 'Admin') player.pendingAdmin = true;
                if (type == 'Trial') player.pendingTrial = true;
                if (type == 'Mod') player.pendingMod = true;

                if (type == 'Owner') {
                    player.pendingAdmin = true;
                    player.pendingOwner = true;
                }
                return message
            } else {
                return `You've already logged in!`
            }
        } else {
            return 'Login is disabled! You cannot login.'
        }
    }



    static verify(player, key, type, Discord, check) {
        let auth = this.verify_keys[player.id]
        if (auth) {
            if (auth.access == key) {
                player.god = true;
                if (type == 'Owner') {
                    player.pendingMod = false;
                    player.pendingAdmin = false;
                    player.pendingOwner = false;
                    player.isAdmin = true;
                    player.isOwner = true;
                    if (!check) Discord.Logs(auth.name, null, player, 'OwnerLogin')
                    return `You've successfully logged into owner`
                } else if (type == 'Admin') {
                    player.pendingMod = false;
                    player.pendingAdmin = false;
                    player.isAdmin = true;
                    if (!check) Discord.Logs(auth.name, null, player, 'AdminLogin')
                    return `You've successfully logged into admin`
                }
            } else {
                return `Make sure you've entered the correct key from the discord login`
            }

        } else {
            return `You haven't completed discord login or entered wrong id!`
        }
    }
}
exports.AdminLogins = AdminLogins;