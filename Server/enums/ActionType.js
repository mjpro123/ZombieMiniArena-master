"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = void 0;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["DELETE"] = 1] = "DELETE";
    ActionType[ActionType["HURT"] = 2] = "HURT";
    ActionType[ActionType["COLD"] = 4] = "COLD";
    ActionType[ActionType["HUNGER"] = 8] = "HUNGER";
    ActionType[ActionType["ATTACK"] = 16] = "ATTACK";
    ActionType[ActionType["WALK"] = 32] = "WALK";
    ActionType[ActionType["IDLE"] = 64] = "IDLE";
    ActionType[ActionType["HEAL"] = 128] = "HEAL";
    ActionType[ActionType["WEB"] = 256] = "WEB";
})(ActionType || (exports.ActionType = ActionType = {}));
