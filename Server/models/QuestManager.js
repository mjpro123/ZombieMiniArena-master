"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.QuestManager = void 0;
const QuestType_1 = require("../enums/QuestType"),
    PacketType_1 = require("../enums/PacketType"),
    bufferReader_1 = require("../utils/bufferReader"),
    QUESTS_LIST = [
        [QuestType_1.QuestType.ORANGE_CROWN, 96e4],
        [QuestType_1.QuestType.GREEN_CROWN, 144e4]
    ];
class Quest {
    time;
    type;
    constructor(e, t) {
        this.type = e;
        this.time = t
    }
}
class QuestManager {
    player;
    queueQuests = [];
    constructor(e) {
        this.player = e;
        for (let e = 0; e < QUESTS_LIST.length; e++) this.queueQuests.push(new Quest(QUESTS_LIST[e][0], QUESTS_LIST[e][1]))
    }
    checkQuestState(e) {
        return -1 != this.player.completeQuests[e]
    }
    removeQuest(e) {
        this.queueQuests = this.queueQuests.filter((t => t.type != e))
    }
    getQuest(e) {
        return this.queueQuests.find((t => t.type == e))
    }
    failQuest(e) {
        const t = this.getQuest(e);
        if (!t) return;
        const s = new bufferReader_1.BufferWriter(2);
        s.writeUInt8(PacketType_1.ServerPacketTypeBinary.QuestFailed, this.player.id);
        s.writeUInt8(t.type, this.player.id);
        this.player.controller.sendBinary(s.toBuffer());
        this.player.completeQuests[t.type] = QuestType_1.QuestStateType.FAILED;
        this.removeQuest(t.type)
    }
    succedQuest(e) {
        const t = this.getQuest(e);
        if (!t) return;
        const s = new bufferReader_1.BufferWriter(2);
        s.writeUInt8(PacketType_1.ServerPacketTypeBinary.QuestComplete, this.player.id);
        s.writeUInt8(t.type, this.player.id);
        this.player.controller.sendBinary(s.toBuffer());
        this.player.completeQuests[t.type] = QuestType_1.QuestStateType.SUCCED;
        this.removeQuest(t.type)
    }
    tickUpdate() {
        for (let e = 0; e < this.queueQuests.length; e++) {
            let t = this.queueQuests[e];
            if (performance.now() - this.player.spawnTime > t.time) switch (t.type) {
                case QuestType_1.QuestType.BLUE_CROWN:
                case QuestType_1.QuestType.GREEN_CROWN:
                    this.succedQuest(t.type);
                    break;
                default:
                    this.failQuest(t.type)
            }
        }
    }
}
exports.QuestManager = QuestManager;