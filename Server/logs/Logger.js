"use strict";
var __createBinding = this && this.__createBinding || (Object.create ? function (e, t, r, o) {
    void 0 === o && (o = r);
    var l = Object.getOwnPropertyDescriptor(t, r);
    l && !("get" in l ? !t.__esModule : l.writable || l.configurable) || (l = {
        enumerable: !0,
        get: function () {
            return t[r]
        }
    });
    Object.defineProperty(e, o, l)
} : function (e, t, r, o) {
    void 0 === o && (o = r);
    e[o] = t[r]
}),
    __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        })
    } : function (e, t) {
        e.default = t
    }),
    __importStar = this && this.__importStar || function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && __createBinding(t, e, r);
        __setModuleDefault(t, e);
        return t
    },
    __importDefault = this && this.__importDefault || function (e) {
        return e && e.__esModule ? e : {
            default: e
        }
    };
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.Loggers = exports.LoggerFactory = exports.setLogLevel = exports.Logger = void 0;
const xregexp_1 = __importDefault(require("xregexp")),
    loglevel_1 = require("./loglevel"),
    theme_1 = require("./theme"),
    util = __importStar(require("util")),
    regexp = (0, xregexp_1.default)(/{\w+(:(?<modifiers>\w+))?}/g);
let logLevel = loglevel_1.LogLevel.Verbose;
class Logger {
    name;
    constructor(e) {
        this.name = e
    }
    colorify(e, t) {
        void 0 === e && (e = theme_1.Theme.Undefined("undefined"));
        "string" == typeof e && (e = theme_1.Theme.String(e.toString()));
        "number" == typeof e && (e = theme_1.Theme.Number(e.toString()));
        "boolean" == typeof e && (e = e ? theme_1.Theme.True(e.toString()) : theme_1.Theme.False(e.toString()));
        "object" == typeof e && (e = Array.isArray(e) ? "[ " + (e = e.map((e => {
            "string" == typeof e && (e = "'" + e + "'");
            return this.colorify(e, [])
        }))).join(", ") + " ]" : theme_1.Theme.Object(util.inspect(e, {
            depth: t.includes("d") ? 1 / 0 : 0
        })));
        null == e && (e = theme_1.Theme.Null("null"));
        return e
    }
    log(e, t, ...r) {
        if (e > logLevel) return;
        const o = xregexp_1.default.match(t, regexp);
        for (let e = 0; e < o.length; e++) {
            const l = o[e];
            let g = r[e];
            const i = (xregexp_1.default.exec(t, regexp).groups.modifiers ?? "").split("");
            t = t.replaceAll(l, this.colorify(g, i))
        }
        console.log(theme_1.Theme.constructLog(this.name, e) + t)
    }
    info(e, ...t) {
        this.log(loglevel_1.LogLevel.Info, e, ...t)
    }
    warn(e, ...t) {
        this.log(loglevel_1.LogLevel.Warning, e, ...t)
    }
    error(e, ...t) {
        this.log(loglevel_1.LogLevel.Error, e, ...t)
    }
    fatal(e, ...t) {
        this.log(loglevel_1.LogLevel.Fatal, e, ...t)
    }
    debug(e, ...t) {
        this.log(loglevel_1.LogLevel.Debug, e, ...t)
    }
    verbose(e, ...t) {
        this.log(loglevel_1.LogLevel.Verbose, e, ...t)
    }
}
exports.Logger = Logger;

function setLogLevel(e) {
    logLevel = e
}
exports.setLogLevel = setLogLevel;
const loggers = {};
class LoggerFactory {
    static createLogger(e) {
        return loggers[e] ??= new Logger(e)
    }
}
exports.LoggerFactory = LoggerFactory;
exports.Loggers = {
    app: LoggerFactory.createLogger("App"),
    game: LoggerFactory.createLogger("Game")
};