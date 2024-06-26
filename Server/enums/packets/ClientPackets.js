"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPackets = void 0;
var ClientPackets;
(function (ClientPackets) {
    ClientPackets[ClientPackets["UNITS"] = 0] = "UNITS";
    ClientPackets[ClientPackets["UNITS_EXTENDED"] = 1] = "UNITS_EXTENDED";
    ClientPackets[ClientPackets["CANCEL_CRAFT"] = 2] = "CANCEL_CRAFT";
    ClientPackets[ClientPackets["GATHER"] = 3] = "GATHER";
    ClientPackets[ClientPackets["OLD_VERSION"] = 4] = "OLD_VERSION";
    ClientPackets[ClientPackets["FULL"] = 5] = "FULL";
    ClientPackets[ClientPackets["DONT_HARVEST"] = 6] = "DONT_HARVEST";
    ClientPackets[ClientPackets["HITTEN"] = 7] = "HITTEN";
    ClientPackets[ClientPackets["BUILD_STOP"] = 8] = "BUILD_STOP";
    ClientPackets[ClientPackets["BUILD_OK"] = 9] = "BUILD_OK";
    ClientPackets[ClientPackets["INV_FULL"] = 10] = "INV_FULL";
    ClientPackets[ClientPackets["DECREASE_ITEM"] = 11] = "DECREASE_ITEM";
    ClientPackets[ClientPackets["WORKBENCH"] = 12] = "WORKBENCH";
    ClientPackets[ClientPackets["HITTEN_OTHER"] = 13] = "HITTEN_OTHER";
    ClientPackets[ClientPackets["MUTE"] = 14] = "MUTE";
    ClientPackets[ClientPackets["KILL_PLAYER"] = 15] = "KILL_PLAYER";
    ClientPackets[ClientPackets["GAUGES"] = 16] = "GAUGES";
    ClientPackets[ClientPackets["RECOVER_FOCUS"] = 17] = "RECOVER_FOCUS";
    ClientPackets[ClientPackets["EMPTY_RES"] = 18] = "EMPTY_RES";
    ClientPackets[ClientPackets["FIRE"] = 19] = "FIRE";
    ClientPackets[ClientPackets["SURVIVE"] = 20] = "SURVIVE";
    ClientPackets[ClientPackets["LEADERBOARD"] = 21] = "LEADERBOARD";
    ClientPackets[ClientPackets["GET_TIME"] = 22] = "GET_TIME";
    ClientPackets[ClientPackets["SET_CAM"] = 23] = "SET_CAM";
    ClientPackets[ClientPackets["ACCEPT_BUILD"] = 24] = "ACCEPT_BUILD";
    ClientPackets[ClientPackets["KILLED"] = 25] = "KILLED";
    ClientPackets[ClientPackets["MINIMAP"] = 26] = "MINIMAP";
    ClientPackets[ClientPackets["FAIL_RESTORE"] = 27] = "FAIL_RESTORE";
    ClientPackets[ClientPackets["GHOST"] = 28] = "GHOST";
    ClientPackets[ClientPackets["REBORN"] = 29] = "REBORN";
    ClientPackets[ClientPackets["STEAL_TOKEN"] = 30] = "STEAL_TOKEN";
    ClientPackets[ClientPackets["JOIN_NEW_TEAM"] = 31] = "JOIN_NEW_TEAM";
    ClientPackets[ClientPackets["EXCLUDE_TEAM"] = 32] = "EXCLUDE_TEAM";
    ClientPackets[ClientPackets["NEW_MEMBER_TEAM"] = 33] = "NEW_MEMBER_TEAM";
    ClientPackets[ClientPackets["DESTROY_TEAM"] = 34] = "DESTROY_TEAM";
    ClientPackets[ClientPackets["KIT_OK"] = 35] = "KIT_OK";
    ClientPackets[ClientPackets["WATER"] = 36] = "WATER";
    ClientPackets[ClientPackets["GAUGES_LIFE"] = 37] = "GAUGES_LIFE";
    ClientPackets[ClientPackets["GAUGES_FOOD"] = 38] = "GAUGES_FOOD";
    ClientPackets[ClientPackets["GAUGES_WATER"] = 39] = "GAUGES_WATER";
    ClientPackets[ClientPackets["GET_BAG"] = 40] = "GET_BAG";
    ClientPackets[ClientPackets["VERIFIED_ACCOUNT"] = 41] = "VERIFIED_ACCOUNT";
    ClientPackets[ClientPackets["SUCCEED_QUEST"] = 42] = "SUCCEED_QUEST";
    ClientPackets[ClientPackets["FAIL_QUEST"] = 43] = "FAIL_QUEST";
    ClientPackets[ClientPackets["CLAIMED"] = 44] = "CLAIMED";
    ClientPackets[ClientPackets["RECYCLE_OK"] = 45] = "RECYCLE_OK";
    ClientPackets[ClientPackets["RECYCLE_STOP"] = 46] = "RECYCLE_STOP";
    ClientPackets[ClientPackets["WELL"] = 47] = "WELL";
    ClientPackets[ClientPackets["NO_RESOURCES"] = 48] = "NO_RESOURCES";
    ClientPackets[ClientPackets["DECREASE_ITEM_2"] = 50] = "DECREASE_ITEM_2";
    ClientPackets[ClientPackets["BLOCKED"] = 51] = "BLOCKED";
    ClientPackets[ClientPackets["DELETE_INV_OK"] = 52] = "DELETE_INV_OK";
    ClientPackets[ClientPackets["DELETE_ONE_INV_OK"] = 53] = "DELETE_ONE_INV_OK";
    ClientPackets[ClientPackets["ACCOUNT_OK"] = 54] = "ACCOUNT_OK";
    ClientPackets[ClientPackets["GAUGES_WARM"] = 55] = "GAUGES_WARM";
    ClientPackets[ClientPackets["GAUGES_COLD"] = 56] = "GAUGES_COLD";
    ClientPackets[ClientPackets["NEW_VERSION"] = 57] = "NEW_VERSION";
    ClientPackets[ClientPackets["WRONG_PASSWORD"] = 58] = "WRONG_PASSWORD";
    ClientPackets[ClientPackets["CLEAN_INVENTORY"] = 59] = "CLEAN_INVENTORY";
    ClientPackets[ClientPackets["HIDE_SHOP_KIT"] = 60] = "HIDE_SHOP_KIT";
    ClientPackets[ClientPackets["CAMERA_CONFIG"] = 61] = "CAMERA_CONFIG";
    ClientPackets[ClientPackets["DELETE_SINGLE_INV"] = 62] = "DELETE_SINGLE_INV";
    ClientPackets[ClientPackets["HIDE_CLOCK"] = 63] = "HIDE_CLOCK";
    ClientPackets[ClientPackets["HIDE_RECIPE_BOOK"] = 64] = "HIDE_RECIPE_BOOK";
    ClientPackets[ClientPackets["HIDE_QUEST"] = 65] = "HIDE_QUEST";
    ClientPackets[ClientPackets["HIDE_MARKET"] = 66] = "HIDE_MARKET";
    ClientPackets[ClientPackets["EXPLORER_QUEST"] = 67] = "EXPLORER_QUEST";
    ClientPackets[ClientPackets["SAND_TEMPEST"] = 68] = "SAND_TEMPEST";
    ClientPackets[ClientPackets["BLIZZARD"] = 69] = "BLIZZARD";
    ClientPackets[ClientPackets["BLIZZARD_STATUS"] = 70] = "BLIZZARD_STATUS";
    ClientPackets[ClientPackets["BANDAGE"] = 71] = "BANDAGE";
})(ClientPackets || (exports.ClientPackets = ClientPackets = {}));