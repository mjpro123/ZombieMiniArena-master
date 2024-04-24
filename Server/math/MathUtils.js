"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.MathUtils = void 0;
class MathUtils {
    static getItemCountCallback(t, e, s) {
        if (e + t <= s) return [t, e + t];
        return [t - Math.abs(s - (e + t)), s]
    }
    static lerp(t, e, s) {
        return (1 - s) * t + s * e
    }
}
exports.MathUtils = MathUtils;