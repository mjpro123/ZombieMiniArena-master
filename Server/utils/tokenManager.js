"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
class TokenManager {
    tokens;
    gameServer;
    constructor(gameServer) {
        this.tokens = [];
        this.gameServer = gameServer;
    }
    getToken(id) {
        for (let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i];
            token.index = i;
            if ((token.id !== id) && token.session_id !== id)
                continue;
            return token;
        }
        return false;
    }
    checkTokens() {
        for (let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i];
            if (token.timestamp && performance.now() - token.timestamp > 1 * 60 * 60 * 1000)
                this.deleteToken(token.id);
        }
        return true;
    }
    createToken(id) {
        let token = this.getToken(id);
        if (token)
            return token;
        token = {
            score: 0,
            id: id,
            index: 0,
            session_id: 0,
            session_info: 0,
            timestamp: 0,
            join_timestamp: 0,
        };
        this.checkTokens();
        this.tokens.push(token);
        return token;
    }
    deleteToken(id) {
        let token = this.getToken(id);
        if (!token)
            return false;
        this.tokens.splice(token.index, 1);
        return false;
    }
    joinToken(token, session_id) {
        let timeElapsed = performance.now() - token.timestamp;
        if (token.session_id !== session_id)
            token.session_info = 0, token.join_timestamp = performance.now();
        token.session_id = session_id;
        if (token.timestamp && timeElapsed > 1 * 60 * 60 * 1000) {
            token.score = 0;
            token.timestamp = 0;
        }
        return token;
    }
    leaveToken(token) { token.timestamp = performance.now(); }
    ;
}
exports.TokenManager = TokenManager;
