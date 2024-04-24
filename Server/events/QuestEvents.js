"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const QuestType_1 = require("../enums/QuestType"),
    Utils_1 = require("../utils/Utils"),
    bufferReader_1 = require("../utils/bufferReader"),
    PacketType_1 = require("../enums/PacketType");
class QuestEvents {
    static onClaimQuestReward(e, t) {
        if (t.completeQuests[e] != QuestType_1.QuestStateType.SUCCED) return;
        let r = Utils_1.Utils.getQuestRewardByQuestType(e);
        if (null == r || t.inventory.isInventoryFull(r[1])) return;
        const s = new bufferReader_1.BufferWriter(2);
        s.writeUInt8(PacketType_1.ServerPacketTypeBinary.Claimed);
        s.writeUInt8(e);
        t.controller.sendBinary(s.toBuffer());
        t.inventory.addItem(r[1], 1);
        t.gameProfile.score += r[0];
        t.completeQuests[e] = QuestType_1.QuestStateType.CLAIMED
    }
}
exports.default = QuestEvents;