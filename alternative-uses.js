const ALL_PROMPTS = [
    { id: "aut-1", text: "砖头" },
    { id: "aut-2", text: "回形针" },
    { id: "aut-3", text: "塑料瓶" }
];
const ROUND_SECONDS = 60;
const CONTENT_VERSION = "alternative-uses-v2-seeded";

let round = 0;
let timeLeft = ROUND_SECONDS;
let timer = null;
let responses = [];
let sessionStartedAt = null;
let sessionSeed = "";
let sessionPrompts = [];
let promptOrder = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("aut-panel");
const resultModal = document.getElementById("result-modal");
const promptText = document.getElementById("prompt-text");
const usesInput = document.getElementById("uses-input");

function parseLines(text) {
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function tokenize(list) {
    return list
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9\u4e00-\u9fa5]+/)
        .filter(Boolean);
}

function currentUsesCount() {
    return parseLines(usesInput.value).length;
}

function updateBoard() {
    document.getElementById("round").textContent = String(round + 1);
    document.getElementById("time").textContent = `${timeLeft}s`;
    document.getElementById("uses-count").textContent = String(currentUsesCount());
}

function buildSessionPrompts() {
    const seeded = window.SeededRandom;
    sessionSeed = seeded ? seeded.createSessionSeed("alternative-uses") : `alternative-uses-${Date.now()}`;
    const rng = seeded ? seeded.createRngFromSeed(sessionSeed) : Math.random;
    sessionPrompts = seeded
        ? seeded.pickShuffled(ALL_PROMPTS, rng, ALL_PROMPTS.length)
        : ALL_PROMPTS.slice();
    promptOrder = sessionPrompts.map((item) => item.id);
}

function loadRound() {
    promptText.textContent = sessionPrompts[round].text;
    usesInput.value = "";
    timeLeft = ROUND_SECONDS;
    updateBoard();
}

function nextRound() {
    const lines = parseLines(usesInput.value);
    responses.push({
        promptId: sessionPrompts[round].id,
        prompt: sessionPrompts[round].text,
        uses: lines
    });

    round += 1;
    if (round >= sessionPrompts.length) {
        finish();
        return;
    }
    loadRound();
}

function finish() {
    if (timer) {
        clearInterval(timer);
    }
    const allUses = responses.flatMap((item) => item.uses);
    const totalUses = allUses.length;
    const words = tokenize(allUses);
    const uniqueWords = new Set(words).size;
    const diversity = words.length === 0 ? 0 : Math.round((uniqueWords / words.length) * 100);
    const avgLength = totalUses === 0
        ? 0
        : Math.round(allUses.reduce((sum, use) => sum + use.length, 0) / totalUses);

    document.getElementById("result-fluency").textContent = String(totalUses);
    document.getElementById("result-diversity").textContent = `${diversity}%`;
    document.getElementById("result-length").textContent = String(avgLength);

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "alternative-uses",
            gameName: "替代用途测验",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: totalUses,
            metrics: {
                prompts: sessionPrompts.length,
                fluency: totalUses,
                lexicalDiversity: diversity,
                avgUseLength: avgLength,
                seed: sessionSeed,
                contentVersion: CONTENT_VERSION,
                promptOrder
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    round = 0;
    responses = [];
    sessionStartedAt = new Date();
    buildSessionPrompts();

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        timeLeft -= 1;
        updateBoard();
        if (timeLeft <= 0) {
            nextRound();
        }
    }, 1000);

    loadRound();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.getElementById("next-btn").addEventListener("click", nextRound);
usesInput.addEventListener("input", () => {
    document.getElementById("uses-count").textContent = String(currentUsesCount());
});

window.startGame = startGame;
