"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBot = void 0;

const { Client, GatewayIntentBits, Interaction, EmbedBuilder } = require("discord.js");
const KitsManager_1 = require("./Bot");
const { Loggers } = require('../logs/Logger');
const Commands = require("./AppData/commands.json");
const Config = require("./AppData/config.json");
const Admin = require("./AppData/admin.json");
const AdminLogins_1 = require("../discord-bot/AdminLogins");
const itemsmanager_1 = require("../utils/itemsmanager");
const AdminIds_1 = require("../enums/AdminIds");

class DiscordBot {
    static GameServer;
    static client;
    static AdminKey
    static ModKey
    static _send = DiscordBot.send;

    constructor(GameServer) {
        DiscordBot.GameServer = GameServer;
        DiscordBot.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        });
        DiscordBot.start()
    }

    static send(serverId, channelId, message, embed) {
        const guild = DiscordBot.client.guilds.cache.get(serverId);

        if (!guild) {
            return;
        }

        const channel = guild.channels.cache.get(channelId);

        if (!channel) {
            return;
        }

        if (embed) {
            if (message.ping) {
                channel.send("@everyone")
            }
            const embed = new EmbedBuilder().setTitle(message.title).setDescription(message.desc).setColor(message.color);
            channel.send({ embeds: [embed] });
            return;
        }

        channel.send(message);
    }

    static edit(serverId, channelId, messageId, newMessage) {
        const guild = DiscordBot.client.guilds.cache.get(serverId);
        const channel = guild.channels.cache.get(channelId);

        if (!guild) {
            return;
        }
        if (!channel) {
            return;
        }

        channel.messages.fetch(messageId)
            .then(message => {
                message.edit(newMessage);
            })
            .catch(error => {
                console.error('Error editing message:', error);
            });
    }


    static Logs(user, command, target, type, interaction, kit_type, item, count) {
        let Channel = Config.Log_Channel;
        let Server = Config.Log_Guild;
        let Message_To_Send;

        switch (type) {
            case 'manager': {} 
            case 'janitor': {} 
            case 'architect':
                Custom_Message(type)
                break;
            case 'booster':
                Custom_Message(type)
                break;
            case 'give':
                Custom_Message(type)
                break;
            case 'give-all':
                Custom_Message(type)
                break;
            case 'OwnerLogin':
                Custom_Message(type)
                break;
            case 'AdminLogin':
                Custom_Message(type)
                break;
            case 'Drop':
                Custom_Message(type)
                break;
            case 'Chest':
                Custom_Message(type)
                break;
            default:
                Default_Message()
                break;
        }

        function Default_Message() {
            if (!target) {
                Message_To_Send = '`' + `${user.gameProfile.name}[${user.id}] has used ${command}` + '`';
            } else {
                Message_To_Send = '`' + `${user.gameProfile.name}[${user.id}] has used ${command} on ${target.gameProfile.name}[${target.id}]` + '`';
            }
        }

        function Custom_Message(origin) {
            switch (origin) {
                case 'OwnerLogin':
                    Message_To_Send = '`' + `${user} Has logged in as Owner on the player ${target.gameProfile.name}[${target.id}]` + '`';
                    break;

                case 'AdminLogin':
                    Message_To_Send = '`' + `${user} Has logged in as Admin on the player ${target.gameProfile.name}[${target.id}]` + '`';
                    break;

                case 'manager': {}
                case 'janitor': {}
                case 'architect':
                    Channel = Config.ModLog;
                    Message_To_Send = `<@${interaction.member.id}>` + '`' + `has used ${kit_type} Kit on ${target.gameProfile.name}[${target.id}]` + '`';
                    break;

                case 'booster':
                    Channel = Config.Booster_Log;
                    Message_To_Send = `<@${interaction.member.id}>` + '`' + `has used ${kit_type} Kit on ${target.gameProfile.name}[${target.id}]` + '`';
                    break;

                case 'give':
                    Message_To_Send = '`' + `${user.gameProfile.name}[${user.id}] has given ${count} ${item} to ${target.gameProfile.name}[${target.id}]` + '`';
                    break;

                case 'give-all':
                    Message_To_Send = '`' + `${user.gameProfile.name}[${user.id}] has given ${count} ${item} to everyone` + '`';
                    break;

                case 'Drop':
                    if (!item || !item[0] || !item[0][0] || !item[0][1]) {
                        return;
                    }
                    let dropped = itemsmanager_1.ItemUtils.getItemById(item[0][0])
                    if (!dropped)
                        return;
                    let drop = dropped.name
                    Message_To_Send = '`' + `${user.gameProfile.name}[${user.id}] has dropped ${item[0][1]} ${drop} picked up by ${target.gameProfile.name}[${target.id}]` + '`';
                    break;

                case 'Chest':
                    if (!item) {
                        return;
                    }
                    let chest_ = itemsmanager_1.ItemUtils.getItemById(item[0])
                    if (!chest_)
                        return;
                    let drop_ = chest_.name
                    Message_To_Send = '`' + `${target.gameProfile.name}[${target.id}] has taken ${item[1]} ${drop_} from chest, placed by ${user.gameProfile.name}[${user.id}]` + '`';
                    break;

            }
        }

        if (Server, Channel, Message_To_Send) this.send(Server, Channel, Message_To_Send);
    }

    static admin_login(Interaction) {
        let id;
        let type;
        let name = Interaction.member.user.username;
        let Member_ID = Interaction.member.id


        function Check_Type() {
            let Roles = Interaction.member.roles.cache.map(role => role.id);
            if (AdminLogins_1.AdminLogins.CheckStaff(Interaction)) {
                if (Config.Owners.includes(Interaction.member.id) || Config.Owners.includes(Interaction.member.id)) {
                    type = 'Owner'
                } else if (Admin.Admin_Auth.some(Role => Roles.includes(Role))) {
                    type = 'Admin'
                }
            }
        }

        Check_Type()

        for (let i = 0; i < Interaction.options._hoistedOptions.length; i++) {
            const option = Interaction.options._hoistedOptions[i];
            if (option.name === 'id') {
                id = option.value;
            }
        }


        switch (type) {
            case 'Owner':
                return AdminLogins_1.AdminLogins.Login(id, type, name, DiscordBot.GameServer, Member_ID)

            case 'Admin':
                return AdminLogins_1.AdminLogins.Login(id, type, name, DiscordBot.GameServer, Member_ID)

            default:
                return 'You are not authorizied to use this command.'
        }

    }


    static start() {
        DiscordBot.client.once('ready', async () => {
            try {
                const promises = Config.Guilds.map(async (guildId) => {
                    const server = DiscordBot.client.guilds.resolve(guildId);
                    if (!server) {
                        console.log(`Server with ID ${guildId} not found.`);
                        return;
                    }

                    await server.commands.set(Commands).then(() => {
                        Loggers.app.info('Discord Bot Setup');
                    });
                });

                await Promise.all(promises);

            } catch (error) {
                console.log(error)
            }
        });

        DiscordBot.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            switch (interaction.commandName) {
                case 'manager': {}
                case 'janitor': {}
                case 'architect':
                    interaction.reply(KitsManager_1.KitsManager.INTERAC(interaction, DiscordBot.GameServer, DiscordBot))
                    break;
                case 'booster':
                    interaction.reply(KitsManager_1.KitsManager.INTERAC(interaction, DiscordBot.GameServer, DiscordBot))
                    break;
            }
        })

        DiscordBot.client.login(Config.Token);
    }
}


exports.DiscordBot = DiscordBot;
