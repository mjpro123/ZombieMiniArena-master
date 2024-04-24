"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardPlayer = exports.resolveKill = void 0;
const ItemIds_1 = require("../enums/ItemIds");
const rewardList = [
    {
        value: 10,
        rewardItems: [[ItemIds_1.ItemIds.GOLD_BOW, 1]],
        rewardScore: 1000,
        alertMessage: "GOLDEN BOW 10kills"
    }, {
        value: 19,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 5]],
        rewardScore: 1000,
        alertMessage: "PIRATESWORD WILL IN YOUR INVENTORY NEXT KILL"
    }, {
        value: 20,
        rewardItems: [[ItemIds_1.ItemIds.PIRATE_SWORD, 1]],
        rewardScore: 1000,
        alertMessage: "PIRATESWORD 20kills"
    }, {
        value: 25,
        rewardItems: [[ItemIds_1.ItemIds.DIVING_MASK, 1]],
        rewardScore: 1000,
        alertMessage: "DIVING MASK 25kills"
    }, {
        value: 30,
        rewardItems: [[ItemIds_1.ItemIds.TURBAN1, 1]],
        rewardScore: 1000,
        alertMessage: "TURBAN 30kills"
    }, {
        value: 49,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 20]],
        rewardScore: 1000,
        alertMessage: "NEXT KILL YOU CAN GET NINJA HAT, 49kills"
    }, {
        value: 50,
        rewardItems: [[ItemIds_1.ItemIds.TURBAN2, 1]],
        rewardScore: 1000,
        alertMessage: "NINJA HAT 50kills"
    }, {
        value: 99,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 20]],
        rewardScore: 1000,
        alertMessage: "NEXT KILL YOU CAN GET DRAGON 99kills"
    }, {
        value: 100,
        rewardItems: [[ItemIds_1.ItemIds.BABY_DRAGON, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got GEM 100kills gg"
    }, {
        value: 150,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "YOU GET 500 FIREFLY gg"
    }, {
        value: 200,
        rewardItems: [[ItemIds_1.ItemIds.WAND1, 1]],
        rewardScore: 1000,
        alertMessage: "You got a wand of death"
    },
    {
        value: 250,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 500 FIREFLY gg"
    }, {
        value: 300,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 50 FIREFLY 300kills gg"
    },
    {
        value: 350,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 500 FIREFLY at 350kills gg"
    }, {
        value: 400,
        rewardItems: [[ItemIds_1.ItemIds.WAND2, 1]],
        rewardScore: 1000,
        alertMessage: "You got a wand of life"
    },
    {
        value: 450,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 500 FIREFLY at 450kills gg"
    }, {
        value: 500,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 50 FIREFLY 500kills gg"
    },
    {
        value: 550,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 500 FIREFLY at 50kills gg"
    }, {
        value: 600,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 50 FIREFLY 600kills gg"
    },
    {
        value: 650,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 500 FIREFLY at 650kills gg"
    }, {
        value: 700,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 50 FIREFLY 700kills gg"
    },
    {
        value: 750,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50], [ItemIds_1.ItemIds.CHRISTMAS_HAT, 1]],
        rewardScore: 1000,
        alertMessage: "You got CHRISTMAS HAT"
    }, {
        value: 800,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 50 FIREFLY 800kills gg"
    },
    {
        value: 850,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 500 FIREFLY, 850kills gg"
    }, {
        value: 900,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 50 FIREFLY 900kills gg"
    },
    {
        value: 950,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got 500 Fireflies for 950 kills gg. Free proper space at 1k Kills!"
    }, {
        value: 1000,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 100], [ItemIds_1.ItemIds.GEMME_BLUE, 2], [ItemIds_1.ItemIds.HAWK, 1]],
        rewardScore: 1000,
        alertMessage: "BRO 1000KILLS"
    }
];

