"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoRefund = void 0;

const path = require('path')
const fs = require('fs');
const { ItemIds } = require('../enums/ItemIds');
const WhiteList = require('./AppData/Whitelisted_Items.json')

/* 3 Methods Required. 

1 - Store Information Into file

2 - Clear Information from file

3 - Find Player And Revert Items.

Quick Notes:
    Token - TokenID Validation.
    Timespace specified by user
    Turn on / off command
*/

class AutoRefund {
    static Loaded_Inventores = {};
    static Enable_AutoRefund = true;

    static Load_Inventories() {
        const Refund_Path = path.join(__dirname, 'AppData', 'Stored_Inventories.json')
        this.Load_Inventories = JSON.parse(fs.readFileSync(Refund_Path, 'utf-8'))
    }

    static Write_Updates() {
        const Refund_Path = path.join(__dirname, 'AppData', 'Stored_Inventories.json')
        const Data = JSON.stringify(this.Loaded_Inventores, null, 2)
        fs.writeFileSync(Refund_Path, Data)
    }

    constructor() {
        //if(!Enable_AutoRefund) return;
        //this.Load_Inventories()
    }

    static Save_Inventories(GameServer) {

        if (!Enable_AutoRefund || !GameServer) return;

        GameServer.players.forEach(player => {
            let token = player.gameProfile.token
            let token_id = player.gameProfile.token_id

            for (let Object in this.Loaded_Inventores) {
                if (Object.Token == token && Object.Token_ID == token_id) {
                    Object.inventory = player.inventory.items;
                    return;
                }
            }

            this.Loaded_Inventores.push({
                Token: token,
                Token_ID: token_id,
                inventory: player.inventory.items
            })
        });

        this.Write_Updates()
    }

    static Add_Inventory(GameServer) {

        if (!Enable_AutoRefund || !GameServer) return;

        GameServer.players.forEach(player => {
            let token = player.gameProfile.token
            let token_id = player.gameProfile.token_id

            for (let Object in this.Loaded_Inventores) {
                if (Object.Token == token && Object.Token_ID == token_id) {
                    for (let i = 0; i < Object.inventory.length; i++){
                        for (let i = 0; i < WhiteList.length; i++){
                            if(ItemIds[Object.inventory[0]] == ItemIds[WhiteList[i]])
                                player.inventory.addItem(ItemIds[Object.inventory[0]], Object.inventory[1])
                        }
                    }
                    this.Loaded_Inventores = this.Loaded_Inventores.filter(obj => !(obj.Token === token && obj.Token_ID === token_id));
                }
            }
        })

        this.Write_Updates()
    }
}

new AutoRefund()

exports.AutoRefund = AutoRefund