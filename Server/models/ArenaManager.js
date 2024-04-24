"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArenaManager = void 0;

const Player_1 = require("../entity/Player");
const PacketType_1 = require("../enums/PacketType");
const ItemIds_1 = require("../enums/ItemIds");
const Building_1 = require("../entity/Building");
const bufferReader_1 = require("../utils/bufferReader");
const ConsoleManager_1 = require("../models/ConsoleManager");
class ArenaManager {
    static Enabled = false;
    static Started = false;
    static countdownInterval = null;
    static teleporterInterval = null;
    static StartInterval = null;
    static ChosenReward = null;
    static UNEQUIP_PACKET = 7;

    static Mode = {
        WinItAll: 'Win It All'
    }

    static Rewards = {
        Select: {
            First: {
                Max: 5
            },
            Second: {
                Min: 5,
                Max: 10
            },
            Max: {
                Min: 10
            }
        },

        FirstReward: {
            CANDY: 10
        },
        SecondReward: {
            GEMME_ORANGE: 1
        },
        MaximumReward: {
            GEMME_BLUE: 1
        }
    }

    static _Arena = {
        Allowed_Items: [
            ItemIds_1.ItemIds.DRAGON_SWORD,
            ItemIds_1.ItemIds.DRAGON_SPEAR,
            ItemIds_1.ItemIds.DRAGON_HELMET,
            ItemIds_1.ItemIds.BANDAGE,
            this.UNEQUIP_PACKET
        ],
        Arena_Duration: {
            Time: 240,
            Start: 0,
            Now: 0,
        },
        max_players: 16,
        Winner: "",
        Left: 1500,
        Right: 1650,
        Top: 3100,
        Bottom: 3250,
        Teleporter_X: 7100,
        Teleporter_Y: 8550,
        Players_Amount: 0,
        Attempts: 0,
        Interval: 1000,
        Timeout: 14000,
        Items: {
            DRAGON_SWORD: 1,
            DRAGON_HELMET: 1,
            BANDAGE: 10,
            DRAGON_SPEAR: 1,
        },
        Buildings: {

        },
        Team: {
            Red: 0,
            Blue: 0,
            LastRed: 0,
            LastBlue: 0
        },
        Zone: {
            x1: 700,
            y1: 3200,
            x2: 1200,
            y2: 3200
        },
        PvPZone: {
            Left: 500,
            Top: 2800,
            Right: 1400,
            Bottom: 3600,
        },
        Kick_Out: {
            WinnerX: 280,
            WinnerY: 3100,
            x: 3300,
            y: 3300,
        },
    };

    static Arena(timer = 60, player, mode) {
        if (this.Enabled) {
            this.timer = timer;

            this.CountDown(player, true, mode)

            this.countdownInterval = setInterval(() => {
                this.CountDown(player, false, mode)
            }, this._Arena.Interval);

            this.teleporterInterval = setInterval(() => {
                this.Teleporter(player)
            }, this._Arena.Interval / 10)

        } else {

        }
    }

