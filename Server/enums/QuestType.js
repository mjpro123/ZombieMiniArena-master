"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.QuestStateType = exports.QuestType = void 0;
var QuestType, QuestStateType;
! function (e) {
    e[e.NONE = -1] = "NONE";
    e[e.DRAGON_ORB = 0] = "DRAGON_ORB";
    e[e.DRAGON_CUBE = 1] = "DRAGON_CUBE";
    e[e.GREEN_CROWN = 2] = "GREEN_CROWN";
    e[e.ORANGE_CROWN = 3] = "ORANGE_CROWN";
    e[e.BLUE_CROWN = 4] = "BLUE_CROWN"
}(QuestType = exports.QuestType || (exports.QuestType = {}));
! function (e) {
    e[e.FAILED = 0] = "FAILED";
    e[e.SUCCED = 1] = "SUCCED";
    e[e.CLAIMED = 2] = "CLAIMED"
}(QuestStateType = exports.QuestStateType || (exports.QuestStateType = {}));