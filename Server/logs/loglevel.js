"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.LogLevel = void 0;
var LogLevel;
! function (e) {
    e[e.Info = 0] = "Info";
    e[e.Warning = 1] = "Warning";
    e[e.Error = 2] = "Error";
    e[e.Fatal = 3] = "Fatal";
    e[e.Debug = 4] = "Debug";
    e[e.Verbose = 5] = "Verbose"
}(LogLevel = exports.LogLevel || (exports.LogLevel = {}));