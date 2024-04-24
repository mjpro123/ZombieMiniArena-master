"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.Action = void 0;
var Action;
! function(t) {
    t[t.DELETE = 1] = "DELETE";
    t[t.HURT = 2] = "HURT";
    t[t.COLD = 4] = "COLD";
    t[t.HUNGER = 8] = "HUNGER";
    t[t.ATTACK = 16] = "ATTACK";
    t[t.WALK = 32] = "WALK";
    t[t.IDLE = 64] = "IDLE";
    t[t.HEAL = 128] = "HEAL";
    t[t.WEB = 256] = "WEB"
}(Action = exports.Action || (exports.Action = {}));