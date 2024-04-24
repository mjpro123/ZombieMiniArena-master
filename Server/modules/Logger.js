"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
var LogColor;
(function (LogColor) {
    LogColor["INFO"] = "blue";
    LogColor["ERROR"] = "red";
    LogColor["DEBUG"] = "blue";
})(LogColor || (LogColor = {}));
class Logger {
    PATH;
    stream;
    mainStream;
    options;
    constructor(PATH, options) {
        this.PATH = PATH;
        const error = new Error();
        const stackTrace = error.stack.split("\n");
        const location = stackTrace[2].trim();
        const name = path.parse(location).name;
        const logDir = path.join(PATH, name);
        fs.mkdirSync(logDir, { recursive: true });
        const logFileName = `${this.timeStampString()}.log`;
        const logFile = path.join(logDir, logFileName);
        this.stream = fs.createWriteStream(logFile, { encoding: "utf-8" });
        const mainLogFileName = `${this.timeStampString()}.log`;
        this.mainStream = fs.createWriteStream(path.join(PATH, mainLogFileName), { encoding: "utf-8" });
        this.options = options;
    }
    timeStampString() {
        const now = new Date();
        const time = now.toLocaleTimeString().split(":").join(".");
        const date = now.toLocaleDateString().split("/").reverse().join(".");
        return `${time} ${date}`;
    }
    info(message) {
        const error = new Error();
        const stackTrace = error.stack.split("\n");
        const location = stackTrace[2].trim();
        this.log(LogLevel.INFO, message, location);
    }
    error(message) {
        const error = new Error();
        const stackTrace = error.stack.split("\n");
        const location = stackTrace[2].trim();
        this.log(LogLevel.ERROR, message, location);
    }
    debug(message) {
        const error = new Error();
        const stackTrace = error.stack.split("\n");
        const location = stackTrace[2].trim();
        this.log(LogLevel.DEBUG, message, location);
    }
    log(level, message, location) {
        const PATH = path.parse(location);
        const logEntry = `[${this.timeStampString()} ${PATH.base}] [${level}]`;
        if (this.options.file) {
            const fileEntry = `${logEntry} ${message}\n`;
            this.mainStream.write(fileEntry);
            this.stream.write(fileEntry);
        }
        if (this.options.console) {
            const color = LogColor[level];
            const coloredLogEntry = chalk_1.default[color].bold(logEntry);
            console.log(`${coloredLogEntry}`, message);
        }
    }
}
exports.Logger = Logger;