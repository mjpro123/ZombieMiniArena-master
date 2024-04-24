"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.Theme = void 0;
const colorette_1 = require("colorette"),
    loglevel_1 = require("./loglevel"),
    luxon_1 = require("luxon");
class Theme {
    static Null = colorette_1.redBright;
    static Undefined = colorette_1.redBright;
    static Object = colorette_1.yellowBright;
    static String = colorette_1.yellowBright;
    static Number = colorette_1.blueBright;
    static True = colorette_1.greenBright;
    static False = colorette_1.redBright;
    static constructLog(e, t) {
        let l = colorette_1.whiteBright;
        switch (t) {
            case loglevel_1.LogLevel.Info:
                l = colorette_1.blueBright;
                break;
            case loglevel_1.LogLevel.Warning:
                l = colorette_1.yellowBright;
                break;
            case loglevel_1.LogLevel.Error:
                l = colorette_1.redBright;
                break;
            case loglevel_1.LogLevel.Fatal:
                l = colorette_1.magentaBright;
                break;
            case loglevel_1.LogLevel.Debug:
                l = colorette_1.blueBright;
                break;
            case loglevel_1.LogLevel.Verbose:
                l = colorette_1.cyanBright
        }
        return `[${luxon_1.DateTime.now().toFormat("HH:mm:ss")}] [${(0,colorette_1.blueBright)(e)}] [${l(loglevel_1.LogLevel[t])}]: `
    }
}
exports.Theme = Theme;