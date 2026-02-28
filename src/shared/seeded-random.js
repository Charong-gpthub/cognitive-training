(function initSeededRandom(global) {
    function hashString(value) {
        const text = String(value || "");
        let hash = 2166136261 >>> 0;
        for (let i = 0; i < text.length; i += 1) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function mulberry32(seed) {
        let state = seed >>> 0;
        return function next() {
            state = (state + 0x6D2B79F5) >>> 0;
            let t = state;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function getSeedFromUrl(paramName = "seed") {
        const params = new URLSearchParams(global.location.search);
        const seed = params.get(paramName);
        return seed && seed.trim() ? seed.trim() : null;
    }

    function randomToken() {
        if (global.crypto && global.crypto.getRandomValues) {
            const bytes = new Uint32Array(2);
            global.crypto.getRandomValues(bytes);
            return `${bytes[0].toString(36)}${bytes[1].toString(36)}`;
        }
        return `${Math.floor(Math.random() * 1e9).toString(36)}`;
    }

    function createSessionSeed(prefix = "session") {
        const urlSeed = getSeedFromUrl("seed");
        if (urlSeed) {
            return urlSeed;
        }
        return `${prefix}-${Date.now().toString(36)}-${randomToken()}`;
    }

    function createRngFromSeed(seed) {
        return mulberry32(hashString(seed));
    }

    function shuffleInPlace(list, rng) {
        for (let i = list.length - 1; i > 0; i -= 1) {
            const j = Math.floor(rng() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }

    function pickShuffled(list, rng, count) {
        const copy = list.slice();
        shuffleInPlace(copy, rng);
        return copy.slice(0, Math.min(count, copy.length));
    }

    global.SeededRandom = {
        createSessionSeed,
        createRngFromSeed,
        shuffleInPlace,
        pickShuffled
    };
})(window);
