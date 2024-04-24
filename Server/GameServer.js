"use strict";
var __importDefault = this && this.__importDefault || function (e) {
	return e && e.__esModule ? e : {
		default: e
	}
};
Object.defineProperty(exports, "__esModule", {
	value: !0
});
exports.GameServer = void 0;
const Logger_1 = require("./logs/Logger"),
	SocketServer_1 = require("./network/SocketServer"),
	os_1 = __importDefault(require("os")),
	WorldTicker_1 = require("./world/WorldTicker"),
	nanotimer_1 = __importDefault(require("nanotimer")),
	idPool_1 = require("./utils/idPool"),
	WorldGenerator_1 = require("./world/WorldGenerator"),
	queryManager_1 = require("./utils/queryManager"),
	tokenManager_1 = require("./utils/tokenManager"),
	itemsmanager_1 = require("./utils/itemsmanager"),
	WorldSpawner_1 = require("./world/WorldSpawner"),
	PacketType_1 = require("./enums/PacketType"),
	WorldDeleter_1 = require("./world/WorldDeleter"),
	crafts_json_1 = __importDefault(require("./settings/crafts.json")),
	CraftManager_1 = require("./craft/CraftManager"),
	GlobalDataAnalyzer_1 = require("./protection/GlobalDataAnalyzer"),
	WorldCycle_1 = require("./world/WorldCycle"),
	EventManager_1 = require("./server/EventManager"),
	fs_1 = __importDefault(require("fs")),
	ItemIds_1 = require("./enums/ItemIds")
const { DiscordBot } = require("./discord-bot/booster")

class GameServer {
	httpServer;
	socketServer;
	worldTicker;
	worldGenerator;
	worldDeleter;
	worldCycle;
	queryManager;
	tokenManager;
	client;
	players;
	entityPool;
	playerPool;
	mobPool;
	worldSpawner;
	leaderboard;
	entities;
	livingEntities;
	updatableEntities;
	staticEntities;
	crafts;
	Boosters;
	globalAnalyzer;
	eventManager;
	gameConfiguration;
	static SERVER_TPS = 10;
	tokens_allowed;
	controller;
	inventory;
	DiscordBot;
	constructor(e = null) {
		this.DiscordBot = new DiscordBot(this)
		this.loadConfiguration();
		Logger_1.Loggers.app.info("Preparing GameInstance on ({0} / {1} {2})", os_1.default.platform(), os_1.default.type(), os_1.default.release());
		this.tokens_allowed = [];
		this.players = new Map;
		this.entityPool = new idPool_1.IdPool(175);
		this.playerPool = new idPool_1.IdPool(1);
		this.mobPool = new idPool_1.IdPool(this.gameConfiguration.server.playerLimit * this.gameConfiguration.server.buildingLimit + 1e3);
		this.entities = [];
		this.livingEntities = [];
		this.staticEntities = [];
		this.updatableEntities = [];
		this.Boosters = [];
		this.httpServer = e;
		this.socketServer = new SocketServer_1.SocketServer(this);
		this.worldTicker = new WorldTicker_1.WorldTicker(this);
		this.worldGenerator = new WorldGenerator_1.WorldGenerator(this);
		this.worldGenerator.generateWorld(this.gameConfiguration.world.map);
		this.worldCycle = new WorldCycle_1.WorldCycle(this);
		this.worldSpawner = new WorldSpawner_1.WorldSpawner(this);
		this.eventManager = new EventManager_1.EventManager(this, __dirname);
		this.worldDeleter = new WorldDeleter_1.WorldDeleter(this);
		this.queryManager = new queryManager_1.QueryManager(this);
		this.tokenManager = new tokenManager_1.TokenManager(this);
		this.crafts = [];
		for (let e of crafts_json_1.default) this.crafts.push(new CraftManager_1.Craft(e));
		this.setTicker();
		itemsmanager_1.ItemUtils.getItemById(ItemIds_1.ItemIds.REIDITE_SPIKE);
		this.globalAnalyzer = new GlobalDataAnalyzer_1.GlobalDataAnalyzer(this);
	}
	loadConfiguration() {
		const e = fs_1.default.readFileSync(__dirname + "/settings/serverconfig.json", {
			encoding: "utf-8"
		});
		this.gameConfiguration = JSON.parse(e)
	}

	setTicker() {
		new nanotimer_1.default(!1).setInterval((() => {
			this.worldTicker.fixedUpdate()
		}), "", "1000m");
		new nanotimer_1.default(!1).setInterval((() => {
			this.worldTicker.gameUpdate()
		}), "", 1 / 10 + "s")
	}
	initLivingEntity(e) {
		this.livingEntities.push(e);
		this.initEntityInst(e);
		this.initUpdatableEntity(e)
	}
	removeLivingEntity(e, t = !1) {
		const r = this.livingEntities.filter((t => t.id != e.id));
		this.livingEntities = r;
		this.removeUpdatableEntity(e);
		this.removeEntity(e, t)
	}
	removeEntity(e, t = !1) {
		const r = this.entities.filter((t => t.id != e.id));
		this.entities = r;
		t || this.entityPool.dispose(e.id)
	}
	getPlayer(e) {
		return this.players.get(e)
	}
	getPlayerByToken(e, t) {
		return [...this.players.values()].find((r => r.gameProfile.token == e && r.gameProfile.token_id == t))
	}
	getEntity(e) {
		return this.entities.find((t => t.id == e))
	}
	removeUpdatableEntity(e) {
		const t = this.updatableEntities.filter((t => t.id != e.id));
		this.updatableEntities = t
	}
	initEntityInst(e) {
		this.entities.push(e)
	}
	initStaticEntity(e) {
		this.staticEntities.push(e);
		this.initEntityInst(e)
	}
	initUpdatableEntity(e) {
		this.updatableEntities.push(e)
	}
	broadcastJSON(e, t = -1) {
		for (const r of this.players.values()) r.playerId != t && r.controller.sendJSON(e)
	}
	broadcastConsoleStaff(e) {
		for (const t of this.players.values()) t.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ConsoleCommandResponse, e])
	}
	broadcastBinary(e, t = -1) {
		for (const r of this.players.values()) r.playerId != t && r.controller.sendBinary(e)
	}
}
exports.GameServer = GameServer;