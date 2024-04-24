"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bitwiseOperations(val, bits) {
    return (val >>> bits) | (val << (32 - bits));
};
const Encoder = new class Encoder {
    encode(e) {
        return function (e) {
            let t = 5, n = 48 + ~~(256 * Math.random());
            if ("object" != typeof e) return [];
            let o = [...e];
            o.push(n);
            for (let e = 0; e < o.length - 1; e++) o[e] ^= t, t = 10 * (t + 6) % 311, o[e] += n;
            return o
        }(function (e) {
            for (var t, n = [], o = 0; o < e.length; ++o) n.push((t = e.charCodeAt(o)) << 1 | t >>> 31);
            return new Uint16Array(n)
        }(JSON.stringify(e)))
    }

    decode(e) {
        e = Array.from(e)
        let t = 5;
        let n = e[e.length - 1];
        let d = e.slice(0, e.length - 1);

        for (let i = 0; i < d.length; i++) {
            d[i] -= n;
            d[i] ^= t;
            t = (10 * (t + 6)) % 311;
        }

        let s = "";
        for (let i = 0; i < d.length; i++) {
            let v = d[i] >>> 1;
            s += String.fromCharCode(v);
        }
        return JSON.parse(s);
    }
};
exports.Encoder = Encoder;