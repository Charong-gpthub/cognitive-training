const PREFIX = "cognitive-training:";

function resolveKey(key) {
    return `${PREFIX}${key}`;
}

export function getValue(key, fallback = null) {
    try {
        const raw = localStorage.getItem(resolveKey(key));
        return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
        console.warn("Failed to read localStorage value:", key, error);
        return fallback;
    }
}

export function setValue(key, value) {
    try {
        localStorage.setItem(resolveKey(key), JSON.stringify(value));
    } catch (error) {
        console.warn("Failed to persist localStorage value:", key, error);
    }
}