    static async Start(player, mode) {
        this.Started = true;
        this._Arena.Players_Amount = 0;
        this._Arena.Attempts++
        this._Arena.Arena_Duration.Now = (performance.now() / 1000)


        if (this._Arena.Arena_Duration.Now - this._Arena.Arena_Duration.Start >= this._Arena.Arena_Duration.Time - 30) {
            if (this._Arena.Arena_Duration.Now - this._Arena.Arena_Duration.Start < this._Arena.Arena_Duration.Time - 29)
                player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Hurry up! Only 30 seconds remain before closing arena`]);
        }

        if (this._Arena.Arena_Duration.Now - this._Arena.Arena_Duration.Start >= this._Arena.Arena_Duration.Time) {
            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Arena Duration Has Ended!`]);
            player.gameServer.players.forEach(player => {
                if (player.inEvent) {
                    player.x = Number(this._Arena.Kick_Out.x)
                    player.y = Number(this._Arena.Kick_Out.y)
                    player.inEvent = false;
                    player.god = false;
                    this.Clear(player)
                    this.RemoveInventory(player)
                    this.RestoreInventory(player)
                }
            })
            this.TurnOffArena(player)
        }

        player.gameServer.players.forEach(player => {
            if (player.inEvent) {
                player.god = false;
                this._Arena.Players_Amount++
            }
        })

        if (this._Arena.Players_Amount == 1) {
            if (this._Arena.Attempts <= 1) {
                player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Arena cancelled! Not enough players!`]);
                player.gameServer.players.forEach(player => {
                    if (player.inEvent) {
                        player.x = Number(this._Arena.Kick_Out.x)
                        player.y = Number(this._Arena.Kick_Out.y)
                        player.inEvent = false;
                        player.god = false;
                        this.Clear(player)
                        this.RemoveInventory(player)
                        this.RestoreInventory(player)
                    }
                })
                this.TurnOffArena(player)
            } else {
                player.gameServer.players.forEach(player => {
                    if (player.inEvent) {
                        this._Arena.Winner = player
                    }
                })
                player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `${this._Arena.Winner.gameProfile.name} Has won the arena!`]);
                this._Arena.Winner.x = Number(this._Arena.Kick_Out.WinnerX);
                this._Arena.Winner.y = Number(this._Arena.Kick_Out.WinnerY);
                this._Arena.Winner.inEvent = false;
                this.RemoveInventory(this._Arena.Winner)
                this.RestoreInventory(this._Arena.Winner)
                mode == this.Mode.WinItAll ? this.AddAllToWinner() : this.AddInventory(this._Arena.Winner, this.ChosenReward, true)
                this.TurnOffArena(player)
            }
        }

        if (this._Arena.Team.Red !== this._Arena.Team.Blue && this._Arena.Attempts == 1) {
            let Id;
            let ToKick;
            this._Arena.Team.Red > this._Arena.Team.Blue ? Id = this._Arena.Team.LastRed : Id = this._Arena.Team.LastRed
            ToKick = ConsoleManager_1.findPlayerByIdOrName(Number(Id), player.gameServer)
            ToKick.x = this._Arena.Kick_Out.x
            ToKick.y = this._Arena.Kick_Out.y

            delete ToKick.inEvent;
            delete ToKick.TeamRed;
            delete ToKick.TeamBlue;

            player.sendJSON([PacketType_1.ServerPacketTypeJson.AlertedIssue, "You were kicked to balance teams as you were the last to join!"]);
            this.Clear(ToKick)
            this.RemoveInventory(ToKick)
            this.RestoreInventory(ToKick)
        }

        if (this._Arena.Attempts == 1 && this._Arena.Players_Amount <= this.Rewards.Select.First.Max) {
            this.ChosenReward = this.Rewards.FirstReward
        }

        if (this._Arena.Attempts == 1 &&
            this._Arena.Players_Amount > this.Rewards.Select.Second.Min &&
            this._Arena.Players_Amount <= this.Rewards.Select.Second.Max) {
            this.ChosenReward = this.Rewards.SecondReward
        }

        if (this._Arena.Attempts == 1 && this._Arena.Players_Amount > this.Rewards.Select.Max.Min) {
            this.ChosenReward = this.Rewards.MaximumReward
        }
    }

    static ExitArena(player) {
        if (!this.Started) {
            player.x = this._Arena.Kick_Out.x;
            player.y = this._Arena.Kick_Out.y;

            delete player.inEvent
            delete player.TeamRed
            delete player.TeamBlue

            this.Clear(player)
            this.RemoveInventory(player)
            this.RestoreInventory(player)
        } else {
            return 'The event started! You may not exit.'
        }
    }

    static Clear(player) {
        player.max_speed = 24;
        player.extra = 0;
        player.hat = 0
        player.right = ItemIds_1.ItemIds.HAND;
        player.updateInfo()
    }

    static TurnOffArena(player) {
        this._Arena.Attempts = 0;
        player.gameServer.EventOn = false;
        this.Enabled = false;
        this.Started = false;
        this._Arena.Winner = ''
        this._Arena.Team.Blue = 0;
        this._Arena.Team.Red = 0;
        this._Arena.Team.LastBlue = 0;
        this._Arena.Team.LastRed = 0;
        this._Arena.Stored_Inventories = {}
        clearInterval(this.StartInterval)
        clearInterval(this.teleporterInterval)

        player.gameServer.players.forEach(player => {
            delete player.inEvent;
            delete player.TeamRed;
            delete player.TeamBlue;
        })

    }

    static Teleporter(player) {
        player.gameServer.players.forEach(player => {
            if (player.x >= this._Arena.Left &&
                player.x <= this._Arena.Right &&
                player.y >= this._Arena.Top &&
                player.y <= this._Arena.Bottom &&
                !player.inEvent && !player.ghost && !this.Started && !player.isFly) {
                player.inEvent = true;
                player.god = true;


                if (this._Arena.Team.Red + this._Arena.Team.Blue <= this._Arena.max_players) {
                    if (this._Arena.Team.Red > this._Arena.Team.Blue) {
                        player.x = Number(this._Arena.Zone.x1)
                        player.y = Number(this._Arena.Zone.y1)
                        this._Arena.Team.Blue++;
                        this._Arena.Team.LastBlue = player.id
                        player.TeamBlue = true;
                    } else {
                        player.x = Number(this._Arena.Zone.x2)
                        player.y = Number(this._Arena.Zone.y2)
                        this._Arena.Team.Red++;
                        this._Arena.Team.LastRed = player.id
                        player.TeamRed = true;
                    }

                    this.Clear(player)
                    this.StoreInventory(player)
                    this.RemoveInventory(player)
                    this.AddInventory(player, this._Arena.Items, true)
                }
            };

            if (player.x >= this._Arena.PvPZone.Left &&
                player.x <= this._Arena.PvPZone.Right &&
                player.y >= this._Arena.PvPZone.Top &&
                player.y <= this._Arena.PvPZone.Bottom &&
                !player.inEvent && !player.Bypass && !player.isAdmin && !player.isMod && !player.staffAllowed) {
                player.x = this._Arena.Kick_Out.x
                player.y = this._Arena.Kick_Out.y
            }

            if (player.x <= this._Arena.PvPZone.Left &&
                player.x >= this._Arena.PvPZone.Right &&
                player.y <= this._Arena.PvPZone.Top &&
                player.y >= this._Arena.PvPZone.Bottom &&
                player.inEvent && !player.Bypass && !player.isAdmin && !player.isMod && !player.staffAllowed) {
                if (player.TeamRed) {
                    player.x = Number(this._Arena.Zone.x2)
                    player.y = Number(this._Arena.Zone.y2)
                } else if (player.TeamBlue) {
                    player.x = Number(this._Arena.Zone.x1)
                    player.y = Number(this._Arena.Zone.y1)
                }
            }

        });
    }

    static GenerateArenaBuildings(player) {

    }

    static SpawnBuilding(player, id, meta_type, damageProtection, data, name, PosX, PosY, angle, etype, max_health, health, radius) {
        const building = new Building_1.Building(player, player.gameServer.entityPool.nextId(), id, player.gameServer, damageProtection, data, meta_type, name);
        building.initEntityData(PosX, PosY, angle, etype, true);
        building.max_health = max_health ?? 0;
        building.health = health ?? 0;
        building.radius = radius ?? 0;
        building.initOwner(building);
        building.setup();
        player.gameServer.initLivingEntity(building);
        const writer = new bufferReader_1.BufferWriter(2);
        writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.AcceptBuild, player.id);
        writer.writeUInt8(entityType, player.id);
        player.sendBinary(writer.toBuffer());
    }

    static AddAllToWinner() {
        for (const key in this._Arena.Stored_Inventories) {
            const itemObject = this._Arena.Stored_Inventories[key];
            for (const item in itemObject) {
                const amount = itemObject[item];
                this.AddInventory(this._Arena.Winner, { [item]: amount }, false);
            }
        }
    }

    static StoreInventory(player) {
        this._Arena.Stored_Inventories[player.id] = {}
        player.inventory.items.forEach((amount, itemId) => {
            this._Arena.Stored_Inventories[player.id][itemId] = amount
        });
    }

    static AddInventory(player, ItemsToAdd, type) {
        if (type && ItemsToAdd) {
            Object.entries(ItemsToAdd).forEach(([itemId, amount]) => {
                player.inventory.addItem(ItemIds_1.ItemIds[itemId], Number(amount));
            });
        } else if (ItemsToAdd) {
            Object.entries(ItemsToAdd).forEach(([itemId, amount]) => {
                player.inventory.addItem(Number(itemId), Number(amount));
            });
        }
    }

    static RemoveInventory(player) {
        player.inventory.items.forEach((amount, itemId) => {
            player.inventory.removeItem(itemId, amount, true);
        });
    }

    static RestoreInventory(player) {
        const inventory = this._Arena.Stored_Inventories[player.id];
        if (inventory) {
            Object.entries(inventory).forEach(([itemId, amount]) => {
                player.inventory.addItem(Number(itemId), Number(amount));
            });
            delete this._Arena.Stored_Inventories[player.id];
        }
    }

    static CountDown(player, caller, mode = 'Normal') {

        switch (mode.toLowerCase()) {
            case 'wia':
            case 'winitall':
                mode = this.Mode.WinItAll;
                break;
        }

        if (caller && mode == this.Mode.WinItAll) {
            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Arena is scheduled to start in ${this.timer} seconds! [Win It All]`]);
        } else if (caller) {
            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Arena is scheduled to start in ${this.timer} seconds! [Normal Mode]`]);
        }

        if (this.timer == 30) {
            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `${this.timer} Seconds left before arena begins! Join to get some rewards! [${mode ? mode : 'Normal Mode'}]`]);
        }

        if (this.timer == 15) {
            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `${this.timer} Seconds left before arena begins! Join to get some rewards! [${mode ? mode : 'Normal Mode'}]`]);
        }

        if (this.timer == 5) {
            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Arena will begin in ${this.timer} seconds! [${mode ? mode : 'Normal Mode'}]`]);
        }

        this.timer--

        if (this.timer < 1) {
            clearInterval(this.countdownInterval);
            this._Arena.Arena_Duration.Start = (performance.now() / 1000)
            player.gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.AlertMessage, `Start!`]);
            this.StartInterval = setInterval(() => { this.Start(player, mode); }, this._Arena.Interval)
        }
    }
}


exports.ArenaManager = ArenaManager;