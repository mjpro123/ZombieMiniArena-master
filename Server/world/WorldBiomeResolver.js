"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
exports.WorldBiomeResolver = exports.Biome = exports.WORLD = void 0;
const Biomes_1 = require("../enums/Biomes");
exports.WORLD = {
    TOP: 1,
    BOTTOM: 2,
    LEFT: 4,
    RIGHT: 8,
    ROTATE: 10
};
class Biome {
    x1;
    y1;
    w;
    h;
    x2;
    y2;
    t;
    v;
    constructor(e, s, i, o, t, r = 15) {
        this.x1 = 100 * s;
        this.y1 = 100 * i;
        this.w = 100 * o;
        this.h = 100 * t;
        this.x2 = 100 * (s + o);
        this.y2 = 100 * (i + t);
        this.t = e;
        this.v = r
    }
}
exports.Biome = Biome;
class WorldBiomeResolver {
    static dist_from_sand(e, s, i) {
        var o = 0;
        let t = e.x1 + 30 + (0 == (e.v & exports.WORLD.LEFT) ? 150 : 0);
        var r = s - t;
        (e.v & exports.WORLD.LEFT) > 0 && r > 0 && r < 320 && (o = 1);
        let m = e.y1 + 250 + (0 == (e.v & exports.WORLD.TOP) ? 150 : 0);
        r = i - m;
        (e.v & exports.WORLD.TOP) > 0 && r > 0 && r < 320 && (o = 1);
        let d = e.x2 + 80 + (0 == (e.v & exports.WORLD.RIGHT) ? -200 : 0);
        r = d - s;
        (e.v & exports.WORLD.RIGHT) > 0 && r > 0 && r < 320 && (o = 1);
        let _ = e.y2 - 200 + (0 == (e.v & exports.WORLD.BOTTOM) ? -200 : 0);
        r = _ - i;
        (e.v & exports.WORLD.BOTTOM) > 0 && r > 0 && r < 320 && (o = 1);
        return s >= t && s <= d && i >= m && i <= _ ? o : 0
    }
    static get_biome_id(e) {
        let s = Biomes_1.Biomes.SEA;
        e.dist_sand > 0 || e.dist_desert > 0 ? s = Biomes_1.Biomes.DESERT : e.dist_dragon > 0 ? s = Biomes_1.Biomes.DRAGON : e.dist_winter > 0 ? s = Biomes_1.Biomes.WINTER : e.dist_lava > 0 ? s = Biomes_1.Biomes.LAVA : e.dist_forest > 0 && (s = Biomes_1.Biomes.FOREST);
        return s
    }
    static update_dist_in_biomes(e) {
        const s = e.gameServer.worldGenerator;
        var i = e.x,
            o = e.y;
        e.dist_winter = -1e6;
        e.dist_desert = -1e6;
        e.dist_sand = -1e6;
        e.dist_lava = -1e6;
        e.dist_dragon = -1e6;
        e.dist_forest = -1e6;
        for (var t = 0; t < s.biomes.length; t++)
            if (s.biomes[t].t === Biomes_1.Biomes.FOREST) {
                const r = WorldBiomeResolver.dist_from_biome(t, i, o, s);
                e.dist_forest = Math.max(e.dist_forest, WorldBiomeResolver.dist_from_biome(t, i, o, s));
                r > 0 && 1 === WorldBiomeResolver.dist_from_sand(s.biomes[t], i, o) && (e.dist_sand = 1)
            } else s.biomes[t].t === Biomes_1.Biomes.WINTER ? e.dist_winter = Math.max(e.dist_winter, WorldBiomeResolver.dist_from_biome(t, i, o, s)) : s.biomes[t].t === Biomes_1.Biomes.DESERT ? e.dist_desert = Math.max(e.dist_desert, WorldBiomeResolver.dist_from_biome(t, i, o, s)) : s.biomes[t].t === Biomes_1.Biomes.LAVA ? e.dist_lava = Math.max(e.dist_lava, WorldBiomeResolver.dist_from_biome(t, i, o, s)) : s.biomes[t].t === Biomes_1.Biomes.DRAGON && (e.dist_dragon = Math.max(e.dist_dragon, WorldBiomeResolver.dist_from_biome(t, i, o, s)));
        e.dist_winter < 0 && e.dist_dragon < 0 && e.dist_forest < 0 && e.dist_dragon < 0 && e.dist_desert < 0 ? e.dist_water = 1 : e.dist_water = -1e6
    }
    static dist_from_biome(e, s, i, o) {
        var t = o.biomes[e],
            r = t.x1 + 30,
            m = t.y1 + 250,
            d = t.x2 + 80,
            _ = t.y2 - 200;
        if (s >= r && s <= d && i >= m && i <= _) return Math.min(s - r, d - s, i - m, _ - i);
        var a = -1e6;
        s - r < 0 ? a = Math.max(a, s - r) : d - s < 0 && (a = Math.max(a, d - s));
        var B = -1e6;
        if (i < m || i > _) {
            B = i - m < 0 ? Math.max(B, i - m) : Math.max(B, _ - i);
            a = -1e6 !== a && -1e6 !== B ? Math.min(a, B) : B
        }
        return a
    }
    static resolveBiomeSpeed(e) {
        switch (1) {
            case Biomes_1.Biomes.DESERT:
                break;
            case Biomes_1.Biomes.WINTER:
            case Biomes_1.Biomes.LAVA:
                return 1.5;
            case Biomes_1.Biomes.FOREST:
                return 1;
            case Biomes_1.Biomes.DRAGON:
                return 1.5;
            case Biomes_1.Biomes.SEA:
                return 3
        }
        return 1
    }
}
exports.WorldBiomeResolver = WorldBiomeResolver;