const Repeat_List = [
    {
        Every: 10,
        Reward: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1]],
        Message: 'Congrats, You received an orange gem!',
        rewardScore: 1000
    },
    {
        Every: 20,
        Reward: [[ItemIds_1.ItemIds.BOTTLE_FULL, 1], [ItemIds_1.ItemIds.WAND1, 1]],
        Message: 'Congrats, You received a bottle and wand!',
        rewardScore: 1000
    },
    {
        Every: 40,
        Reward: [[ItemIds_1.ItemIds.WAND2, 1]],
        Message: 'Congrats, You received a life wand!',
        rewardScore: 1000
    },
    {
        Every: 100,
        Reward: [[ItemIds_1.ItemIds.GEMME_BLUE, 1]],
        Message: 'Congrats, You received a blue gem!',
        rewardScore: 1000
    },
    {
        Every: 1000,
        Reward: [[ItemIds_1.ItemIds.CAKE, 1]],
        Message: 'Congrats, You received a cake!',
        rewardScore: 1000
    }
]

const Bounty = [
    {
        Kill: 10,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 25]]
    },
    {
        Kill: 30,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 75]]
    },
    {
        Kill: 50,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 150]]
    },
    {
        Kill: 100,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 200]]
    },
    {
        Kill: 150,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 300]]
    },
    {
        Kill: 300,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 400]]
    },
    {
        Kill: 500,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 500]]
    },
    {
        Kill: 750,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 1000]]
    },
    {
        Kill: 1000,
        Reward: [[ItemIds_1.ItemIds.FIREFLY, 2000]]
    }
]

function assignBounty(pl) {
    for (let bounty in Bounty) {
        if (pl.gameProfile.kills == bounty.Kill) {
            return bounty.Reward;
        }
    }
    return pl.gameProfile.bounty;
}

function resolveKill(killer, entity) {
    if (killer.gameProfile.kills > 1000) {
        killer.gameProfile.bounty[0][1] += Math.floor((Math.random() * 4) + 1);
    }
    if (entity.bounty) {
        killer.inventory.addItem(entity.gameProfile.bounty[0][0], entity.gameProfile.bounty[0][1])
        entity.gameProfile.bounty[0][1] = 0;
    }
    killer.gameProfile.kills++;
    rewardPlayer(killer);
    killer.health = 200;
    killer.gaugesManager.healthUpdate();
}

exports.resolveKill = resolveKill;
exports.assignBounty = assignBounty;


function rewardPlayer(pl) {

    for (const repeatReward of Repeat_List) {
        if (pl.gameProfile.kills % repeatReward.Every == 0) {
            for (let i = 0; i < repeatReward.Reward.length; i++) {
                pl.inventory.addItem(repeatReward.Reward[i][0], repeatReward.Reward[i][1])
            }
            if (repeatReward.Message?.length > 0)
                pl.controller.sendJSON([4, repeatReward.Message]);
            if (repeatReward.rewardScore > 0)
                pl.gameProfile.score += repeatReward.rewardScore;
        }
    }

    for (const rewardData of rewardList) {
        const rwData = rewardData;
        if (rwData.value == pl.gameProfile.kills) {
            for (let i = 0; i < rwData.rewardItems.length; i++) {
                pl.inventory.addItem(rwData.rewardItems[i][0], rwData.rewardItems[i][1]);
            }
            if (rwData.alertMessage.length > 0)
                pl.controller.sendJSON([4, rwData.alertMessage]);
            if (rwData.rewardScore > 0)
                pl.gameProfile.score += rwData.rewardScore;
            return;
        }
    }
    pl.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, 3);
    pl.gameProfile.score += 1000;
    pl.controller.sendJSON([4, `Now you have ${pl.gameProfile.kills}kills`]);
    if (pl.gameProfile.kills < 10) {
        pl.inventory.addItem(ItemIds_1.ItemIds.GOLD_SPIKE, 4);
    }
    else if (pl.gameProfile.kills < 15) {
        pl.inventory.addItem(ItemIds_1.ItemIds.DIAMOND_SPIKE, 3);
    }
    else if (pl.gameProfile.kills < 20) {
        pl.inventory.addItem(ItemIds_1.ItemIds.AMETHYST_SPIKE, 2);
    }
    else if (pl.gameProfile.kills > 20 && pl.gameProfile.kills < 40) {
        pl.inventory.addItem(ItemIds_1.ItemIds.REIDITE_SPIKE, 2);
        pl.inventory.addItem(ItemIds_1.ItemIds.AMETHYST_SPIKE, 3);
    }
}
exports.rewardPlayer = rewardPlayer;