"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.constructError = exports.EventErrors = void 0;
const Logger_1 = require("../logs/Logger");
var EventErrors;
! function(r) {
    r.PARAMS_PARSE_FAIL = "Famishs.EventLoop.constructParams.NullException";
    r.NODE_NOT_FOUND = "Famishs.EventLoop.readEventName.NullException"
}(EventErrors = exports.EventErrors || (exports.EventErrors = {}));

function constructError(r, e, o, t = null) {
    Logger_1.Loggers.game.warn("---------------------------");
    Logger_1.Loggers.game.error(`${r}:\n         Suspected Event: '{0}'\n         Error Description: {1}${t?"\n         Data: {2}":""}`, e, o, t);
    Logger_1.Loggers.game.warn("---------------------------")
}
exports.constructError = constructError;