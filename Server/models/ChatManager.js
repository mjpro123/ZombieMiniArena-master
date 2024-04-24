"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
exports.ChatManager = void 0;
const PacketType_1 = require("../enums/PacketType");
class ChatManager {
  sourcePlayer;
  messagesCounter = 0;
  chatTimestamp = -1;
  mutedUntil = -1;
  constructor(e) {
    this.sourcePlayer = e;
  }
  get isMuted() {
    return performance.now() < this.mutedUntil;
  }
  mute() {
    this.mutedUntil = performance.now() + 6e4;
  }
  onMessage(e) {
    if (this.isMuted) return;
    if (e.length > 200) return this.mute();
    const t = this.sourcePlayer.gameServer.queryManager.queryPlayers(
      this.sourcePlayer.x,
      this.sourcePlayer.y,
      2e3
    );
    for (const s of t)
      s.playerId != this.sourcePlayer.playerId &&
        s.controller.sendJSON([
          PacketType_1.ServerPacketTypeJson.Chat,
          this.sourcePlayer.playerId,
          e,
        ]);
    this.messagesCounter++;
    this.chatUpdate();
  }
  chatUpdate() {
    const e = performance.now();
    if (Math.abs(e - this.chatTimestamp) > 3e3) {
      this.chatTimestamp = performance.now();
      this.messagesCounter = 0;
    }
    if (this.messagesCounter >= 3 && !this.isMuted) {
      this.sourcePlayer.controller.sendJSON([
        PacketType_1.ServerPacketTypeJson.Muted,
      ]);
      this.mute();
    }
  }
}
exports.ChatManager = ChatManager;
//# sourceMappingURL=ChatManager.js.map
;
